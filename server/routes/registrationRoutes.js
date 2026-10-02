const express = require("express");

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER FOR AN ACTIVITY
router.post("/:activityId", authenticateToken, async (req, res) => {
    try {
        // Only students can register
        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can register for activities"
            });
        }

        const { activityId } = req.params;

        // Check whether activity exists and is approved
        const [activities] = await db.query(
            `SELECT
                id,
                title,
                max_participants
             FROM activities
             WHERE id = ? AND status = 'approved'`,
            [activityId]
        );

        if (activities.length === 0) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }

        const activity = activities[0];

        // Check for existing registration
        const [existingRegistration] = await db.query(
            `SELECT id, status
             FROM registrations
             WHERE student_id = ? AND activity_id = ?`,
            [req.user.id, activityId]
        );

        if (existingRegistration.length > 0) {
            if (existingRegistration[0].status === "cancelled") {
                // Allow a student to register again after cancellation
                const [result] = await db.query(
                    `UPDATE registrations
                     SET status = 'registered',
                         registered_at = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [existingRegistration[0].id]
                );

                return res.json({
                    message: "Registration successful",
                    registrationId: result.insertId || existingRegistration[0].id
                });
            }

            return res.status(409).json({
                message: "You are already registered for this activity"
            });
        }

        // Check current participant count
        const [countResult] = await db.query(
            `SELECT COUNT(*) AS total
             FROM registrations
             WHERE activity_id = ?
             AND status = 'registered'`,
            [activityId]
        );

        const currentParticipants = countResult[0].total;

        // Check maximum participants
        if (
            activity.max_participants !== null &&
            currentParticipants >= activity.max_participants
        ) {
            return res.status(409).json({
                message: "Activity registration is full"
            });
        }

        // Create registration
        const [result] = await db.query(
            `INSERT INTO registrations
            (
                student_id,
                activity_id,
                status
            )
            VALUES (?, ?, 'registered')`,
            [req.user.id, activityId]
        );

        res.status(201).json({
            message: "Registration successful",
            registrationId: result.insertId,
            activity: activity.title
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// GET MY REGISTRATIONS
router.get("/my", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can view registrations"
            });
        }

        const [registrations] = await db.query(
            `SELECT
                r.id,
                r.status,
                r.registered_at,
                a.id AS activity_id,
                a.title,
                a.description,
                a.category,
                a.date,
                a.time,
                a.venue,
                a.eligibility,
                a.max_participants
             FROM registrations r
             JOIN activities a ON r.activity_id = a.id
             WHERE r.student_id = ?
             ORDER BY a.date ASC, a.time ASC`,
            [req.user.id]
        );

        res.json({
            registrations: registrations
        });

    } catch (error) {
        console.error("Get registrations error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// CANCEL REGISTRATION
router.put("/:activityId/cancel", authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can cancel registrations"
            });
        }

        const { activityId } = req.params;

        const [result] = await db.query(
            `UPDATE registrations
             SET status = 'cancelled'
             WHERE student_id = ?
             AND activity_id = ?
             AND status = 'registered'`,
            [req.user.id, activityId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Active registration not found"
            });
        }

        res.json({
            message: "Registration cancelled successfully"
        });

    } catch (error) {
        console.error("Cancel registration error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


module.exports = router;