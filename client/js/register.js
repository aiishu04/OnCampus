const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    message.textContent = "Creating account...";

    try {
        const response = await fetch(
            "http://localhost:5001/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    role: role
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.message || "Registration failed";

            return;
        }

        message.textContent =
            "Account created successfully!";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to server";
    }
});