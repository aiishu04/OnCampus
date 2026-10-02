const API_BASE = "http://localhost:5001/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) {
    window.location.href = "index.html";
}

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
    activities: [],
    registrations: [],
    notifications: []
};

/* =========================================================
   HELPERS
   ========================================================= */

const escapeHTML = (value) =>
    String(value ?? "").replace(
        /[&<>'"]/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#039;",
            '"': "&quot;"
        }[char])
    );

function formatDate(value, short = false) {
    if (!value) return "—";

    const raw = String(value).split("T")[0];

    const [year, month, day] = raw
        .split("-")
        .map(Number);

    if (!year || !month || !day) {
        return String(value);
    }

    return new Date(
        year,
        month - 1,
        day
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: short ? "short" : "long",
        year: "numeric"
    });
}

function formatTime(value) {
    if (!value) return "—";

    const [h, m] = String(value).split(":");

    if (h === undefined || m === undefined) {
        return value;
    }

    let hours = Number(h);

    const suffix = hours >= 12
        ? "PM"
        : "AM";

    hours %= 12;

    if (!hours) {
        hours = 12;
    }

    return `${hours}:${m} ${suffix}`;
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(title, message) {
    const toast = $("#toast");

    if (!toast) return;

    const toastTitle = $("#toastTitle");
    const toastMessage = $("#toastMessage");

    if (toastTitle) {
        toastTitle.textContent = title;
    }

    if (toastMessage) {
        toastMessage.textContent = message;
    }

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

/* =========================================================
   USER
   ========================================================= */

function setupUser() {
    const name = user?.name || "Student";

    const studentName = $("#studentName");
    const userInitial = $("#userInitial");

    if (studentName) {
        studentName.textContent = name;
    }

    if (userInitial) {
        userInitial.textContent =
            name.charAt(0).toUpperCase();
    }
}

/* =========================================================
   LOADER
   ========================================================= */

function setupLoader() {
    window.addEventListener("load", () => {
        setTimeout(() => {
            const loader = $("#pageLoader");

            if (loader) {
                loader.classList.add("hidden");
            }
        }, 400);
    });

    /* Safety fallback */
    setTimeout(() => {
        const loader = $("#pageLoader");

        if (loader) {
            loader.classList.add("hidden");
        }
    }, 2000);
}

/* =========================================================
   HERO TYPING
   ========================================================= */

function setupTyping() {
    const target = $("#heroChangingText");

    if (!target) return;

    const phrases = [
        "on your campus.",
        "at RTU Kota.",
        "where you belong.",
        "worth being part of.",
        "waiting to be discovered.",
        "where campus life happens."
    ];

    let phrase = 0;
    let index = 0;
    let deleting = false;

    function tick() {
        const text = phrases[phrase];

        target.textContent =
            text.slice(0, index);

        let delay = deleting
            ? 42
            : 70;

        if (!deleting && index < text.length) {

            index++;

        } else if (!deleting) {

            deleting = true;
            delay = 1800;

        } else if (index > 0) {

            index--;

        } else {

            deleting = false;

            phrase =
                (phrase + 1) %
                phrases.length;

            delay = 450;
        }

        setTimeout(tick, delay);
    }

    tick();
}

/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

function setupReveal() {
    const items = $$(".reveal-section");

    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {

        items.forEach(item => {
            item.classList.add("visible");
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

    items.forEach(item => {
        observer.observe(item);
    });
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    $("#exploreBtn")?.addEventListener(
        "click",
        () => {
            location.href = "activities.html";
        }
    );

    $("#myEventsBtn")?.addEventListener(
        "click",
        () => {
            $("#registrations")?.scrollIntoView({
                behavior: "smooth"
            });
        }
    );

    $("#notificationShortcutBtn")?.addEventListener(
        "click",
        () => {
            $("#notificationSection")?.scrollIntoView({
                behavior: "smooth"
            });
        }
    );

    $("#logoutBtn")?.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            location.href = "index.html";
        }
    );

    $$(".category-card").forEach(card => {

        card.addEventListener(
            "click",
            () => {

                location.href =
                    `activities.html?category=${encodeURIComponent(
                        card.dataset.category
                    )}`;
            }
        );
    });

    $("#announcementNext")?.addEventListener(
        "click",
        nextAnnouncement
    );
}

/* =========================================================
   ANNOUNCEMENTS
   ========================================================= */

const announcements = [
    "Discover what's happening on campus.",
    "Find workshops, competitions and events.",
    "Register once. Keep every event in one place.",
    "Your next campus memory could be one click away."
];

let announcementIndex = 0;

function nextAnnouncement() {

    announcementIndex =
        (announcementIndex + 1) %
        announcements.length;

    const announcementText =
        $("#announcementText");

    if (announcementText) {
        announcementText.textContent =
            announcements[announcementIndex];
    }
}

/* =========================================================
   API
   ========================================================= */

async function api(path, options = {}) {

    const response = await fetch(
        `${API_BASE}${path}`,
        {
            ...options,

            headers: {
                ...(options.headers || {}),

                Authorization:
                    `Bearer ${token}`,

                "Content-Type":
                    "application/json"
            }
        }
    );

    const data =
        await response
            .json()
            .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Request failed"
        );
    }

    return data;
}

/* =========================================================
   ACTIVITIES
   ========================================================= */

async function loadActivities() {

    try {

        const data =
            await api("/activities/");

        state.activities =
            data.activities ||
            data ||
            [];

        renderActivities(
            state.activities
        );

    } catch (error) {

        const container =
            $("#activitiesContainer");

        if (container) {
            container.innerHTML = `
                <div class="loading">
                    Unable to load activities.
                    Please refresh.
                </div>
            `;
        }

        console.error(
            "Activities error:",
            error
        );
    }
}

function renderActivities(list) {

    const activityCount =
        $("#activityCount");

    const heroActivityCount =
        $("#heroActivityCount");

    const container =
        $("#activitiesContainer");

    if (!container) return;

    if (activityCount) {
        activityCount.textContent =
            list.length;
    }

    if (heroActivityCount) {
        heroActivityCount.textContent =
            list.length;
    }

    if (!list.length) {

        container.innerHTML = `
            <div class="loading">
                No activities match your filters.
            </div>
        `;

        return;
    }

    container.innerHTML =
        list
            .map((activity, index) => `
                <article
                    class="activity-card"
                    data-id="${activity.id}"
                >

                    <div class="activity-card-top">

                        <span class="activity-category">
                            ${escapeHTML(
                                (
                                    activity.category ||
                                    "Activity"
                                ).toUpperCase()
                            )}
                        </span>

                        <span class="activity-index">
                            ${String(index + 1)
                                .padStart(2, "0")}
                        </span>

                    </div>

                    <h3>
                        ${escapeHTML(
                            activity.title ||
                            "Untitled activity"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            activity.description ||
                            "No description available."
                        )}
                    </p>

                    <div class="activity-meta-grid">

                        <div class="activity-meta-cell">
                            <span>DATE</span>
                            <strong>
                                ${escapeHTML(
                                    formatDate(
                                        activity.date,
                                        true
                                    )
                                )}
                            </strong>
                        </div>

                        <div class="activity-meta-cell">
                            <span>TIME</span>
                            <strong>
                                ${escapeHTML(
                                    formatTime(
                                        activity.time
                                    )
                                )}
                            </strong>
                        </div>

                        <div class="activity-meta-cell">
                            <span>VENUE</span>
                            <strong>
                                ${escapeHTML(
                                    activity.venue ||
                                    "—"
                                )}
                            </strong>
                        </div>

                        <div class="activity-meta-cell">
                            <span>CAPACITY</span>
                            <strong>
                                ${
                                    activity.max_participants
                                        ? `${activity.max_participants} seats`
                                        : "Open"
                                }
                            </strong>
                        </div>

                    </div>

                    <div class="activity-card-footer">

                        <span class="activity-organizer">
                            ${escapeHTML(
                                activity.organizer_name
                                    ? `By ${activity.organizer_name}`
                                    : "OnCampus"
                            )}
                        </span>

                        <span class="view-activity">
                            View details →
                        </span>

                    </div>

                </article>
            `)
            .join("");

    $$(".activity-card").forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    location.href =
                        `activity.html?id=${card.dataset.id}`;
                }
            );
        }
    );
}

