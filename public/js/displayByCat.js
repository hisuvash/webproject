function getEmailFromToken() {
    const token = localStorage.getItem("userToken"); // Get the stored token
    if (!token) return null; // Return null if no token is found

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
        console.log(payload.email)
        return payload.email; // Extract the email
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

email = getEmailFromToken()


async function fetchHelloMessage(e) {
    // e.preventDefault()
    try {
        console.log("🔍 Sending request to /hello...");
        const category = document.getElementById("category").value;
        const response = await fetch(`http://localhost:3000/api/expenses/search?category=${encodeURIComponent(category)}&email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

       if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        const rendered = Mustache.render(document.getElementById("expense-template-category").innerHTML, { expenses: data });
        document.getElementById("expense-results-category").innerHTML = rendered;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Failed to fetch expenses.");
    }
}
