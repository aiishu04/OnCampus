const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


// CHECK LOGIN
if (!token || !userData) {
    window.location.href = "index.html";
}


// USER DATA
const user = JSON.parse(userData);


// CHECK ORGANIZER ROLE
if (user.role !== "organizer") {
    alert("Organizer access required");
    window.location.href = "index.html";
}


// DISPLAY USER NAME
document.getElementById("organizerName").textContent = user.name;

document.getElementById("welcomeName").textContent = user.name;


// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});


// CREATE ACTIVITY ELEMENTS
const showCreateBtn =
    document.getElementById("showCreateBtn");

const closeCreateBtn =
    document.getElementById("closeCreateBtn");

const createActivitySection =
    document.getElementById("createActivitySection");


// SHOW CREATE FORM
showCreateBtn.addEventListener("click", () => {

    createActivitySection.classList.remove("hidden");

    showCreateBtn.style.display = "none";

});


// HIDE CREATE FORM
closeCreateBtn.addEventListener("click", () => {

    createActivitySection.classList.add("hidden");

    showCreateBtn.style.display = "block";

});


// CREATE ACTIVITY FORM
const activityForm =
    document.getElementById("activityForm");


activityForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const message =
            document.getElementById(
                "activityMessage"
            );


        const title =
            document.getElementById(
                "title"
            ).value;

        const description =
            document.getElementById(
                "description"
            ).value;

        const category =
            document.getElementById(
                "category"
            ).value;

        const date =
            document.getElementById(
                "date"
            ).value;

        const time =
            document.getElementById(
                "time"
            ).value;

        const venue =
            document.getElementById(
                "venue"
            ).value;

        const eligibility =
            document.getElementById(
                "eligibility"
            ).value;

        const maxParticipants =
            document.getElementById(
                "maxParticipants"
            ).value;


        message.textContent =
            "Creating activity...";


        try {

            const response =
                await fetch(
                    "http://localhost:5001/api/activities",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            title: title,
                            description: description,
                            category: category,
                            date: date,
                            time: time,
                            venue: venue,
                            eligibility: eligibility,
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

                message.textContent =
                    data.message ||
                    "Unable to create activity";

                return;
            }


            message.textContent =
                "Activity created successfully. Waiting for admin approval.";


            activityForm.reset();


            loadOrganizerActivities();


            setTimeout(() => {

                createActivitySection
                    .classList
                    .add("hidden");

                showCreateBtn.style.display =
                    "block";

                message.textContent = "";

            }, 1500);


        } catch (error) {

            console.error(
                "Create activity error:",
                error
            );

            message.textContent =
                "Unable to connect to server";
        }
    }
);


// LOAD ORGANIZER ACTIVITIES
async function loadOrganizerActivities() {

    const container =
        document.getElementById(
            "organizerActivities"
        );


    try {

        const response =
            await fetch(
                "http://localhost:5001/api/organizer/activities",
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
            !data.activities ||
            data.activities.length === 0
        ) {

            container.innerHTML = `
                <div class="empty">
                    <p>
                        You haven't created any activities yet.
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
                    "organizer-activity-card";


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


                const statusClass =
                    activity.status;


                card.innerHTML = `

                    <div class="organizer-activity-main">

                        <div class="activity-category">
                            ${activity.category}
                        </div>

                        <h3>
                            ${activity.title}
                        </h3>

                        <p>
                            ${activity.description ||
                            "No description available."}
                        </p>

                        <div class="organizer-activity-info">

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

                    </div>


                    <div class="organizer-activity-side">

                        <span
                            class="activity-status ${statusClass}"
                        >
                            ${activity.status}
                        </span>

                        <div class="participant-count">

                            <strong>
                                ${activity.registered_count}
                            </strong>

                            <span>
                                registered
                            </span>

                        </div>

                        ${
                            activity.registered_count > 0
                            ? `
                                <button
                                    class="view-participants-btn"
                                    onclick="viewParticipants(${activity.id})"
                                >
                                    View Participants
                                </button>
                            `
                            : ""
                        }

                    </div>

                `;


                container.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Organizer activities error:",
            error
        );

        container.innerHTML =
            `<p class="error">
                Unable to load activities.
            </p>`;
    }
}


// VIEW PARTICIPANTS
async function viewParticipants(activityId) {

    try {

        const response =
            await fetch(
                `http://localhost:5001/api/organizer/activities/${activityId}/participants`,
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

            alert(
                data.message ||
                "Unable to load participants"
            );

            return;
        }


        if (
            !data.participants ||
            data.participants.length === 0
        ) {

            alert(
                "No participants registered yet."
            );

            return;
        }


        let participantText =
            `${data.activity.title}\n\n`;

        participantText +=
            `Total Participants: ${data.totalParticipants}\n\n`;


        data.participants.forEach(
            (participant, index) => {

                participantText +=
                    `${index + 1}. ` +
                    `${participant.student_name} - ` +
                    `${participant.student_email}\n`;

            }
        );


        alert(participantText);

    } catch (error) {

        console.error(
            "Participants error:",
            error
        );

        alert(
            "Unable to connect to server"
        );
    }
}


// INITIAL LOAD
loadOrganizerActivities();