/* =========================================================
   FILTERS
   ========================================================= */

function filterActivities() {

    const searchInput =
        $("#searchInput");

    const categoryFilter =
        $("#categoryFilter");

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const category =
        categoryFilter
            ? categoryFilter.value
                .toLowerCase()
            : "";

    const filtered =
        state.activities.filter(
            activity => {

                const haystack = [
                    activity.title,
                    activity.description,
                    activity.category,
                    activity.venue,
                    activity.eligibility,
                    activity.organizer_name
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return (
                    (!query ||
                        haystack.includes(query))
                    &&
                    (
                        !category ||
                        String(
                            activity.category || ""
                        ).toLowerCase() === category
                    )
                );
            }
        );

    renderActivities(filtered);
}

/* =========================================================
   REGISTRATIONS
   ========================================================= */

async function loadRegistrations() {

    try {

        const data =
            await api("/registrations/my");

        state.registrations =
            data.registrations ||
            data ||
            [];

        renderRegistrations(
            state.registrations
        );

    } catch (error) {

        const container =
            $("#registrationsContainer");

        if (container) {
            container.innerHTML = `
                <div class="loading">
                    Unable to load registrations.
                </div>
            `;
        }

        console.error(
            "Registrations error:",
            error
        );
    }
}

function renderRegistrations(list) {

    const container =
        $("#registrationsContainer");

    if (!container) return;

    if (!list.length) {

        container.innerHTML = `
            <div class="notification-empty">
                You haven't registered for any
                activities yet.
                <a
                    href="activities.html"
                    style="color:var(--orange);font-weight:900"
                >
                    Discover activities →
                </a>
            </div>
        `;

        return;
    }

    container.innerHTML =
        list
            .map(item => {

                const activity =
                    item.activity ||
                    item;

                const status =
                    item.status ||
                    "registered";

                return `
                    <article
                        class="registration-card"
                    >

                        <div class="reg-top">

                            <span class="reg-category">
                                ${escapeHTML(
                                    activity.category ||
                                    "ACTIVITY"
                                )}
                            </span>

                            <span
                                style="
                                    font-size:7px;
                                    color:#8c99a2;
                                    font-weight:900
                                "
                            >
                                ${escapeHTML(
                                    status.toUpperCase()
                                )}
                            </span>

                        </div>

                        <h3>
                            ${escapeHTML(
                                activity.title ||
                                item.title ||
                                "Activity"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                activity.description ||
                                "Your registration is saved in OnCampus."
                            )}
                        </p>

                        <div class="registration-meta">

                            <span>
                                📅
                                ${escapeHTML(
                                    formatDate(
                                        activity.date,
                                        true
                                    )
                                )}
                            </span>

                            <span>
                                🕐
                                ${escapeHTML(
                                    formatTime(
                                        activity.time
                                    )
                                )}
                            </span>

                            <span>
                                📍
                                ${escapeHTML(
                                    activity.venue ||
                                    "—"
                                )}
                            </span>

                        </div>

                        ${
                            status === "registered"
                                ? `
                                    <button
                                        class="cancel-btn"
                                        data-activity-id="${
                                            item.activity_id ||
                                            activity.id
                                        }"
                                    >
                                        Cancel registration
                                    </button>
                                `
                                : ""
                        }

                    </article>
                `;
            })
            .join("");

    $$(".cancel-btn").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {
                    cancelRegistration(
                        button.dataset.activityId
                    );
                }
            );
        }
    );
}

