const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());


// =========================
// ROUTES
// =========================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/activities",
    activityRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/registrations",
    registrationRoutes
);

app.use(
    "/api/organizer",
    organizerRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);


// =========================
// HOME
// =========================

app.get("/", (req, res) => {

    res.json({
        message: "Welcome to OnCampus API"
    });

});


// =========================
// DATABASE HEALTH CHECK
// =========================

app.get(
    "/api/health",
    async (req, res) => {

        try {

            const [result] =
                await db.query(
                    "SELECT DATABASE() AS database_name"
                );


            res.json({
                status: "OK",
                database:
                    result[0].database_name
            });


        } catch (error) {

            console.error(
                "Database connection error:",
                error
            );


            res.status(500).json({
                status: "ERROR",
                message:
                    "Database connection failed"
            });

        }

    }
);


// =========================
// START SERVER
// =========================

const PORT =
    process.env.PORT || 5001;


app.listen(
    PORT,
    () => {

        console.log(
            `OnCampus server running on port ${PORT}`
        );

    }
);