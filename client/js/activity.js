const API_BASE = "http://localhost:5001/api";

const token = localStorage.getItem("token");

let storedUser = null;

try {
    storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );
} catch (error) {
    console.error("User data error:", error);
    storedUser = null;
}

const params = new URLSearchParams(
    window.location.search
);

const activityId = params.get("id");


// =====================================================
// ELEMENTS
// =====================================================

const loader = document.getElementById("pageLoader");

const activityTitle =
    document.getElementById("activityTitle");

const activityCategory =
    document.getElementById("activityCategory");

const activityOrganizer =
    document.getElementById("activityOrganizer");

const activityDescription =
    document.getElementById("activityDescription");

const activityDate =
    document.getElementById("activityDate");

const activityTime =
    document.getElementById("activityTime");

const activityVenue =
    document.getElementById("activityVenue");

const activityParticipants =
    document.getElementById("activityParticipants");

const activityEligibility =
    document.getElementById("activityEligibility");

const activityStatus =
    document.getElementById("activityStatus");

const registerActivityBtn =
    document.getElementById("registerActivityBtn");

const activityUserName =
    document.getElementById("activityUserName");

const activityUserInitial =
    document.getElementById("activityUserInitial");

const activityLogoutBtn =
    document.getElementById("activityLogoutBtn");

const activityToast =
    document.getElementById("activityToast");


// =====================================================
// LOADER
// =====================================================

function hideLoader() {

    if (!loader) {
        return;
    }

    loader.classList.add("hidden");
}


// Hide normally after page resources load
window.addEventListener("load", () => {

    setTimeout(() => {
        hideLoader();
    }, 500);

});


// Failsafe:
// even if an image/resource takes too long,
// the page will not remain stuck on the loader.
setTimeout(() => {

    hideLoader();

}, 1800);


// =====================================================
// AUTH
// =====================================================

if (!token || !storedUser) {

    hideLoader();

    window.location.href = "index.html";

}


// =====================================================
// USER
// =====================================================

function setupUser() {

    if (!storedUser) {
        return;
    }

    const name =
        storedUser.name ||
        storedUser.full_name ||
        "Student";

    if (activityUserName) {

        activityUserName.textContent = name;

    }

    if (activityUserInitial) {

        activityUserInitial.textContent =
            name
                .charAt(0)
                .toUpperCase();

    }

}


// =====================================================
// DATE
// =====================================================

function formatDate(value) {

    if (!value) {
        return "—";
    }

    let dateString = String(value);

    // Prevent timezone shifting
    if (dateString.includes("T")) {

        dateString =
            dateString.split("T")[0];

    }

    const parts =
        dateString.split("-");

    if (parts.length !== 3) {

        return dateString;

    }

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const day =
        Number(parts[2]);

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

}


// =====================================================
// TIME
// =====================================================