async function cancelRegistration(
    activityId
) {

    if (!confirm(
        "Cancel this registration?"
    )) {
        return;
    }

    try {

        await api(
            `/registrations/${activityId}/cancel`,
            {
                method: "PUT"
            }
        );

        showToast(
            "Registration cancelled",
            "The activity was removed from your active registrations."
        );

        await loadRegistrations();
        await loadNotifications();

    } catch (error) {

        showToast(
            "Unable to cancel",
            error.message
        );
    }
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

async function loadNotifications() {

    try {

        const data =
            await api("/notifications/my");

        state.notifications =
            (
                data.notifications ||
                data ||
                []
            )
            .filter(
                item => !item.is_read
            );

        renderNotifications();

    } catch (error) {

        const container =
            $("#notificationsContainer");

        if (container) {
            container.innerHTML = `
                <div class="notification-empty">
                    Notifications are temporarily unavailable.
                </div>
            `;
        }

        console.error(
            "Notifications error:",
            error
        );
    }
}

function renderNotifications() {

    const container =
        $("#notificationsContainer");

    const badge =
        $("#notificationBadge");

    if (!container) return;

    const count =
        state.notifications.length;

    if (badge) {

        badge.textContent =
            count;

        badge.classList.toggle(
            "hidden",
            count === 0
        );
    }

    if (!count) {

        container.innerHTML = `
            <div class="notification-empty">
                You're all caught up.
                New activity updates will appear here.
            </div>
        `;

        return;
    }

    container.innerHTML =
        state.notifications
            .map(item => `
                <article
                    class="notification-card"
                    data-id="${item.id}"
                >

                    <span class="notification-dot"></span>

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.message
                            )}
                        </strong>

                        ${
                            item.activity_title
                                ? `
                                    <p>
                                        ${escapeHTML(
                                            item.activity_title
                                        )}
                                        •
                                        ${escapeHTML(
                                            formatDate(
                                                item.activity_date,
                                                true
                                            )
                                        )}
                                    </p>
                                  `
                                : ""
                        }

                        <time>
                            ${escapeHTML(
                                new Date(
                                    item.created_at
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        hour: "numeric",
                                        minute: "2-digit"
                                    }
                                )
                            )}
                        </time>

                    </div>

                    <button
                        class="notification-read"
                        data-id="${item.id}"
                        type="button"
                    >
                        Read
                    </button>

                </article>
            `)
            .join("");

    $$(".notification-read").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {
                    markNotificationRead(
                        button.dataset.id
                    );
                }
            );
        }
    );
}

