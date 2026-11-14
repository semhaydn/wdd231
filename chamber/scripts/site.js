const nav = document.querySelector("nav");
const menuToggle = document.querySelector("#menu-toggle");
const darkModeToggle = document.querySelector("#dark-mode-switch");
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("show");
        menuToggle.setAttribute("aria-expanded", isOpen);
    });
}

if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });
}

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}