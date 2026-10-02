const API_BASE = "http://localhost:5001/api";

const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

if (!token || !userData) {
    window.location.href = "index.html";
}

let user = null;

try {
    user = JSON.parse(userData);
} catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

if (!user || user.role !== "admin") {
    window.location.href = "index.html";
}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const adminName = document.getElementById("adminName");
const adminInitial = document.getElementById("adminInitial");
const welcomeName = document.getElementById("welcomeName");

const pendingCount = document.getElementById("pendingCount");
const heroPendingCount = document.getElementById("heroPendingCount");
const sectionPendingCount = document.getElementById("sectionPendingCount");

const pendingActivities = document.getElementById("pendingActivities");

const logoutBtn = document.getElementById("logoutBtn");

const pageLoader = document.getElementById("pageLoader");

const adminToast = document.getElementById("adminToast");
const adminToastTitle = document.getElementById("adminToastTitle");
const adminToastMessage = document.getElementById("adminToastMessage");


/* =========================================================
   LOADER
   ========================================================= */

function hideLoader() {
    if (pageLoader) {
        pageLoader.classList.add("hidden");
    }
}

window.addEventListener("load", () => {
    setTimeout(hideLoader, 500);
});

setTimeout(hideLoader, 1800);


/* =========================================================
   USER INFO
   ========================================================= */

if (user) {
    const displayName = user.name || "Admin";

    if (adminName) {
        adminName.textContent = displayName;
    }

    if (welcomeName) {
        welcomeName.textContent = displayName;
    }

    if (adminInitial) {
        adminInitial.textContent =
            displayName.charAt(0).toUpperCase();
    }
}


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
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(
    title,
    message,
    type = "success"
) {
    if (!adminToast) {
        return;
    }

    if (adminToastTitle) {
        adminToastTitle.textContent = title;
    }

    if (adminToastMessage) {
        adminToastMessage.textContent = message;
    }

    const icon = adminToast.querySelector(
        ".admin-toast-icon"
    );

    if (icon) {
        if (type === "error") {
            icon.textContent = "!";
            icon.style.background = "#fff0f0";
            icon.style.color = "#d84b4b";
        } else {
            icon.textContent = "✓";
            icon.style.background = "#eaf8f0";
            icon.style.color = "#2a9b5e";
        }
    }

    adminToast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        adminToast.classList.remove("show");
    }, 3500);
}


