const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


// =========================
// CHECK LOGIN
// =========================

if (!token || !userData) {
    window.location.href = "index.html";
}


// =========================
// USER DATA
// =========================

const user = JSON.parse(userData);


// =========================
// CHECK STUDENT ROLE
// =========================

if (user.role !== "student") {
    alert("Student access required");
    window.location.href = "index.html";
}


// =========================
// DISPLAY USER NAME
// =========================

document.getElementById("studentName").textContent =
    user.name;

document.getElementById("welcomeName").textContent =
    user.name;


// =========================
// LOGOUT
// =========================

document.getElementById("logoutBtn").addEventListener(
    "click",
    () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";

    }
);


// =========================
// ACTIVITIES
// =========================

let allActivities = [];


// SEARCH INPUT

const searchInput =
    document.getElementById("searchInput");


// CATEGORY FILTER

const categoryFilter =
    document.getElementById("categoryFilter");


// CLEAR FILTER BUTTON

const clearFiltersBtn =
    document.getElementById("clearFiltersBtn");


// SEARCH

searchInput.addEventListener(
    "input",
    applyFilters
);


// CATEGORY FILTER

categoryFilter.addEventListener(
    "change",
    applyFilters
);


// CLEAR FILTERS

clearFiltersBtn.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        categoryFilter.value = "";

        applyFilters();

    }
);


// =========================
// LOAD ACTIVITIES
// =========================

async function loadActivities() {

    const container =
        document.getElementById(
            "activitiesContainer"
        );


    try {

        const response =
            await fetch(
                "http://localhost:5001/api/activities"
            );


        const data =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<p class="error">
                    ${data.message ||
                    "Unable to load activities"}
                </p>`;

            return;
        }


        allActivities =
            data.activities || [];


        applyFilters();


    } catch (error) {

        console.error(
            "Activities error:",
            error
        );


        container.innerHTML =
            `<p class="error">
                Unable to load activities.
            </p>`;
    }
}


// =========================
// APPLY FILTERS
// =========================

function applyFilters() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const filteredActivities =
        allActivities.filter(
            (activity) => {

                const title =
                    activity.title
                        .toLowerCase();


                const description =
                    (
                        activity.description ||
                        ""
                    ).toLowerCase();


                const category =
                    activity.category
                        .toLowerCase();


                const venue =
                    activity.venue
                        .toLowerCase();


                const matchesSearch =
                    title.includes(searchText) ||
                    description.includes(searchText) ||
                    category.includes(searchText) ||
                    venue.includes(searchText);


                const matchesCategory =
                    !selectedCategory ||
                    activity.category ===
                        selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayActivities(
        filteredActivities
    );
}


// =========================
// DISPLAY ACTIVITIES
// =========================

function displayActivities(
    activities
) {

    const container =
        document.getElementById(
            "activitiesContainer"
        );


    if (
        !activities ||
        activities.length === 0
    ) {

        container.innerHTML = `
            <div class="empty">

                <p>
                    No activities found.
                </p>

                <span>
                    Try changing your search or filter.
                </span>

            </div>
        `;

        return;
    }


    container.innerHTML = "";


    activities.forEach(
        (activity) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "activity-card";


            const formattedDate =
                formatDate(
                    activity.date
                );


            card.innerHTML = `

                <div class="activity-category">
                    ${activity.category}
                </div>

                <h3>
                    ${activity.title}
                </h3>

                <p class="activity-description">
                    ${activity.description ||
                    "No description available."}
                </p>


                <div class="activity-info">

                    <div>
                        📅 ${formattedDate}
                    </div>

                    <div>
                        🕐 ${activity.time}
                    </div>

                    <div>
                        📍 ${activity.venue}
                    </div>

                </div>


                <div class="activity-footer">

                    <span>
                        Organized by
                        ${activity.organizer_name}
                    </span>


                    <button
                        class="register-btn"
                        onclick="
                            event.stopPropagation();
                            registerForActivity(${activity.id})
                        "
                    >
                        Register
                    </button>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `activity.html?id=${activity.id}`;

                }
            );


            container.appendChild(card);

        }
    );
}


// =========================
// FORMAT DATE
// =========================

