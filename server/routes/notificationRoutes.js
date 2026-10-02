const express = require("express");

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// GET MY NOTIFICATIONS
router.get("/my", authenticateToken, async (req, res) => {
    try {

        const [notifications] = await db.query(
            `SELECT
                n.id,
                n.message,
                n.is_read,
                n.created_at,
                n.activity_id,
                a.title AS activity_title,
                a.date AS activity_date,
                a.time AS activity_time
             FROM notifications n
             LEFT JOIN activities a
                ON n.activity_id = a.id
             WHERE n.user_id = ?
             ORDER BY n.created_at DESC`,
            [req.user.id]
        );


        res.json({
            notifications: notifications
        });


    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// MARK NOTIFICATION AS READ
router.put("/:id/read", authenticateToken, async (req, res) => {
    try {

        const { id } = req.params;


        const [result] = await db.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = ?
             AND user_id = ?`,
            [id, req.user.id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Notification not found"
            });
        }


        res.json({
            message: "Notification marked as read"
        });


    } catch (error) {

        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// MARK ALL NOTIFICATIONS AS READ
router.put("/read-all", authenticateToken, async (req, res) => {
    try {

        await db.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE user_id = ?
             AND is_read = FALSE`,
            [req.user.id]
        );


        res.json({
            message: "All notifications marked as read"
        });


    } catch (error) {

        console.error(
            "Mark all notifications read error:",
            error
        );

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


module.exports = router;