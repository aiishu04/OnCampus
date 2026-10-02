const API_BASE = "http://localhost:5001/api";

/* =========================================================
   AUTH
========================================================= */

const token = localStorage.getItem("token");
let storedUser = null;

try {
    const userData = localStorage.getItem("user");

    if (userData) {
        storedUser = JSON.parse(userData);
    }
} catch (error) {
    console.error("Could not read stored user:", error);
}

if (!token || !storedUser) {
    window.location.href = "index.html";
}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const organizerName = document.getElementById("organizerName");
const welcomeName = document.getElementById("welcomeName");

const logoutBtn = document.getElementById("logoutBtn");

const showCreateBtn = document.getElementById("showCreateBtn");
const closeCreateBtn = document.getElementById("closeCreateBtn");

const createActivitySection =
    document.getElementById("createActivitySection");

const activityForm =
    document.getElementById("activityForm");

const activityMessage =
    document.getElementById("activityMessage");

const organizerActivities =
    document.getElementById("organizerActivities");


/* =========================================================
   LOADER
========================================================= */

function hideLoader() {
    const loader = document.getElementById("pageLoader");

    if (loader) {
        loader.classList.add("hidden");
    }
}

window.addEventListener("load", () => {
    setTimeout(hideLoader, 500);
});

/* Failsafe */
setTimeout(hideLoader, 1800);


/* =========================================================
   ROLE CHECK
========================================================= */

if (
    storedUser &&
    storedUser.role &&
    storedUser.role !== "organizer"
) {
    alert("Organizer access required.");
    window.location.href = "index.html";
}


/* =========================================================
   ORGANIZER NAME
========================================================= */

function loadOrganizerName() {

    if (!storedUser) {
        return;
    }

    const name =
        storedUser.name ||
        storedUser.full_name ||
        "Organizer";

    if (organizerName) {
        organizerName.textContent = name;
    }

    if (welcomeName) {
        welcomeName.textContent = name;
    }
}

loadOrganizerName();


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";

    });

}


/* =========================================================
   CREATE FORM
========================================================= */

if (showCreateBtn) {

    showCreateBtn.addEventListener("click", () => {

        if (!createActivitySection) {
            return;
        }

        createActivitySection.classList.remove("hidden");

        createActivitySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


if (closeCreateBtn) {

    closeCreateBtn.addEventListener("click", () => {

        if (!createActivitySection) {
            return;
        }

        createActivitySection.classList.add("hidden");

        clearActivityMessage();

    });

}


/* =========================================================
   MESSAGE HELPERS
========================================================= */

function showActivityMessage(message, type = "success") {

    if (!activityMessage) {
        return;
    }

    activityMessage.textContent = message;

    activityMessage.className = "message";

    if (type === "error") {
        activityMessage.classList.add("error");
    } else {
        activityMessage.classList.add("success");
    }

}


function clearActivityMessage() {

    if (!activityMessage) {
        return;
    }

    activityMessage.textContent = "";
    activityMessage.className = "message";

}


/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Date not available";
    }

    try {

        const dateString =
            String(dateValue).slice(0, 10);

        const parts =
            dateString.split("-");

        if (parts.length !== 3) {
            return dateValue;
        }

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (
            !year ||
            !month ||
            !day
        ) {
            return dateValue;
        }

        const date =
            new Date(
                year,
                month - 1,
                day
            );

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    } catch (error) {

        console.error(
            "Date formatting error:",
            error
        );

        return dateValue;

    }

}


/* =========================================================
   TIME FORMATTER
========================================================= */

function formatTime(timeValue) {

    if (!timeValue) {
        return "Time not available";
    }

    try {

        const timeString =
            String(timeValue).slice(0, 5);

        const parts =
            timeString.split(":");

        if (parts.length < 2) {
            return timeValue;
        }

        let hours = Number(parts[0]);
        const minutes = parts[1];

        const suffix =
            hours >= 12
                ? "PM"
                : "AM";

        hours =
            hours % 12 || 12;

        return `${hours}:${minutes} ${suffix}`;

    } catch (error) {

        console.error(
            "Time formatting error:",
            error
        );

        return timeValue;

    }

}


/* =========================================================
   STATUS FORMATTER
========================================================= */

function formatStatus(status) {

    if (!status) {
        return "Pending";
    }

    const normalized =
        String(status).toLowerCase();

    if (normalized === "approved") {
        return "Approved";
    }

    if (normalized === "rejected") {
        return "Rejected";
    }

    return "Pending";

}


function getStatusClass(status) {

    const normalized =
        String(status || "pending")
            .toLowerCase();

    if (normalized === "approved") {
        return "approved";
    }

    if (normalized === "rejected") {
        return "rejected";
    }

    return "pending";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CREATE ACTIVITY
========================================================= */

if (activityForm) {

    activityForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearActivityMessage();


            const title =
                document
                    .getElementById("title")
                    ?.value
                    .trim();

            const category =
                document
                    .getElementById("category")
                    ?.value
                    .trim();

            const description =
                document
                    .getElementById("description")
                    ?.value
                    .trim();

            const date =
                document
                    .getElementById("date")
                    ?.value;

            const time =
                document
                    .getElementById("time")
                    ?.value;

            const venue =
                document
                    .getElementById("venue")
                    ?.value
                    .trim();

            const eligibility =
                document
                    .getElementById("eligibility")
                    ?.value
                    .trim();

            const maxParticipants =
                document
                    .getElementById("maxParticipants")
                    ?.value;


            if (
                !title ||
                !category ||
                !date ||
                !time ||
                !venue
            ) {

                showActivityMessage(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            const submitButton =
                activityForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.dataset.originalText =
                    submitButton.innerHTML;

                submitButton.innerHTML =
                    "Submitting...";

            }


            try {

                const response =
                    await fetch(
                        `${API_BASE}/activities`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                title,
                                category,
                                description,
                                date,
                                time,
                                venue,
                                eligibility,

                                max_participants:
                                    maxParticipants
                                        ? Number(maxParticipants)
                                        : null

                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to create activity."
                    );

                }


                showActivityMessage(
                    "Activity created successfully. Waiting for admin approval.",
                    "success"
                );


                activityForm.reset();


                await loadOrganizerActivities();


                setTimeout(() => {

                    if (createActivitySection) {

                        createActivitySection.classList.add(
                            "hidden"
                        );

                    }

                    clearActivityMessage();

                }, 1500);


            } catch (error) {

                console.error(
                    "Create activity error:",
                    error
                );


                showActivityMessage(
                    error.message ||
                    "Something went wrong while creating the activity.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        submitButton.dataset.originalText ||
                        "Submit Activity";

                }

            }

        }
    );

}


