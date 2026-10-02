const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    message.textContent = "Logging in...";

    try {
        const response = await fetch(
            "http://localhost:5001/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || "Login failed";
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        message.textContent = "Login successful!";

        setTimeout(() => {
            if (data.user.role === "student") {
                window.location.href = "student.html";
            } else if (data.user.role === "organizer") {
                window.location.href = "organizer.html";
            } else if (data.user.role === "admin") {
                window.location.href = "admin.html";
            }
        }, 500);

    } catch (error) {
        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to server";
    }
});