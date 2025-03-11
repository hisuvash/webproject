// Load Navbar Dynamically in All Pages
document.addEventListener("DOMContentLoaded", function () {
    fetch("../views/partials/navbar.html")  // Load the navbar from partials
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;

            // Check if user is logged in
            const userToken = localStorage.getItem("userToken");
            const navMenus = document.getElementById("nav-menus");

            if (userToken) {
                navMenus.style.display = "flex";  // Show navigation menu
            } else {
                navMenus.style.display = "none";  // Hide navigation menu
            }
        })
        .catch(error => console.error("Error loading navbar:", error));
});

// Logout function
function logout() {
    localStorage.removeItem("userToken");  // Remove token
    alert("You have been logged out.");
    window.location.href = "index.html";  // Redirect to home
}

// Logout function
function logout() {
    localStorage.removeItem("userToken");  // Remove token
    alert("You have been logged out.");
    window.location.href = "index.html";  // Redirect to home
}
