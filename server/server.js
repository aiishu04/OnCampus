const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to OnCampus API"
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const [result] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        res.json({
            status: "OK",
            database: result[0].database_name
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            status: "ERROR",
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`OnCampus server running on port ${PORT}`);
});