function formatTime(value) {

    if (!value) {
        return "—";
    }

    const parts =
        String(value).split(":");

    if (parts.length < 2) {
        return value;
    }

    let hours =
        Number(parts[0]);

    const minutes =
        parts[1];

    const suffix =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${suffix}`;

}


// =====================================================
// LOAD ACTIVITY
// =====================================================

async function loadActivity() {

    if (!activityId) {

        showError(
            "No activity was selected."
        );

        hideLoader();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/activities/${activityId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load activity."
            );

        }


        const activity =
            data.activity ||
            data;


        displayActivity(activity);


    } catch (error) {

        console.error(
            "Activity loading error:",
            error
        );


        showError(
            error.message ||
            "Something went wrong."
        );

    } finally {

        hideLoader();

    }

}


// =====================================================
// DISPLAY ACTIVITY
// =====================================================

function displayActivity(activity) {

    if (!activity) {

        showError(
            "Activity information was not found."
        );

        return;

    }


    if (activityTitle) {

        activityTitle.textContent =
            activity.title ||
            "Untitled Activity";

    }


    if (activityCategory) {

        activityCategory.textContent =
            (
                activity.category ||
                "ACTIVITY"
            ).toUpperCase();

    }


    if (activityOrganizer) {

        activityOrganizer.textContent =
            activity.organizer_name ||
            activity.organizer ||
            "OnCampus Organizer";

    }


    if (activityDescription) {

        activityDescription.textContent =
            activity.description ||
            "No description has been added for this activity.";

    }


    if (activityDate) {

        activityDate.textContent =
            formatDate(
                activity.date
            );

    }


    if (activityTime) {

        activityTime.textContent =
            formatTime(
                activity.time
            );

    }


    if (activityVenue) {

        activityVenue.textContent =
            activity.venue ||
            "Venue not specified";

    }


    if (activityEligibility) {

        activityEligibility.textContent =
            activity.eligibility ||
            "All students";

    }


    if (activityParticipants) {

        if (
            activity.max_participants !== null &&
            activity.max_participants !== undefined
        ) {

            activityParticipants.textContent =
                `${activity.max_participants} participants`;

        } else {

            activityParticipants.textContent =
                "Open";

        }

    }


    if (activityStatus) {

        activityStatus.innerHTML = `
            <span class="activity-status-dot"></span>
            Available
        `;

    }

}


// =====================================================
// REGISTER
// =====================================================

async function registerForActivity() {

    if (!activityId) {
        return;
    }

    if (!registerActivityBtn) {
        return;
    }


    registerActivityBtn.disabled = true;


    registerActivityBtn.innerHTML = `
        <span>Registering...</span>
        <b>...</b>
    `;


    try {

        const response =
            await fetch(
                `${API_BASE}/registrations/${activityId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Registration failed."
            );

        }


        registerActivityBtn.innerHTML = `
            <span>Registered ✓</span>
            <b>✓</b>
        `;


        registerActivityBtn.classList.add(
            "registered"
        );


        showToast(
            "Registration successful",
            "This activity has been added to your events."
        );


        setTimeout(() => {

            window.location.href =
                "student.html#registrations";

        }, 1400);


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        registerActivityBtn.disabled =
            false;


        registerActivityBtn.innerHTML = `
            <span>Register now</span>
            <b>→</b>
        `;


        showToast(
            "Registration failed",
            error.message ||
            "Please try again."
        );

    }

}


// =====================================================
// TOAST
// =====================================================

function showToast(
    title,
    message
) {

    if (!activityToast) {
        return;
    }


    const titleElement =
        activityToast.querySelector(
            "strong"
        );


    const messageElement =
        activityToast.querySelector(
            "span"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    activityToast.classList.add(
        "show"
    );


    setTimeout(() => {

        activityToast.classList.remove(
            "show"
        );

    }, 3500);

}


// =====================================================
// ERROR STATE
// =====================================================

function showError(message) {

    if (activityTitle) {

        activityTitle.textContent =
            "Activity unavailable";

    }


    if (activityCategory) {

        activityCategory.textContent =
            "ERROR";

    }


    if (activityOrganizer) {

        activityOrganizer.textContent =
            "OnCampus";

    }


    if (activityDescription) {

        activityDescription.textContent =
            message;

    }


    if (activityDate) {

        activityDate.textContent =
            "—";

    }


    if (activityTime) {

        activityTime.textContent =
            "—";

    }


    if (activityVenue) {

        activityVenue.textContent =
            "—";

    }


    if (activityParticipants) {

        activityParticipants.textContent =
            "—";

    }


    if (activityEligibility) {

        activityEligibility.textContent =
            "Unavailable";

    }


    if (activityStatus) {

        activityStatus.innerHTML = `
            <span
                class="activity-status-dot"
                style="
                    background:#e36d12;
                    box-shadow:none;
                "
            ></span>
            Unavailable
        `;

    }


    if (registerActivityBtn) {

        registerActivityBtn.disabled =
            true;

        registerActivityBtn.innerHTML = `
            <span>Unavailable</span>
            <b>×</b>
        `;

    }

}


// =====================================================
// LOGOUT
// =====================================================

if (activityLogoutBtn) {

    activityLogoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "index.html";

        }
    );

}


// =====================================================
// REGISTER BUTTON
// =====================================================

if (registerActivityBtn) {

    registerActivityBtn.addEventListener(
        "click",
        registerForActivity
    );

}


// =====================================================
// INITIALIZE
// =====================================================

setupUser();

loadActivity();