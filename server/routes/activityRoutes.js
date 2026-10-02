const express = require("express");

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// CREATE ACTIVITY
// =====================================
router.post("/", authenticateToken, async (req, res) => {
    try {
        // Only organizers can create activities
        if (req.user.role !== "organizer") {
            return res.status(403).json({
                message: "Only organizers can create activities"
            });
        }

        const {
            title,
            description,
            category,
            date,
            time,
            venue,
            eligibility,
            max_participants
        } = req.body;

        // Check required fields
        if (
            !title ||
            !category ||
            !date ||
            !time ||
            !venue
        ) {
            return res.status(400).json({
                message: "Title, category, date, time and venue are required"
            });
        }

        // Create activity
        const [result] = await db.query(
            `INSERT INTO activities
            (
                title,
                description,
                category,
                date,
                time,
                venue,
                eligibility,
                max_participants,
                organizer_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || null,
                category,
                date,
                time,
                venue,
                eligibility || null,
                max_participants || null,
                req.user.id
            ]
        );

        res.status(201).json({
            message: "Activity created successfully",
            activityId: result.insertId
        });

    } catch (error) {
        console.error("Create activity error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// =====================================
// GET ALL APPROVED ACTIVITIES
// =====================================
router.get("/", async (req, res) => {
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
                u.name AS organizer_name
            FROM activities a
            JOIN users u ON a.organizer_id = u.id
            WHERE a.status = 'approved'
            ORDER BY a.date ASC, a.time ASC`
        );

        res.json({
            activities: activities
        });

    } catch (error) {
        console.error("Get activities error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// =====================================
// GET SINGLE ACTIVITY
// =====================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

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
                u.name AS organizer_name
            FROM activities a
            JOIN users u ON a.organizer_id = u.id
            WHERE a.id = ? AND a.status = 'approved'`,
            [id]
        );

        if (activities.length === 0) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }

        res.json({
            activity: activities[0]
        });

    } catch (error) {
        console.error("Get activity error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


module.exports = router;