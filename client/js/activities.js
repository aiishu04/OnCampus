const API_BASE = "http://localhost:5001/api";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

let user = null;
let allActivities = [];

try {
    user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
    user = null;
}

if (!token) {
    window.location.href = "index.html";
}

const pageLoader = document.getElementById("pageLoader");
const activitiesContainer = document.getElementById("activitiesContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const emptyClearBtn = document.getElementById("emptyClearBtn");
const activityCount = document.getElementById("activityCount");
const heroActivityCount = document.getElementById("heroActivityCount");
const userName = document.getElementById("activitiesUserName");
const userInitial = document.getElementById("activitiesUserInitial");
const logoutBtn = document.getElementById("activitiesLogoutBtn");
const toast = document.getElementById("activitiesToast");

function hideLoader() {
    if (pageLoader) pageLoader.classList.add("hidden");
}

window.addEventListener("load", () => setTimeout(hideLoader, 500));
setTimeout(hideLoader, 2000);

function setupUser() {
    const name = user?.name || "Student";
    if (userName) userName.textContent = name;
    if (userInitial) userInitial.textContent = name.charAt(0).toUpperCase();
}

async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
        throw new Error("Session expired");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Unable to load activities.");
    }

    return data;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(value) {
    if (!value) return "—";

    const text = String(value).slice(0, 10);
    const parts = text.split("-");

    if (parts.length !== 3) return value;

    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatTime(value) {
    if (!value) return "—";

    const parts = String(value).slice(0, 5).split(":");
    if (parts.length < 2) return value;

    let hour = Number(parts[0]);
    const minute = parts[1];
    const suffix = hour >= 12 ? "PM" : "AM";

    hour %= 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${suffix}`;
}

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.activitiesToastTimer);
    window.activitiesToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function updateCounts(count) {
    if (activityCount) activityCount.textContent = count;
    if (heroActivityCount) heroActivityCount.textContent = count;
}

function populateCategories() {
    if (!categoryFilter) return;

    const current = categoryFilter.value;
    const categories = [...new Set(
        allActivities
            .map(activity => activity.category)
            .filter(Boolean)
    )].sort();

    categoryFilter.innerHTML = `<option value="">All categories</option>`;

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    if (categories.includes(current)) {
        categoryFilter.value = current;
    }
}

function renderActivities(activities) {
    updateCounts(activities.length);

    if (!activities.length) {
        activitiesContainer.innerHTML = "";
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (emptyState) emptyState.hidden = true;

    activitiesContainer.innerHTML = activities.map((activity, index) => `
        <article class="activity-card" data-id="${Number(activity.id)}">
            <div class="activity-card-top">
                <span class="activity-category">
                    ${escapeHTML((activity.category || "Activity").toUpperCase())}
                </span>
                <span class="activity-index">
                    ${String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <h3>${escapeHTML(activity.title || "Untitled activity")}</h3>

            <p>
                ${escapeHTML(activity.description || "No description available.")}
            </p>

            <div class="activity-meta-grid">
                <div class="activity-meta-cell">
                    <span>DATE</span>
                    <strong>${escapeHTML(formatDate(activity.date))}</strong>
                </div>

                <div class="activity-meta-cell">
                    <span>TIME</span>
                    <strong>${escapeHTML(formatTime(activity.time))}</strong>
                </div>

                <div class="activity-meta-cell">
                    <span>VENUE</span>
                    <strong>${escapeHTML(activity.venue || "—")}</strong>
                </div>

                <div class="activity-meta-cell">
                    <span>CAPACITY</span>
                    <strong>
                        ${activity.max_participants
                            ? `${Number(activity.max_participants)} seats`
                            : "Open"}
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

                <span class="view-activity">View details →</span>
            </div>
        </article>
    `).join("");

    activitiesContainer.querySelectorAll(".activity-card").forEach(card => {
        card.addEventListener("click", () => {
            window.location.href =
                `activity.html?id=${encodeURIComponent(card.dataset.id)}`;
        });
    });
}

function applyFilters() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const category = (categoryFilter?.value || "").toLowerCase();

    const filtered = allActivities.filter(activity => {
        const searchable = [
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

        const matchesSearch = !query || searchable.includes(query);
        const matchesCategory =
            !category ||
            String(activity.category || "").toLowerCase() === category;

        return matchesSearch && matchesCategory;
    });

    renderActivities(filtered);
}

async function loadActivities() {
    try {
        const data = await apiFetch("/activities/");

        allActivities = Array.isArray(data)
            ? data
            : Array.isArray(data.activities)
                ? data.activities
                : [];

        populateCategories();
        renderActivities(allActivities);
    } catch (error) {
        console.error("Activities error:", error);

        activitiesContainer.innerHTML = `
            <div class="discover-loading">
                Unable to load activities. Please refresh the page.
            </div>
        `;

        updateCounts(0);
        showToast(error.message);
    } finally {
        hideLoader();
    }
}

searchInput?.addEventListener("input", applyFilters);
categoryFilter?.addEventListener("change", applyFilters);

clearSearchBtn?.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
});

clearFiltersBtn?.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    renderActivities(allActivities);
});

emptyClearBtn?.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    renderActivities(allActivities);
});

logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

setupUser();
loadActivities();
