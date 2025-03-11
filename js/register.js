async function validateAndRegister() {
    // Get input values
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Get error message elements
    const nameError = document.getElementById("name-error");
    const addressError = document.getElementById("address-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const message = document.getElementById("message");

    // Reset error messages
    nameError.textContent = "";
    addressError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    message.textContent = "";

    // Validation flags
    let isValid = true;

    // Name Validation
    if (name === "") {
        nameError.textContent = "Full Name cannot be empty.";
        isValid = false;
    }

    // Address Validation
    if (address === "") {
        addressError.textContent = "Address cannot be empty.";
        isValid = false;
    }

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

    // Stop registration if validation fails
    if (!isValid) return;

    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, address, email, password })
        });

        const result = await response.text();

        if (response.ok) {
            message.textContent = "Registration successful! Redirecting...";
            message.classList.add("text-success");
            setTimeout(() => {
                window.location.href = "/views/login.html";
            }, 2000);
        } else {
            message.textContent = result;
            message.classList.add("text-danger");
        }
    } catch (error) {
        console.error("Registration error:", error);
        message.textContent = "An error occurred while registering. Please try again.";
        message.classList.add("text-danger");
    }
}

// 🟢 Hide Error Messages When User Clicks Input
document.getElementById("name").addEventListener("focus", () => {
    document.getElementById("name-error").textContent = "";
});

document.getElementById("address").addEventListener("focus", () => {
    document.getElementById("address-error").textContent = "";
});

document.getElementById("email").addEventListener("focus", () => {
    document.getElementById("email-error").textContent = "";
});

document.getElementById("password").addEventListener("focus", () => {
    document.getElementById("password-error").textContent = "";
});
