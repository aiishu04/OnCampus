const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");


// CHECK LOGIN
if (!token || !userData) {
    window.location.href = "index.html";
}


// USER DATA
const user = JSON.parse(userData);


// DISPLAY USER NAME
document.getElementById("studentName").textContent = user.name;


// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});


// GET ACTIVITY ID FROM URL
const urlParams = new URLSearchParams(window.location.search);

const activityId = urlParams.get("id");


// ACTIVITY CONTAINER
const container =
    document.getElementById("activityContainer");


// CHECK ACTIVITY ID
if (!activityId) {

    container.innerHTML = `
        <div class="error-box">
            Activity ID is missing.
        </div>
    `;

} else {

    loadActivity();

}


// LOAD ACTIVITY
async function loadActivity() {

    try {

        const response = await fetch(
            `http://localhost:5001/api/activities/${activityId}`
        );

        const data = await response.json();


        if (!response.ok) {

            container.innerHTML = `
                <div class="error-box">
                    ${data.message || "Activity not found"}
                </div>
            `;

            return;
        }


        const activity = data.activity;


        const formattedDate =
            new Date(activity.date).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        container.innerHTML = `

            <div class="activity-details-card">

                <div class="activity-details-header">

                    <span class="activity-category">
                        ${activity.category}
                    </span>

                    <h1>
                        ${activity.title}
                    </h1>

                    <p class="organizer-text">
                        Organized by
                        <strong>${activity.organizer_name}</strong>
                    </p>

                </div>


                <div class="activity-details-content">

                    <div class="details-section">

                        <h2>About this activity</h2>

                        <p>
                            ${activity.description ||
                            "No description available."}
                        </p>

                    </div>


                    <div class="details-grid">

                        <div class="detail-item">

                            <span class="detail-label">
                                Date
                            </span>

                            <strong>
                                📅 ${formattedDate}
                            </strong>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">
                                Time
                            </span>

                            <strong>
                                🕐 ${activity.time}
                            </strong>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">
                                Venue
                            </span>

                            <strong>
                                📍 ${activity.venue}
                            </strong>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">
                                Eligibility
                            </span>

                            <strong>
                                ${activity.eligibility ||
                                "Open to all students"}
                            </strong>

                        </div>


                        <div class="detail-item">

                            <span class="detail-label">
                                Maximum Participants
                            </span>

                            <strong>
                                ${activity.max_participants ||
                                "No limit"}
                            </strong>

                        </div>

                    </div>


                    <div class="activity-action">

                        <button
                            id="registerBtn"
                            class="primary-btn activity-register-btn"
                        >
                            Register for Activity
                        </button>

                        <p
                            id="actionMessage"
                            class="message"
                        ></p>

                    </div>

                </div>

            </div>

        `;


        document
            .getElementById("registerBtn")
            .addEventListener(
                "click",
                registerForActivity
            );


        checkRegistration();


    } catch (error) {

        console.error(
            "Activity error:",
            error
        );

        container.innerHTML = `
            <div class="error-box">
                Unable to connect to server.
            </div>
        `;
    }
}


// CHECK WHETHER STUDENT IS ALREADY REGISTERED
async function checkRegistration() {

    try {

        const response = await fetch(
            "http://localhost:5001/api/registrations/my",
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {
            return;
        }


        const registration =
            data.registrations.find(
                (item) =>
                    String(item.activity_id) ===
                    String(activityId) &&
                    item.status === "registered"
            );


        const button =
            document.getElementById("registerBtn");


        if (!button) {
            return;
        }


        if (registration) {

            button.textContent =
                "Already Registered";

            button.disabled = true;

            button.classList.add(
                "registered-btn"
            );

        }

    } catch (error) {

        console.error(
            "Check registration error:",
            error
        );
    }
}


// REGISTER
async function registerForActivity() {

    const button =
        document.getElementById("registerBtn");

    const message =
        document.getElementById("actionMessage");


    button.disabled = true;

    button.textContent =
        "Registering...";


    try {

        const response = await fetch(
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

            message.textContent =
                data.message ||
                "Registration failed";

            button.disabled = false;

            button.textContent =
                "Register for Activity";

            return;
        }


        button.textContent =
            "Already Registered";

        button.classList.add(
            "registered-btn"
        );


        message.textContent =
            "Registration successful!";

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        message.textContent =
            "Unable to connect to server";

        button.disabled = false;

        button.textContent =
            "Register for Activity";
    }
}