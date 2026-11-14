const directory = document.querySelector('#member-directory');
const gridViewButton = document.querySelector('#grid-view');
const listViewButton = document.querySelector('#list-view');

function setDirectoryView(view) {
    const isGrid = view === 'grid';
    directory.classList.toggle('list-view', !isGrid);
    gridViewButton.setAttribute('aria-pressed', String(isGrid));
    listViewButton.setAttribute('aria-pressed', String(!isGrid));
}

function createMemberCard(member) {
    const card = document.createElement('article');
    card.className = 'member-card';

    const logo = document.createElement('img');
    logo.src = member.logo;
    logo.alt = `${member.name} logo`;
    logo.width = 120;
    logo.height = 80;
    logo.loading = 'lazy';
    card.append(logo);

    const details = document.createElement('div');
    details.append(
        Object.assign(document.createElement('h3'), { textContent: member.name }),
        Object.assign(document.createElement('p'), { textContent: member.address }),
        Object.assign(document.createElement('p'), { textContent: `${member.membershipLevel} Member` })
    );

    if (member.logoCredit && member.logoAttribution) {
        const attribution = new URL(member.logoAttribution);
        if (attribution.protocol === 'https:') {
            const credit = document.createElement('a');
            credit.className = 'logo-credit';
            credit.href = attribution.href;
            credit.rel = 'noopener noreferrer';
            credit.textContent = member.logoCredit;
            details.append(credit);
        }
    }

    const phone = document.createElement('a');
    phone.href = `tel:${member.phone.replace(/[^\d+]/g, '')}`;
    phone.textContent = member.phone;
    details.append(phone);

    const websiteUrl = new URL(member.website);
    if (websiteUrl.protocol === 'https:' || websiteUrl.protocol === 'http:') {
        const website = document.createElement('a');
        website.href = websiteUrl.href;
        website.rel = 'noopener noreferrer';
        website.textContent = 'Visit website';
        details.append(website);
    }

    card.append(details);
    return card;
}

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Unable to load member data.');
        }

        const data = await response.json();
        if (!Array.isArray(data.members)) {
            throw new Error('Member data is not in the expected format.');
        }

        directory.replaceChildren(...data.members.map(createMemberCard));
    } catch (error) {
        const message = document.createElement('p');
        message.textContent = 'The member directory is temporarily unavailable.';
        directory.replaceChildren(message);
        console.error(error);
    }
}

gridViewButton.addEventListener('click', () => setDirectoryView('grid'));
listViewButton.addEventListener('click', () => setDirectoryView('list'));
loadMembers();
