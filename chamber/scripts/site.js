const nav = document.querySelector('#primary-navigation');
const menuToggle = document.querySelector('#menu-toggle');
const darkModeToggle = document.querySelector('#dark-mode-switch');
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

function closeNavigation() {
    if (!nav || !menuToggle) {
        return;
    }

    nav.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('show');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', (event) => {
        if (event.target instanceof Element && event.target.closest('a')) {
            closeNavigation();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('show')) {
            closeNavigation();
            menuToggle.focus();
        }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', closeNavigation);
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
    });
}

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = new Date(document.lastModified).toLocaleDateString();
}
