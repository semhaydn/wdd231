const params = new URLSearchParams(window.location.search);

const fields = [
    ['firstName', 'summary-first-name'],
    ['lastName', 'summary-last-name'],
    ['email', 'summary-email'],
    ['phone', 'summary-phone'],
    ['organization', 'summary-organization']
];

fields.forEach(([parameter, elementId]) => {
    const output = document.getElementById(elementId);
    const value = params.get(parameter);

    if (output) {
        // textContent prevents query-string values from being interpreted as HTML.
        output.textContent = value && value.trim() ? value.trim() : 'Not provided';
    }
});

const timestampOutput = document.getElementById('summary-timestamp');
const timestampValue = params.get('timestamp');

if (timestampOutput) {
    if (timestampValue) {
        const parsedDate = new Date(timestampValue);

        timestampOutput.textContent = Number.isNaN(parsedDate.getTime())
            ? 'Date unavailable'
            : parsedDate.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
    } else {
        timestampOutput.textContent = 'Not provided';
    }
}
