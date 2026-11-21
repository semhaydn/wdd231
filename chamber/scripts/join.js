const timestampInput = document.querySelector('#timestamp');

if (timestampInput) {
    // Capture the date and time when the application page is loaded.
    timestampInput.value = new Date().toISOString();
}

// Open each membership dialog from its matching card link.
document.querySelectorAll('[data-dialog]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const dialog = document.getElementById(link.dataset.dialog);

        if (dialog instanceof HTMLDialogElement) {
            dialog.showModal();
        }
    });
});

// Close dialogs with their close buttons. The native dialog also supports Escape.
document.querySelectorAll('.membership-dialog').forEach((dialog) => {
    const closeButton = dialog.querySelector('.dialog-close');

    if (closeButton) {
        closeButton.addEventListener('click', () => dialog.close());
    }

    // Clicking the backdrop closes the dialog without closing it when its content is clicked.
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});