/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatDate(dateValue) {
    if (!dateValue) {
        return "Date not available";
    }

    const dateString =
        String(dateValue).slice(0, 10);

    const parts = dateString.split("-");

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

    const date = new Date(
        year,
        month - 1,
        day
    );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   TIME FORMATTER
   ========================================================= */

function formatTime(timeValue) {
    if (!timeValue) {
        return "Time not available";
    }

    const timeString =
        String(timeValue).slice(0, 5);

    const parts =
        timeString.split(":");

    if (parts.length < 2) {
        return timeValue;
    }

    let hours = Number(parts[0]);
    const minutes = parts[1];

    if (Number.isNaN(hours)) {
        return timeValue;
    }

    const period =
        hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
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
   LOAD PENDING ACTIVITIES
   ========================================================= */

async function loadPendingActivities() {
    if (!pendingActivities) {
        return;
    }

    pendingActivities.innerHTML = `
        <div class="admin-loading">
            <div class="admin-loading-spinner"></div>
            <p>Loading activities...</p>
        </div>
    `;

    try {
        const response = await fetch(
            `${API_BASE}/admin/activities/pending`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "index.html";

            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load pending activities."
            );
        }

        const activities =
            data.activities || [];

        updatePendingCounts(
            activities.length
        );

        renderPendingActivities(
            activities
        );

    } catch (error) {
        console.error(
            "Load pending activities error:",
            error
        );

        updatePendingCounts(0);

        pendingActivities.innerHTML = `
            <div class="admin-error">
                Unable to load pending activities.
                Please check that the server is running.
            </div>
        `;

        showToast(
            "Something went wrong",
            "Could not load pending activities.",
            "error"
        );
    } finally {
        hideLoader();
    }
}


/* =========================================================
   UPDATE COUNTS
   ========================================================= */

function updatePendingCounts(count) {

    if (pendingCount) {
        pendingCount.textContent = count;
    }

    if (heroPendingCount) {
        heroPendingCount.textContent = count;
    }

    if (sectionPendingCount) {
        sectionPendingCount.textContent = count;
    }
}


/* =========================================================
   RENDER PENDING ACTIVITIES
   ========================================================= */

function renderPendingActivities(
    activities
) {
    if (!pendingActivities) {
        return;
    }

    if (!activities.length) {

        pendingActivities.innerHTML = `
            <div class="admin-empty">

                <div class="admin-empty-icon">
                    ✓
                </div>

                <h3>Review queue is clear</h3>

                <p>
                    There are currently no activities
                    waiting for approval.
                </p>

            </div>
        `;

        return;
    }

    pendingActivities.innerHTML =
        activities.map(
            (activity, index) => {

                const title =
                    escapeHTML(
                        activity.title
                    );

                const description =
                    escapeHTML(
                        activity.description ||
                        "No description provided."
                    );

                const category =
                    escapeHTML(
                        activity.category ||
                        "Activity"
                    );

                const venue =
                    escapeHTML(
                        activity.venue ||
                        "Venue not specified"
                    );

                const eligibility =
                    escapeHTML(
                        activity.eligibility ||
                        "Not specified"
                    );

                const organizerName =
                    escapeHTML(
                        activity.organizer_name ||
                        activity.organizer ||
                        "Unknown organizer"
                    );

                const organizerEmail =
                    escapeHTML(
                        activity.organizer_email ||
                        ""
                    );

                const maxParticipants =
                    activity.max_participants ??
                    "Not specified";

                const date =
                    formatDate(
                        activity.date
                    );

                const time =
                    formatTime(
                        activity.time
                    );

                return `
                    <article
                        class="admin-activity-card"
                        style="animation-delay: ${index * 60}ms"
                    >

                        <div class="admin-activity-content">

                            <span class="activity-category">
                                ${category}
                            </span>

                            <h3>
                                ${title}
                            </h3>

                            <p class="admin-description">
                                ${description}
                            </p>

                            <div class="admin-activity-info">

                                <span>
                                    📅 ${date}
                                </span>

                                <span>
                                    ◷ ${time}
                                </span>

                                <span>
                                    ⌖ ${venue}
                                </span>

                                <span>
                                    👥 ${escapeHTML(
                                        String(maxParticipants)
                                    )} seats
                                </span>

                            </div>

                            <div class="organizer-details">

                                <strong>
                                    Organizer
                                </strong>

                                <span>
                                    ${organizerName}
                                </span>

                                ${
                                    organizerEmail
                                    ? `
                                        <span>
                                            ${organizerEmail}
                                        </span>
                                    `
                                    : ""
                                }

                                <span>
                                    Eligibility:
                                    ${eligibility}
                                </span>

                            </div>

                        </div>


                        <div class="admin-actions">

                            <span class="activity-status pending">
                                Pending review
                            </span>

                            <button
                                class="approve-btn"
                                onclick="approveActivity(${activity.id})"
                            >
                                Approve Activity
                            </button>

                            <button
                                class="reject-btn"
                                onclick="rejectActivity(${activity.id})"
                            >
                                Reject Activity
                            </button>

                        </div>

                    </article>
                `;
            }
        ).join("");
}


/* =========================================================
   APPROVE ACTIVITY
   ========================================================= */

async function approveActivity(
    activityId
) {
    const confirmed =
        window.confirm(
            "Approve this activity?"
        );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/admin/activities/${activityId}/approve`,
            {
                method: "PUT",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "index.html";

            return;
        }

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to approve activity."
            );
        }

        showToast(
            "Activity approved",
            "The activity is now available to students."
        );

        await loadPendingActivities();

    } catch (error) {

        console.error(
            "Approve activity error:",
            error
        );

        showToast(
            "Approval failed",
            error.message ||
            "Unable to approve activity.",
            "error"
        );
    }
}


/* =========================================================
   REJECT ACTIVITY
   ========================================================= */

async function rejectActivity(
    activityId
) {
    const confirmed =
        window.confirm(
            "Reject this activity?"
        );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/admin/activities/${activityId}/reject`,
            {
                method: "PUT",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "index.html";

            return;
        }

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to reject activity."
            );
        }

        showToast(
            "Activity rejected",
            "The activity has been removed from the review queue."
        );

        await loadPendingActivities();

    } catch (error) {

        console.error(
            "Reject activity error:",
            error
        );

        showToast(
            "Rejection failed",
            error.message ||
            "Unable to reject activity.",
            "error"
        );
    }
}


/* =========================================================
   GLOBAL BUTTON FUNCTIONS
   ========================================================= */

window.approveActivity =
    approveActivity;

window.rejectActivity =
    rejectActivity;


/* =========================================================
   INITIAL LOAD
   ========================================================= */

loadPendingActivities();