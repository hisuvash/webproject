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
