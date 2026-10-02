const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


// CHECK LOGIN
if (!token || !userData) {
    window.location.href = "index.html";
}


// USER DATA
const user = JSON.parse(userData);


// CHECK ADMIN ROLE
if (user.role !== "admin") {
    alert("Admin access required");
    window.location.href = "index.html";
}


// DISPLAY ADMIN NAME
document.getElementById("adminName").textContent = user.name;

document.getElementById("welcomeName").textContent = user.name;


// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});


// LOAD PENDING ACTIVITIES
async function loadPendingActivities() {

    const container =
        document.getElementById(
            "pendingActivities"
        );

    try {

        const response =
            await fetch(
                "http://localhost:5001/api/admin/activities/pending",
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
                    ${data.message || "Unable to load activities"}
                </p>`;

            return;
        }


        if (
            !data.activities ||
            data.activities.length === 0
        ) {

            container.innerHTML = `
                <div class="empty">
                    <p>
                        No pending activities.
                    </p>
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        data.activities.forEach(
            (activity) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-activity-card";


                const formattedDate =
                    new Date(
                        activity.date
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    );


                card.innerHTML = `

                    <div class="admin-activity-content">

                        <div class="activity-category">
                            ${activity.category}
                        </div>

                        <h3>
                            ${activity.title}
                        </h3>

                        <p class="admin-description">
                            ${activity.description ||
                            "No description available."}
                        </p>


                        <div class="admin-activity-info">

                            <span>
                                📅 ${formattedDate}
                            </span>

                            <span>
                                🕐 ${activity.time}
                            </span>

                            <span>
                                📍 ${activity.venue}
                            </span>

                        </div>


                        <div class="organizer-details">

                            <strong>
                                Organizer
                            </strong>

                            <span>
                                ${activity.organizer_name}
                            </span>

                            <span>
                                ${activity.organizer_email}
                            </span>

                        </div>

                    </div>


                    <div class="admin-actions">

                        <span class="activity-status pending">
                            Pending
                        </span>


                        <button
                            class="approve-btn"
                            onclick="approveActivity(${activity.id})"
                        >
                            Approve
                        </button>


                        <button
                            class="reject-btn"
                            onclick="rejectActivity(${activity.id})"
                        >
                            Reject
                        </button>

                    </div>

                `;


                container.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Pending activities error:",
            error
        );

        container.innerHTML =
            `<p class="error">
                Unable to connect to server.
            </p>`;
    }
}


// APPROVE ACTIVITY
async function approveActivity(activityId) {

    const confirmed =
        confirm(
            "Are you sure you want to approve this activity?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5001/api/admin/activities/${activityId}/approve`,
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
                "Unable to approve activity"
            );

            return;
        }


        alert(
            "Activity approved successfully."
        );


        loadPendingActivities();


    } catch (error) {

        console.error(
            "Approve activity error:",
            error
        );

        alert(
            "Unable to connect to server"
        );
    }
}


// REJECT ACTIVITY
async function rejectActivity(activityId) {

    const confirmed =
        confirm(
            "Are you sure you want to reject this activity?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5001/api/admin/activities/${activityId}/reject`,
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
                "Unable to reject activity"
            );

            return;
        }


        alert(
            "Activity rejected successfully."
        );


        loadPendingActivities();


    } catch (error) {

        console.error(
            "Reject activity error:",
            error
        );

        alert(
            "Unable to connect to server"
        );
    }
}


// INITIAL LOAD
loadPendingActivities();