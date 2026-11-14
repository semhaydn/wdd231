const API_KEY = '17e69e0463561266d9cf2e2a84341d57';
const CITY = 'Istanbul';
const COUNTRY = 'TR';
const UNITS = 'metric';

const weatherCurrent = document.querySelector('#weather-current');
const weatherForecast = document.querySelector('#weather-forecast');
const spotlightContainer = document.querySelector('#spotlight-container');

const formatDescription = (description = 'Conditions unavailable') =>
    description.replace(/\b\w/g, (letter) => letter.toUpperCase());

const localDateKey = (timestamp, timezoneOffset) =>
    new Date((timestamp + timezoneOffset) * 1000).toISOString().slice(0, 10);

const formatDate = (dateKey) =>
    new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(new Date(`${dateKey}T00:00:00Z`));

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    element.textContent = text;
    return element;
}

function isHttpUrl(value) {
    if (typeof value !== 'string' || !URL.canParse(value)) {
        return false;
    }

    return ['https:', 'http:'].includes(new URL(value).protocol);
}

function renderForecast(forecastData, currentData) {
    const timezoneOffset = forecastData.city.timezone;
    const today = localDateKey(currentData.dt, timezoneOffset);
    const dailyForecasts = new Map();

    forecastData.list.forEach((item) => {
        if (!Number.isFinite(item.dt) || !Number.isFinite(item.main?.temp_min) ||
            !Number.isFinite(item.main?.temp_max) || !item.weather?.[0]?.description) {
            return;
        }

        const dateKey = localDateKey(item.dt, timezoneOffset);
        if (dateKey <= today) {
            return;
        }

        const localHour = new Date((item.dt + timezoneOffset) * 1000).getUTCHours();
        const noonDistance = Math.abs(localHour - 12);
        const day = dailyForecasts.get(dateKey) ?? {
            low: item.main.temp_min,
            high: item.main.temp_max,
            description: item.weather[0].description,
            representativeDistance: noonDistance
        };

        day.low = Math.min(day.low, item.main.temp_min);
        day.high = Math.max(day.high, item.main.temp_max);
        if (noonDistance < day.representativeDistance) {
            day.description = item.weather[0].description;
            day.representativeDistance = noonDistance;
        }
        dailyForecasts.set(dateKey, day);
    });

    const days = [...dailyForecasts.entries()]
        .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
        .slice(0, 3);

    weatherForecast.replaceChildren();
    if (days.length !== 3) {
        weatherForecast.append(
            createTextElement('p', '', 'Three-day forecast is temporarily unavailable.')
        );
        return;
    }

    days.forEach(([dateKey, day]) => {
        const card = document.createElement('article');
        card.className = 'forecast-card';
        card.append(
            createTextElement('h3', '', formatDate(dateKey)),
            createTextElement(
                'p',
                'forecast-temperature',
                `Low ${Math.round(day.low)}°C · High ${Math.round(day.high)}°C`
            ),
            createTextElement('p', '', formatDescription(day.description))
        );
        weatherForecast.append(card);
    });
}

async function getWeather() {
    const currentUrl =
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&appid=${API_KEY}&units=${UNITS}`;
    const forecastUrl =
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY}&appid=${API_KEY}&units=${UNITS}`;

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Unable to retrieve weather data.');
        }

        const [currentData, forecastData] = await Promise.all([
            currentResponse.json(),
            forecastResponse.json()
        ]);

        if (!Number.isFinite(currentData.main?.temp) ||
            !Number.isFinite(currentData.main?.feels_like) ||
            !currentData.weather?.[0]?.description ||
            !Number.isFinite(currentData.dt) ||
            !Number.isFinite(forecastData.city?.timezone) ||
            !Array.isArray(forecastData.list)) {
            throw new Error('The weather service returned incomplete data.');
        }

        const current = document.createElement('div');
        current.className = 'current-weather';
        current.append(
            createTextElement('span', 'weather-temp', `${Math.round(currentData.main.temp)}°C`)
        );
        const details = document.createElement('div');
        details.append(
            createTextElement('p', 'weather-description', formatDescription(currentData.weather[0].description)),
            createTextElement('p', '', `Feels like ${Math.round(currentData.main.feels_like)}°C`)
        );
        current.append(details);
        weatherCurrent.replaceChildren(current);
        renderForecast(forecastData, currentData);
    } catch (error) {
        weatherCurrent.replaceChildren(
            createTextElement('p', '', 'Weather information is temporarily unavailable.')
        );
        weatherForecast.replaceChildren();
        console.error(error);
    }
}

function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
}

function createSpotlight(member) {
    const card = document.createElement('article');
    card.className = 'spotlight-card';

    const logo = document.createElement('img');
    logo.src = member.logo;
    logo.alt = `${member.name} logo`;
    logo.width = 120;
    logo.height = 80;
    logo.loading = 'lazy';
    card.append(logo);

    const details = document.createElement('div');
    details.append(
        createTextElement('h3', '', member.name),
        createTextElement('p', 'membership', `${member.membershipLevel} Member`),
        createTextElement('p', '', member.address)
    );



    const phone = document.createElement('a');
    phone.href = `tel:${member.phone.replace(/[^\d+]/g, '')}`;
    phone.textContent = member.phone;
    details.append(phone);

    if (isHttpUrl(member.website)) {
        const websiteUrl = new URL(member.website);
        const website = document.createElement('a');
        website.href = websiteUrl.href;
        website.target = '_blank';
        website.rel = 'noopener noreferrer';
        website.textContent = 'Visit website';
        details.append(website);
    }

    card.append(details);
    return card;
}

async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Unable to load member data.');
        }

        const data = await response.json();
        if (!Array.isArray(data.members)) {
            throw new Error('Member data is not in the expected format.');
        }

        const eligibleMembers = data.members.filter((member) =>
            member && typeof member === 'object' &&
            ['Gold', 'Silver'].includes(member.membershipLevel) &&
            ['name', 'address', 'phone', 'logo', 'website'].every(
                (field) => typeof member[field] === 'string' && member[field].trim()
            ) &&
            typeof member.logo === 'string' && member.logo.trim() && isHttpUrl(member.website)
        );
        const selectedMembers = shuffle(eligibleMembers).slice(0, 3);
        if (selectedMembers.length < 2) {
            throw new Error('At least two complete Gold or Silver members are required.');
        }

        spotlightContainer.replaceChildren(...selectedMembers.map(createSpotlight));
    } catch (error) {
        spotlightContainer.replaceChildren(
            createTextElement('p', '', 'Business spotlights are temporarily unavailable.')
        );
        console.error(error);
    }
}

getWeather();
loadSpotlights();