/* =========================================================
   LOAD ORGANIZER ACTIVITIES
========================================================= */

async function loadOrganizerActivities() {

    if (!organizerActivities) {
        return;
    }


    organizerActivities.innerHTML = `
        <div class="organizer-loading">
            <div class="organizer-loading-line"></div>
            <p>Loading activities...</p>
        </div>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/organizer/activities`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load activities."
            );

        }


        const activities =
            Array.isArray(data)
                ? data
                : (
                    data.activities ||
                    []
                );


        renderActivities(activities);


    } catch (error) {

        console.error(
            "Load organizer activities error:",
            error
        );


        organizerActivities.innerHTML = `
            <div class="organizer-empty">
                <div class="organizer-empty-icon">
                    !
                </div>

                <h3>
                    Could not load activities
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Please try again."
                    )}
                </p>

                <button
                    type="button"
                    class="primary-btn"
                    onclick="loadOrganizerActivities()"
                >
                    Try Again
                </button>
            </div>
        `;

    }

}


/* =========================================================
   RENDER ACTIVITIES
========================================================= */

function renderActivities(activities) {

    if (!organizerActivities) {
        return;
    }


    if (
        !Array.isArray(activities) ||
        activities.length === 0
    ) {

        organizerActivities.innerHTML = `
            <div class="organizer-empty">

                <div class="organizer-empty-icon">
                    +
                </div>

                <h3>
                    No activities yet
                </h3>

                <p>
                    Create your first activity and get
                    students involved on campus.
                </p>

                <button
                    type="button"
                    class="primary-btn"
                    onclick="openCreateActivity()"
                >
                    Create Activity
                </button>

            </div>
        `;

        return;
    }


    organizerActivities.innerHTML =
        activities
            .map(
                (activity, index) =>
                    createActivityCard(
                        activity,
                        index
                    )
            )
            .join("");


    requestAnimationFrame(() => {

        const cards =
            organizerActivities.querySelectorAll(
                ".organizer-activity-card"
            );


        cards.forEach(
            (card, index) => {

                card.style.animationDelay =
                    `${index * 70}ms`;

            }
        );

    });

}


