const express = require("express");

const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// ADMIN ROLE CHECK
// =====================================

const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};


// =====================================
// GET PENDING ACTIVITIES
// =====================================

router.get(
    "/activities/pending",
    authenticateToken,
    requireAdmin,
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
                    u.name AS organizer_name,
                    u.email AS organizer_email
                FROM activities a
                JOIN users u ON a.organizer_id = u.id
                WHERE a.status = 'pending'
                ORDER BY a.created_at DESC`
            );

            res.json({
                activities: activities
            });

        } catch (error) {
            console.error("Get pending activities error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);


// =====================================
// APPROVE ACTIVITY
// =====================================

router.put(
    "/activities/:id/approve",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `UPDATE activities
                 SET status = 'approved'
                 WHERE id = ? AND status = 'pending'`,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pending activity not found"
                });
            }

            res.json({
                message: "Activity approved successfully"
            });

        } catch (error) {
            console.error("Approve activity error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);


// =====================================
// REJECT ACTIVITY
// =====================================

router.put(
    "/activities/:id/reject",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.query(
                `UPDATE activities
                 SET status = 'rejected'
                 WHERE id = ? AND status = 'pending'`,
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pending activity not found"
                });
            }

            res.json({
                message: "Activity rejected successfully"
            });

        } catch (error) {
            console.error("Reject activity error:", error);

            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
);


module.exports = router;