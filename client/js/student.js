/* =========================================================
   ONCAMPUS — STUDENT DASHBOARD
   ========================================================= */

const API_BASE = "http://localhost:5001/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const pageLoader = document.getElementById("pageLoader");

const studentName = document.getElementById("studentName");
const userInitial = document.getElementById("userInitial");

const logoutBtn = document.getElementById("logoutBtn");

const notificationShortcutBtn =
    document.getElementById("notificationShortcutBtn");

const notificationBadge =
    document.getElementById("notificationBadge");

const notificationSection =
    document.getElementById("notificationSection");

const notificationsContainer =
    document.getElementById("notificationsContainer");

const markAllReadBtn =
    document.getElementById("markAllReadBtn");

const activitiesContainer =
    document.getElementById("activitiesContainer");

const activityCount =
    document.getElementById("activityCount");

const heroActivityCount =
    document.getElementById("heroActivityCount");

const registrationsContainer =
    document.getElementById("registrationsContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const clearFiltersBtn =
    document.getElementById("clearFiltersBtn");

const exploreBtn =
    document.getElementById("exploreBtn");

const myEventsBtn =
    document.getElementById("myEventsBtn");

const announcementText =
    document.getElementById("announcementText");

const announcementNext =
    document.getElementById("announcementNext");

const heroChangingText =
    document.getElementById("heroChangingText");


/* =========================================================
   DATA
   ========================================================= */

let allActivities = [];
let myRegistrations = [];
let notifications = [];

let currentAnnouncement = 0;

const announcementMessages = [
    "Discover what's happening on campus.",
    "Find workshops, competitions and campus events.",
    "Register for activities in just a few clicks.",
    "Stay connected with campus life.",
    "Your next campus experience starts here."
];

const heroPhrases = [
    "on your campus.",
    "at RTU Kota.",
    "where you belong.",
    "worth being part of.",
    "waiting to be discovered.",
    "where campus life happens."
];


/* =========================================================
   API REQUEST
   ========================================================= */

async function apiRequest(url, options = {}) {

    const response = await fetch(
        `${API_BASE}${url}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`,

                ...(options.headers || {})
            }
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (
        response.status === 401 ||
        response.status === 403
    ) {

        localStorage.removeItem("token");

        window.location.href = "index.html";

        return null;
    }

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong"
        );
    }

    return data;
}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Date not available";
    }

    const value =
        String(dateValue).slice(0, 10);

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return value;
    }

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]) - 1;

    const day =
        Number(parts[2]);

    const date =
        new Date(
            year,
            month,
            day
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   TIME FORMAT
   ========================================================= */

function formatTime(timeValue) {

    if (!timeValue) {
        return "Time not available";
    }

    const value =
        String(timeValue);

    const parts =
        value.split(":");

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


/* =========================================================
   RELATIVE TIME
   ========================================================= */

function formatRelativeTime(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const now =
        new Date();

    const difference =
        Math.floor(
            (
                now.getTime() -
                date.getTime()
            ) / 1000
        );

    if (difference < 10) {
        return "Just now";
    }

    if (difference < 60) {
        return `${difference}s ago`;
    }

    const minutes =
        Math.floor(
            difference / 60
        );

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days =
        Math.floor(
            hours / 24
        );

    if (days < 7) {
        return `${days}d ago`;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   LOAD USER
   ========================================================= */

async function loadCurrentUser() {

    try {

        const data =
            await apiRequest(
                "/auth/me"
            );

        if (!data) {
            return;
        }

        const user =
            data.user ||
            data;

        const name =
            user.name ||
            "Student";


        if (studentName) {

            studentName.textContent =
                name;
        }


        if (userInitial) {

            userInitial.textContent =
                name
                    .trim()
                    .charAt(0)
                    .toUpperCase();
        }

    } catch (error) {

        console.error(
            "Load user error:",
            error
        );
    }
}


/* =========================================================
   LOAD ACTIVITIES
   ========================================================= */

async function loadActivities() {

    if (!activitiesContainer) {
        return;
    }

    activitiesContainer.innerHTML = `
        <div class="loading">
            Loading activities...
        </div>
    `;

    try {

        const data =
            await apiRequest(
                "/activities"
            );

        allActivities =
            Array.isArray(data)
                ? data
                : data.activities || [];

        updateActivityCounts();

        renderActivities();

        updateAnnouncement();

    } catch (error) {

        console.error(
            "Load activities error:",
            error
        );

        activitiesContainer.innerHTML = `
            <div class="empty-state">
                <strong>
                    Unable to load activities
                </strong>

                <p>
                    Please make sure the OnCampus server is running.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   ACTIVITY COUNTS
   ========================================================= */

function updateActivityCounts() {

    const count =
        allActivities.length;

    if (activityCount) {
        activityCount.textContent =
            count;
    }

    if (heroActivityCount) {
        heroActivityCount.textContent =
            count;
    }
}


/* =========================================================
   RENDER ACTIVITIES
   ========================================================= */

function renderActivities() {

    if (!activitiesContainer) {
        return;
    }

    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "";


    const filtered =
        allActivities.filter(
            activity => {

                const title =
                    String(
                        activity.title || ""
                    ).toLowerCase();

                const description =
                    String(
                        activity.description || ""
                    ).toLowerCase();

                const category =
                    String(
                        activity.category || ""
                    );


                const matchesSearch =
                    !searchTerm ||
                    title.includes(searchTerm) ||
                    description.includes(searchTerm) ||
                    category
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesCategory =
                    !selectedCategory ||
                    category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    if (activityCount) {

        activityCount.textContent =
            filtered.length;
    }


    if (filtered.length === 0) {

        activitiesContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    No activities found
                </strong>

                <p>
                    Try another search or category.
                </p>

            </div>
        `;

        return;
    }


    activitiesContainer.innerHTML =
        filtered
            .map(
                activity =>
                    createActivityCard(
                        activity
                    )
            )
            .join("");
}


/* =========================================================
   ACTIVITY CARD
   ========================================================= */

function createActivityCard(activity) {

    const id =
        Number(activity.id);

    const title =
        escapeHtml(
            activity.title
        );

    const description =
        escapeHtml(
            activity.description ||
            "No description available."
        );

    const category =
        escapeHtml(
            activity.category ||
            "Activity"
        );

    const date =
        formatDate(
            activity.date
        );

    const time =
        formatTime(
            activity.time
        );

    const venue =
        escapeHtml(
            activity.venue ||
            "Venue not specified"
        );

    const eligibility =
        escapeHtml(
            activity.eligibility ||
            "All students"
        );


    const registered =
        myRegistrations.some(
            registration =>
                Number(
                    registration.activity_id
                ) === id &&
                registration.status !==
                    "cancelled"
        );


    return `
        <article
            class="activity-card"
            data-activity-id="${id}"
        >

            <span class="activity-category">
                ${category}
            </span>


            <h3 class="activity-title">
                ${title}
            </h3>


            <p class="activity-description">
                ${description}
            </p>


            <div class="activity-meta">

                <div class="activity-meta-item">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${date}
                    </strong>

                </div>


                <div class="activity-meta-item">

                    <span>
                        Time
                    </span>

                    <strong>
                        ${time}
                    </strong>

                </div>


                <div class="activity-meta-item">

                    <span>
                        Venue
                    </span>

                    <strong>
                        ${venue}
                    </strong>

                </div>


                <div class="activity-meta-item">

                    <span>
                        Eligibility
                    </span>

                    <strong>
                        ${eligibility}
                    </strong>

                </div>

            </div>


            <div class="activity-actions">

                <button
                    class="activity-view-btn"
                    type="button"
                    onclick="viewActivity(${id})"
                >
                    View details
                </button>


                <button
                    class="activity-register-btn"
                    type="button"
                    onclick="registerActivity(${id})"
                    ${registered ? "disabled" : ""}
                >
                    ${
                        registered
                            ? "Registered"
                            : "Register"
                    }
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   VIEW ACTIVITY
   ========================================================= */

function viewActivity(activityId) {

    window.location.href =
        `activity.html?id=${activityId}`;
}


/* =========================================================
   REGISTER
   ========================================================= */

async function registerActivity(activityId) {

    const button =
        document.querySelector(
            `[data-activity-id="${activityId}"] .activity-register-btn`
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Registering...";
    }


    try {

        await apiRequest(
            `/registrations/${activityId}`,
            {
                method: "POST"
            }
        );


        await Promise.all([
            loadRegistrations(),
            loadNotifications()
        ]);


        renderActivities();


        showToast(
            "Successfully registered for the activity."
        );

    } catch (error) {

        console.error(
            "Register activity error:",
            error
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "Register";
        }


        showToast(
            error.message ||
            "Unable to register."
        );
    }
}


/* =========================================================
   LOAD REGISTRATIONS
   ========================================================= */

async function loadRegistrations() {

    if (!registrationsContainer) {
        return;
    }

    registrationsContainer.innerHTML = `
        <div class="loading">
            Loading registrations...
        </div>
    `;


    try {

        const data =
            await apiRequest(
                "/registrations/my"
            );


        myRegistrations =
            Array.isArray(data)
                ? data
                : data.registrations || [];


        renderRegistrations();


    } catch (error) {

        console.error(
            "Load registrations error:",
            error
        );


        registrationsContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    Unable to load registrations
                </strong>

                <p>
                    Please try again.
                </p>

            </div>
        `;
    }
}


/* =========================================================
   RENDER REGISTRATIONS
   ========================================================= */

function renderRegistrations() {

    if (!registrationsContainer) {
        return;
    }


    if (myRegistrations.length === 0) {

        registrationsContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    No registrations yet
                </strong>

                <p>
                    Explore campus activities and join something interesting.
                </p>

            </div>
        `;

        return;
    }


    registrationsContainer.innerHTML =
        myRegistrations
            .map(
                registration =>
                    createRegistrationCard(
                        registration
                    )
            )
            .join("");
}


/* =========================================================
   REGISTRATION CARD
   ========================================================= */

function createRegistrationCard(
    registration
) {

    const activityTitle =
        escapeHtml(
            registration.activity_title ||
            registration.title ||
            "Campus activity"
        );


    const date =
        formatDate(
            registration.activity_date ||
            registration.date
        );


    const time =
        formatTime(
            registration.activity_time ||
            registration.time
        );


    const venue =
        escapeHtml(
            registration.venue ||
            "Venue not available"
        );


    const status =
        String(
            registration.status ||
            "registered"
        ).toLowerCase();


    const activityId =
        Number(
            registration.activity_id ||
            registration.id
        );


    return `
        <article
            class="registration-card"
        >

            <h3>
                ${activityTitle}
            </h3>


            <span
                class="registration-status"
            >
                ${escapeHtml(status)}
            </span>


            <div
                class="registration-meta"
            >

                <span>
                    📅 ${date}
                </span>

                <span>
                    🕒 ${time}
                </span>

                <span>
                    📍 ${venue}
                </span>

            </div>


            ${
                status === "registered"
                    ? `
                        <button
                            class="registration-cancel-btn"
                            type="button"
                            onclick="cancelRegistration(${activityId})"
                        >
                            Cancel registration
                        </button>
                    `
                    : ""
            }

        </article>
    `;
}


/* =========================================================
   CANCEL REGISTRATION
   ========================================================= */

async function cancelRegistration(
    activityId
) {

    const confirmed =
        window.confirm(
            "Are you sure you want to cancel this registration?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `/registrations/${activityId}/cancel`,
            {
                method: "PUT"
            }
        );


        await Promise.all([
            loadRegistrations(),
            loadNotifications()
        ]);


        renderActivities();


        showToast(
            "Registration cancelled."
        );


    } catch (error) {

        console.error(
            "Cancel registration error:",
            error
        );


        showToast(
            error.message ||
            "Unable to cancel registration."
        );
    }
}


/* =========================================================
   LOAD NOTIFICATIONS
   ========================================================= */

async function loadNotifications() {

    if (!notificationsContainer) {
        return;
    }


    try {

        const data =
            await apiRequest(
                "/notifications/my"
            );


        notifications =
            Array.isArray(data)
                ? data
                : data.notifications || [];


        renderNotifications();


    } catch (error) {

        console.error(
            "Load notifications error:",
            error
        );


        notificationsContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    Unable to load notifications
                </strong>

                <p>
                    Please try again.
                </p>

            </div>
        `;
    }
}


/* =========================================================
   RENDER NOTIFICATIONS
   ========================================================= */

function renderNotifications() {

    if (!notificationsContainer) {
        return;
    }


    const unreadNotifications =
        notifications.filter(
            notification =>
                !Boolean(
                    notification.is_read
                )
        );


    updateNotificationBadge(
        unreadNotifications.length
    );


    if (
        unreadNotifications.length === 0
    ) {

        notificationsContainer.innerHTML = `
            <div class="empty-state">

                <strong>
                    You're all caught up
                </strong>

                <p>
                    New important updates will appear here.
                </p>

            </div>
        `;


        if (markAllReadBtn) {
            markAllReadBtn.style.display =
                "none";
        }


        return;
    }


    if (markAllReadBtn) {
        markAllReadBtn.style.display =
            "block";
    }


    notificationsContainer.innerHTML =
        unreadNotifications
            .map(
                notification =>
                    createNotificationCard(
                        notification
                    )
            )
            .join("");
}


/* =========================================================
   NOTIFICATION CARD
   ========================================================= */

function createNotificationCard(
    notification
) {

    const message =
        escapeHtml(
            notification.message ||
            "You have a new update."
        );


    const activityTitle =
        escapeHtml(
            notification.activity_title ||
            "OnCampus"
        );


    const createdAt =
        formatRelativeTime(
            notification.created_at
        );


    const notificationId =
        Number(
            notification.id
        );


    return `
        <article
            class="notification-item"
            data-notification-id="${notificationId}"
        >

            <div
                class="notification-icon"
            >
                ✓
            </div>


            <div
                class="notification-content"
            >

                <strong>
                    ${activityTitle}
                </strong>


                <p>
                    ${message}
                </p>


                <div
                    class="notification-time"
                >
                    ${createdAt}
                </div>

            </div>


            <button
                class="notification-read-btn"
                type="button"
                onclick="markNotificationRead(${notificationId})"
            >
                Read
            </button>

        </article>
    `;
}


/* =========================================================
   NOTIFICATION BADGE
   ========================================================= */

function updateNotificationBadge(
    count
) {

    if (!notificationBadge) {
        return;
    }


    notificationBadge.textContent =
        count;


    if (count > 0) {

        notificationBadge.classList.remove(
            "hidden"
        );

    } else {

        notificationBadge.classList.add(
            "hidden"
        );
    }
}


/* =========================================================
   MARK NOTIFICATION READ
   ========================================================= */

async function markNotificationRead(
    notificationId
) {

    try {

        await apiRequest(
            `/notifications/${notificationId}/read`,
            {
                method: "PUT"
            }
        );


        notifications =
            notifications.filter(
                notification =>
                    Number(
                        notification.id
                    ) !==
                    Number(
                        notificationId
                    )
            );


        renderNotifications();


    } catch (error) {

        console.error(
            "Mark notification read error:",
            error
        );


        showToast(
            error.message ||
            "Unable to update notification."
        );
    }
}


/* =========================================================
   MARK ALL READ
   ========================================================= */

async function markAllNotificationsRead() {

    try {

        await apiRequest(
            "/notifications/read-all",
            {
                method: "PUT"
            }
        );


        notifications =
            notifications.map(
                notification => ({
                    ...notification,
                    is_read: true
                })
            );


        renderNotifications();


    } catch (error) {

        console.error(
            "Mark all notifications error:",
            error
        );


        showToast(
            error.message ||
            "Unable to update notifications."
        );
    }
}


/* =========================================================
   SEARCH
   ========================================================= */

function handleSearch() {

    renderActivities();


    if (!clearSearchBtn) {
        return;
    }


    if (
        searchInput &&
        searchInput.value.trim()
    ) {

        clearSearchBtn.classList.add(
            "visible"
        );

    } else {

        clearSearchBtn.classList.remove(
            "visible"
        );
    }
}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

function clearSearch() {

    if (searchInput) {
        searchInput.value = "";
    }

    handleSearch();
}


/* =========================================================
   CLEAR FILTERS
   ========================================================= */

function clearFilters() {

    if (searchInput) {
        searchInput.value = "";
    }


    if (categoryFilter) {
        categoryFilter.value = "";
    }


    handleSearch();
}


/* =========================================================
   CATEGORY CARDS
   ========================================================= */

function setupCategoryCards() {

    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category;


                    if (categoryFilter) {

                        categoryFilter.value =
                            category;
                    }


                    renderActivities();


                    document
                        .getElementById(
                            "activities"
                        )
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                }
            );
        }
    );
}


