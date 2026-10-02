const express = require("express");

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ORGANIZER ROLE CHECK
const requireOrganizer = (req, res, next) => {
    if (req.user.role !== "organizer") {
        return res.status(403).json({
            message: "Organizer access required"
        });
    }

    next();
};


// GET PARTICIPANTS FOR AN ACTIVITY
router.get(
    "/activities/:activityId/participants",
    authenticateToken,
    requireOrganizer,
    async (req, res) => {
        try {
            const { activityId } = req.params;

            // Check that the activity belongs to this organizer
            const [activities] = await db.query(
                `SELECT
                    id,
                    title,
                    organizer_id
                 FROM activities
                 WHERE id = ?`,
                [activityId]
            );

            if (activities.length === 0) {
                return res.status(404).json({
                    message: "Activity not found"
                });
            }

            const activity = activities[0];

            if (activity.organizer_id !== req.user.id) {
                return res.status(403).json({
                    message: "You can only view participants for your own activities"
                });
            }

            // Get registered students
            const [participants] = await db.query(
                `SELECT
                    r.id AS registration_id,
                    u.id AS student_id,
                    u.name AS student_name,
                    u.email AS student_email,
                    r.status,
                    r.registered_at
                 FROM registrations r
                 JOIN users u ON r.student_id = u.id
                 WHERE r.activity_id = ?
                 ORDER BY r.registered_at ASC`,
                [activityId]
            );

            res.json({
                activity: {
                    id: activity.id,
                    title: activity.title
                },
                totalParticipants: participants.length,
                participants: participants
            });

        } catch (error) {
            console.error("Get participants error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);


// GET ORGANIZER'S ACTIVITIES
router.get(
    "/activities",
    authenticateToken,
    requireOrganizer,
    async (req, res) => {
        try {
            const [activities] = await db.query(
                `SELECT
                    a.id,
                    a.title,
                    a.description,
                    a.category,
                    a.date,
                    a.time,
                    a.venue,
                    a.eligibility,
                    a.max_participants,
                    a.status,
                    a.created_at,
                    COUNT(
                        CASE
                            WHEN r.status = 'registered'
                            THEN r.id
                        END
                    ) AS registered_count
                 FROM activities a
                 LEFT JOIN registrations r
                    ON a.id = r.activity_id
                 WHERE a.organizer_id = ?
                 GROUP BY
                    a.id,
                    a.title,
                    a.description,
                    a.category,
                    a.date,
                    a.time,
                    a.venue,
                    a.eligibility,
                    a.max_participants,
                    a.status,
                    a.created_at
                 ORDER BY a.created_at DESC`,
                [req.user.id]
            );

            res.json({
                activities: activities
            });

        } catch (error) {
            console.error("Get organizer activities error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);


module.exports = router;