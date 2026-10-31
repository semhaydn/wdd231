const menuButton = document.querySelector('.nav-toggle');
const primaryMenu = document.querySelector('#primary-menu');
const desktopNavigation = window.matchMedia('(min-width: 48rem)');

function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    primaryMenu.classList.remove('is-open');
}

menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    primaryMenu.classList.toggle('is-open', !isExpanded);
});

desktopNavigation.addEventListener('change', (event) => {
    if (event.matches) {
        closeMenu();
    }
});