/* =========================================================
   ANNOUNCEMENT
   ========================================================= */

function updateAnnouncement() {

    if (!announcementText) {
        return;
    }


    if (allActivities.length > 0) {

        const activity =
            allActivities[
                currentAnnouncement %
                allActivities.length
            ];


        announcementText.textContent =
            `${activity.title} • ${formatDate(activity.date)} • ${formatTime(activity.time)}`;

    } else {

        announcementText.textContent =
            announcementMessages[
                currentAnnouncement %
                announcementMessages.length
            ];
    }
}


/* =========================================================
   NEXT ANNOUNCEMENT
   ========================================================= */

function nextAnnouncement() {

    currentAnnouncement++;

    updateAnnouncement();
}


/* =========================================================
   HERO TYPING
   ========================================================= */

function startHeroTyping() {

    if (!heroChangingText) {
        return;
    }


    let phraseIndex = 0;

    let characterIndex = 0;

    let deleting = false;


    function typeLoop() {

        const phrase =
            heroPhrases[
                phraseIndex
            ];


        if (!deleting) {

            characterIndex++;


            heroChangingText.textContent =
                phrase.substring(
                    0,
                    characterIndex
                );


            if (
                characterIndex >=
                phrase.length
            ) {

                deleting = true;


                setTimeout(
                    typeLoop,
                    1800
                );


                return;
            }

        } else {

            characterIndex--;


            heroChangingText.textContent =
                phrase.substring(
                    0,
                    characterIndex
                );


            if (
                characterIndex <= 0
            ) {

                deleting = false;


                phraseIndex =
                    (
                        phraseIndex + 1
                    ) %
                    heroPhrases.length;


                setTimeout(
                    typeLoop,
                    350
                );


                return;
            }
        }


        setTimeout(
            typeLoop,
            deleting
                ? 45
                : 75
        );
    }


    typeLoop();
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal-section"
        );


    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        elements.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );
}


