
async function validateAndLogin() {
    // Get input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Get error message elements
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const loginError = document.getElementById("login-error"); // Error below form

    // Reset error messages
    emailError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";

    // Validation flags
    let isValid = true;

    // Email Validation
    if (email === "") {
        emailError.textContent = "Email cannot be empty.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent = "Invalid email format. Must contain '@' and '.'.";
        isValid = false;
    }

    // Password Validation
    if (password === "") {
        passwordError.textContent = "Password cannot be empty.";
        isValid = false;
    } else if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters.";
        isValid = false;
    } else if (!/[A-Z]/.test(password)) {
        passwordError.textContent = "Password must contain at least one uppercase letter.";
        isValid = false;
    } else if (!/[a-z]/.test(password)) {
        passwordError.textContent = "Password must contain at least one lowercase letter.";
        isValid = false;
    } else if (!/[0-9]/.test(password)) {
        passwordError.textContent = "Password must contain at least one number.";
        isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        passwordError.textContent = "Password must contain at least one special character.";
        isValid = false;
    }

    // Stop login if validation fails
    if (!isValid) return;

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("userToken", data.token); //stores token got from authcontroller
            window.location.href = "expenses.html";
        } else {
            loginError.textContent = "Username or password mismatch. Please try again.";
        }
    } catch (error) {
        console.error("Login error:", error);
        loginError.textContent = "Username or password is invalid. Please try again.";
    }
}

// Hide Error Messages When User Clicks Input
document.getElementById("email").addEventListener("focus", () => {
    document.getElementById("email-error").textContent = "";
    document.getElementById("login-error").textContent = ""; // Clear login error
});

document.getElementById("password").addEventListener("focus", () => {
    document.getElementById("password-error").textContent = "";
    document.getElementById("login-error").textContent = ""; // Clear login error
});