async function markNotificationRead(id) {

    try {

        await api(
            `/notifications/${id}/read`,
            {
                method: "PUT"
            }
        );

        state.notifications =
            state.notifications.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );

        renderNotifications();

    } catch (error) {

        console.error(
            "Notification error:",
            error
        );
    }
}

async function markAllRead() {

    try {

        await api(
            "/notifications/read-all",
            {
                method: "PUT"
            }
        );

        state.notifications = [];

        renderNotifications();

        showToast(
            "All caught up",
            "Your notifications have been marked as read."
        );

    } catch (error) {

        showToast(
            "Unable to update",
            error.message
        );
    }
}

/* =========================================================
   FILTER EVENTS
   ========================================================= */

function setupFilters() {

    $("#searchInput")?.addEventListener(
        "input",
        filterActivities
    );

    $("#categoryFilter")?.addEventListener(
        "change",
        filterActivities
    );

    $("#clearFiltersBtn")?.addEventListener(
        "click",
        () => {

            if ($("#searchInput")) {
                $("#searchInput").value = "";
            }

            if ($("#categoryFilter")) {
                $("#categoryFilter").value = "";
            }

            filterActivities();
        }
    );

    $("#clearSearchBtn")?.addEventListener(
        "click",
        () => {

            if ($("#searchInput")) {
                $("#searchInput").value = "";
                filterActivities();
                $("#searchInput").focus();
            }
        }
    );

    $("#markAllReadBtn")?.addEventListener(
        "click",
        markAllRead
    );
}

/* =========================================================
   MAGNETIC BUTTONS
   FIXED VERSION
   ========================================================= */

function setupMagnetic() {

    if (
        !window.matchMedia(
            "(pointer:fine)"
        ).matches
    ) {
        return;
    }

    $$(".magnetic-btn").forEach(
        button => {

            if (!button) return;

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        (
                            event.clientX -
                            rect.left -
                            rect.width / 2
                        ) * 0.12;

                    const y =
                        (
                            event.clientY -
                            rect.top -
                            rect.height / 2
                        ) * 0.12;

                    button.style.transform =
                        `translate(${x}px, ${y}px)`;
                }
            );

            button.addEventListener(
                "mouseleave",
                () => {
                    button.style.transform = "";
                }
            );
        }
    );
}

/* =========================================================
   INIT
   ========================================================= */

async function init() {

    setupUser();
    setupLoader();
    setupTyping();
    setupReveal();
    setupNavigation();
    setupFilters();
    setupMagnetic();

    await Promise.all([
        loadActivities(),
        loadRegistrations(),
        loadNotifications()
    ]);
}

init().catch(error => {
    console.error(
        "OnCampus initialization error:",
        error
    );
});