/* =========================================================
   HERO REVEAL
   ========================================================= */

function setupHeroReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal-item"
        );


    elements.forEach(
        element => {

            const delay =
                Number(
                    element.dataset.delay ||
                    0
                );


            setTimeout(
                () => {

                    element.classList.add(
                        "visible"
                    );

                },
                250 + delay
            );
        }
    );
}


/* =========================================================
   MAGNETIC BUTTONS
   ========================================================= */

function setupMagneticButtons() {

    const buttons =
        document.querySelectorAll(
            ".magnetic-btn"
        );


    if (
        window.matchMedia(
            "(pointer: coarse)"
        ).matches
    ) {
        return;
    }


    buttons.forEach(
        button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    button.style.transform =
                        `translate(${x * 0.08}px, ${y * 0.08}px)`;
                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";
                }
            );
        }
    );
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    if (exploreBtn) {

        exploreBtn.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "activities"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    }


    if (myEventsBtn) {

        myEventsBtn.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "registrations"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    }


    if (notificationShortcutBtn) {

        notificationShortcutBtn.addEventListener(
            "click",
            () => {

                notificationSection
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );


            window.location.href =
                "index.html";
        }
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const existing =
        document.querySelector(
            ".oncampus-toast"
        );


    if (existing) {
        existing.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "oncampus-toast";


    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {
            position: "fixed",
            right: "22px",
            bottom: "22px",
            zIndex: "99999",
            maxWidth: "340px",
            padding: "13px 17px",
            borderRadius: "10px",
            background: "#071522",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: "700",
            boxShadow:
                "0 15px 40px rgba(0,0,0,.22)",
            opacity: "0",
            transform:
                "translateY(12px)",
            transition:
                "all .3s ease"
        }
    );


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateY(0)";
        }
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(12px)";


            setTimeout(
                () => toast.remove(),
                300
            );

        },
        2800
    );
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        handleSearch
    );
}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        renderActivities
    );
}


if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
        "click",
        clearSearch
    );
}


if (clearFiltersBtn) {

    clearFiltersBtn.addEventListener(
        "click",
        clearFilters
    );
}


if (markAllReadBtn) {

    markAllReadBtn.addEventListener(
        "click",
        markAllNotificationsRead
    );
}


if (announcementNext) {

    announcementNext.addEventListener(
        "click",
        nextAnnouncement
    );
}


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

async function initializeDashboard() {

    setupHeroReveal();

    setupScrollReveal();

    setupMagneticButtons();

    setupNavigation();

    setupLogout();

    setupCategoryCards();

    startHeroTyping();


    await loadCurrentUser();


    await Promise.all([
        loadActivities(),
        loadRegistrations(),
        loadNotifications()
    ]);


    setTimeout(
        () => {

            if (pageLoader) {

                pageLoader.classList.add(
                    "hidden"
                );
            }

        },
        500
    );
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.viewActivity =
    viewActivity;

window.registerActivity =
    registerActivity;

window.cancelRegistration =
    cancelRegistration;

window.markNotificationRead =
    markNotificationRead;