/* =========================================================
   ACTIVITY CARD
========================================================= */

function createActivityCard(
    activity,
    index
) {

    const status =
        getStatusClass(activity.status);


    const statusText =
        formatStatus(activity.status);


    const registeredCount =
        Number(
            activity.registered_count ||
            activity.participant_count ||
            0
        );


    const maxParticipants =
        activity.max_participants
            ? Number(activity.max_participants)
            : null;


    const capacityText =
        maxParticipants
            ? `${registeredCount}/${maxParticipants}`
            : `${registeredCount}`;


    const description =
        activity.description ||
        "No description provided.";


    const category =
        activity.category ||
        "Activity";


    const title =
        activity.title ||
        "Untitled Activity";


    const venue =
        activity.venue ||
        "Venue not specified";


    const date =
        formatDate(activity.date);


    const time =
        formatTime(activity.time);


    return `

        <article
            class="organizer-activity-card ${status}"
            style="animation-delay:${index * 70}ms"
        >

            <div class="organizer-card-top">

                <span class="activity-category">
                    ${escapeHTML(category)}
                </span>


                <span class="activity-status ${status}">
                    ${statusText}
                </span>

            </div>


            <div class="organizer-card-content">

                <h3>
                    ${escapeHTML(title)}
                </h3>


                <p class="activity-description">
                    ${escapeHTML(description)}
                </p>


                <div class="activity-meta-grid">

                    <div class="activity-meta">

                        <span class="meta-icon">
                            ◷
                        </span>

                        <div>

                            <small>
                                DATE
                            </small>

                            <strong>
                                ${escapeHTML(date)}
                            </strong>

                        </div>

                    </div>


                    <div class="activity-meta">

                        <span class="meta-icon">
                            ⏱
                        </span>

                        <div>

                            <small>
                                TIME
                            </small>

                            <strong>
                                ${escapeHTML(time)}
                            </strong>

                        </div>

                    </div>


                    <div class="activity-meta">

                        <span class="meta-icon">
                            ◎
                        </span>

                        <div>

                            <small>
                                VENUE
                            </small>

                            <strong>
                                ${escapeHTML(venue)}
                            </strong>

                        </div>

                    </div>


                    <div class="activity-meta">

                        <span class="meta-icon">
                            #
                        </span>

                        <div>

                            <small>
                                PARTICIPANTS
                            </small>

                            <strong>
                                ${escapeHTML(capacityText)}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <div class="organizer-card-bottom">

                <span class="approval-note">

                    ${
                        status === "approved"
                            ? "Published on OnCampus"
                            : status === "rejected"
                                ? "Not approved by admin"
                                : "Waiting for admin approval"
                    }

                </span>


                ${
                    registeredCount > 0
                        ? `
                            <button
                                type="button"
                                class="participant-btn"
                                onclick="viewParticipants(${Number(activity.id)})"
                            >
                                View Participants
                                <span>→</span>
                            </button>
                        `
                        : `
                            <span class="no-participants">
                                No registrations yet
                            </span>
                        `
                }

            </div>

        </article>

    `;

}


/* =========================================================
   OPEN CREATE ACTIVITY
========================================================= */

function openCreateActivity() {

    if (!createActivitySection) {
        return;
    }


    createActivitySection.classList.remove(
        "hidden"
    );


    createActivitySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   VIEW PARTICIPANTS
========================================================= */

async function viewParticipants(activityId) {

    if (!activityId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/organizer/activities/${activityId}/participants`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load participants."
            );

        }


        const participants =
            Array.isArray(data)
                ? data
                : (
                    data.participants ||
                    []
                );


        if (participants.length === 0) {

            alert(
                "No students have registered for this activity yet."
            );

            return;
        }


        const participantText =
            participants
                .map(
                    (student, index) => {

                        const name =
                            student.name ||
                            "Unknown student";

                        const email =
                            student.email ||
                            "No email";

                        return `${index + 1}. ${name} — ${email}`;

                    }
                )
                .join("\n");


        alert(
            `Registered Participants (${participants.length})\n\n${participantText}`
        );


    } catch (error) {

        console.error(
            "View participants error:",
            error
        );


        alert(
            error.message ||
            "Could not load participants."
        );

    }

}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadOrganizerActivities();

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.loadOrganizerActivities =
    loadOrganizerActivities;

window.openCreateActivity =
    openCreateActivity;

window.viewParticipants =
    viewParticipants;