function formatDate(dateValue) {

    const dateParts =
        String(dateValue)
            .split("T")[0]
            .split("-");


    if (dateParts.length !== 3) {

        return new Date(
            dateValue
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    const year =
        Number(dateParts[0]);


    const month =
        Number(dateParts[1]) - 1;


    const day =
        Number(dateParts[2]);


    return new Date(
        year,
        month,
        day
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// =========================
// REGISTER FOR ACTIVITY
// =========================

async function registerForActivity(
    activityId
) {

    try {

        const response =
            await fetch(
                `http://localhost:5001/api/registrations/${activityId}`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Registration failed"
            );

            return;
        }


        alert(
            "Registration successful!"
        );


        loadActivities();

        loadRegistrations();

        loadNotifications();


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        alert(
            "Unable to connect to server"
        );
    }
}


// =========================
// LOAD MY REGISTRATIONS
// =========================

async function loadRegistrations() {

    const container =
        document.getElementById(
            "registrationsContainer"
        );


    try {

        const response =
            await fetch(
                "http://localhost:5001/api/registrations/my",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<p class="error">
                    ${data.message}
                </p>`;

            return;
        }


        if (
            !data.registrations ||
            data.registrations.length === 0
        ) {

            container.innerHTML = `
                <p class="empty">
                    You haven't registered for any activities yet.
                </p>
            `;

            return;
        }


        container.innerHTML = "";


        data.registrations.forEach(
            (registration) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "registration-card";


                const formattedDate =
                    formatDate(
                        registration.date
                    );


                const isRegistered =
                    registration.status ===
                    "registered";


                item.innerHTML = `

                    <div class="registration-info">

                        <h3>
                            ${registration.title}
                        </h3>

                        <p>
                            ${registration.category}
                        </p>

                        <p>
                            📅 ${formattedDate}

                            &nbsp;&nbsp;

                            📍 ${registration.venue}
                        </p>

                    </div>


                    <div class="registration-actions">

                        <div class="registration-status">
                            ${registration.status}
                        </div>


                        ${
                            isRegistered
                            ? `
                                <button
                                    class="cancel-btn"
                                    onclick="
                                        cancelRegistration(
                                            ${registration.activity_id}
                                        )
                                    "
                                >
                                    Cancel
                                </button>
                              `
                            : ""
                        }

                    </div>

                `;


                container.appendChild(item);

            }
        );


    } catch (error) {

        console.error(
            "Registrations error:",
            error
        );


        container.innerHTML =
            `<p class="error">
                Unable to load registrations.
            </p>`;
    }
}


// =========================
// CANCEL REGISTRATION
// =========================

async function cancelRegistration(
    activityId
) {

    const confirmed =
        confirm(
            "Are you sure you want to cancel this registration?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5001/api/registrations/${activityId}/cancel`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to cancel registration"
            );

            return;
        }


        alert(
            "Registration cancelled successfully."
        );


        loadRegistrations();

        loadActivities();

        loadNotifications();


    } catch (error) {

        console.error(
            "Cancel registration error:",
            error
        );


        alert(
            "Unable to connect to server"
        );
    }
}


// =========================
// LOAD NOTIFICATIONS
// =========================

async function loadNotifications() {

    const container =
        document.getElementById(
            "notificationsContainer"
        );


    try {

        const response =
            await fetch(
                "http://localhost:5001/api/notifications/my",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<p class="error">
                    ${data.message ||
                    "Unable to load notifications"}
                </p>`;

            return;
        }


        const notifications =
            data.notifications || [];


        if (notifications.length === 0) {

            container.innerHTML = `
                <div class="empty">

                    <p>
                        No notifications yet.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML = "";


        notifications.forEach(
            (notification) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification-card";


                if (!notification.is_read) {

                    item.classList.add(
                        "unread"
                    );

                }


                const createdDate =
                    new Date(
                        notification.created_at
                    ).toLocaleString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit"
                        }
                    );


                item.innerHTML = `

                    <div class="notification-content">

                        <div class="notification-title">

                            <span class="notification-icon">
                                🔔
                            </span>

                            ${
                                notification.is_read
                                ? ""
                                : `
                                    <span class="unread-dot"></span>
                                  `
                            }

                        </div>


                        <div>

                            <p class="notification-message">
                                ${notification.message}
                            </p>


                            ${
                                notification.activity_title
                                ? `
                                    <p class="notification-activity">
                                        Activity:
                                        ${notification.activity_title}
                                    </p>
                                  `
                                : ""
                            }


                            <p class="notification-time">
                                ${createdDate}
                            </p>

                        </div>

                    </div>


                    ${
                        !notification.is_read
                        ? `
                            <button
                                class="mark-read-btn"
                                onclick="
                                    markNotificationRead(
                                        ${notification.id}
                                    )
                                "
                            >
                                Mark as read
                            </button>
                          `
                        : `
                            <span class="read-label">
                                Read
                            </span>
                          `
                    }

                `;


                container.appendChild(item);

            }
        );


    } catch (error) {

        console.error(
            "Notifications error:",
            error
        );


        container.innerHTML =
            `<p class="error">
                Unable to load notifications.
            </p>`;
    }
}


// =========================
// MARK ONE NOTIFICATION AS READ
// =========================

async function markNotificationRead(
    notificationId
) {

    try {

        const response =
            await fetch(
                `http://localhost:5001/api/notifications/${notificationId}/read`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to mark notification as read"
            );

            return;
        }


        loadNotifications();


    } catch (error) {

        console.error(
            "Mark notification error:",
            error
        );


        alert(
            "Unable to connect to server"
        );
    }
}


// =========================
// MARK ALL NOTIFICATIONS AS READ
// =========================

document
    .getElementById("markAllReadBtn")
    .addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5001/api/notifications/read-all",
                        {
                            method: "PUT",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to mark notifications as read"
                    );

                    return;
                }


                loadNotifications();


            } catch (error) {

                console.error(
                    "Mark all notifications error:",
                    error
                );


                alert(
                    "Unable to connect to server"
                );
            }

        }
    );


// =========================
// INITIAL LOAD
// =========================

loadActivities();

loadRegistrations();

loadNotifications();