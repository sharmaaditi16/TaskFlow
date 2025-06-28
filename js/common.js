

$(document).ready(function () {
    token = localStorage.getItem("user_token");
    if (token === null || token === undefined || token === "") {
        alert("You are not logged in. Please log in to access this page.");
        window.location.href = "login.html";
        return;
    }
})

$("#logout-btn").click(function () {
    localStorage.removeItem("user_token");
    window.location.href = "login.html";
})