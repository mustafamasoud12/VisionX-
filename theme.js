const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark");
        if (themeToggle) themeToggle.textContent = "☀️";
    } else {
        document.body.classList.remove("dark");
        if (themeToggle) themeToggle.textContent = "🌙";
    }

}

const savedTheme = localStorage.getItem("visionx-theme") || "dark";
applyTheme(savedTheme);

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const newTheme =
            document.body.classList.contains("dark")
                ? "light"
                : "dark";

        localStorage.setItem("visionx-theme", newTheme);

        applyTheme(newTheme);

    });

}

// =======================
// Cart Counter
// =======================

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("visionx-cart")) || [];

    const cartLink = document.querySelector('a[href="cart.html"]');

    if (cartLink) {
        cartLink.textContent = `Cart (${cart.length})`;
    }

}

updateCartCount();