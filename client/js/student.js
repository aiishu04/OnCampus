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

document.getElementById("welcomeName").textContent = user.name;


// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";

});


// LOAD ACTIVITIES
async function loadActivities() {

    const container =
        document.getElementById("activitiesContainer");

    try {

        const response = await fetch(
            "http://localhost:5001/api/activities"
        );

        const data = await response.json();

        if (!response.ok) {

            container.innerHTML =
                `<p class="error">${data.message}</p>`;

            return;
        }


        if (!data.activities || data.activities.length === 0) {

            container.innerHTML =
                `<p class="empty">No activities available right now.</p>`;

            return;
        }


        container.innerHTML = "";


        data.activities.forEach((activity) => {

            const card =
                document.createElement("div");

            card.className = "activity-card";


            const formattedDate =
                new Date(activity.date).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );


            card.innerHTML = `

                <div class="activity-category">
                    ${activity.category}
                </div>

                <h3>
                    ${activity.title}
                </h3>

                <p class="activity-description">
                    ${activity.description || "No description available."}
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
                        Organized by ${activity.organizer_name}
                    </span>

                    <button
                        class="register-btn"
                        onclick="registerForActivity(${activity.id})"
                    >
                        Register
                    </button>

                </div>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Activities error:",
            error
        );

        container.innerHTML =
            `<p class="error">Unable to load activities.</p>`;
    }
}



// REGISTER FOR ACTIVITY
async function registerForActivity(activityId) {

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


        const data = await response.json();


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



// LOAD MY REGISTRATIONS
async function loadRegistrations() {

    const container =
        document.getElementById(
            "registrationsContainer"
        );


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


        const data =
            await response.json();


        if (!response.ok) {

            container.innerHTML =
                `<p class="error">${data.message}</p>`;

            return;
        }


        if (
            !data.registrations ||
            data.registrations.length === 0
        ) {

            container.innerHTML =
                `<p class="empty">
                    You haven't registered for any activities yet.
                </p>`;

            return;
        }


        container.innerHTML = "";


        data.registrations.forEach(
            (registration) => {

                const item =
                    document.createElement("div");

                item.className =
                    "registration-card";


                const formattedDate =
                    new Date(
                        registration.date
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    );


                item.innerHTML = `

                    <div>

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


                    <div class="registration-status">

                        ${registration.status}

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



// INITIAL LOAD
loadActivities();
loadRegistrations();