const API_KEY = '17e69e0463561266d9cf2e2a84341d57';
const CITY = 'Istanbul';
const COUNTRY = 'TR';
const UNITS = 'metric';

const weatherCurrent = document.querySelector('#weather-current');
const weatherForecast = document.querySelector('#weather-forecast');
const spotlightContainer = document.querySelector('#spotlight-container');

const formatDescription = (description) =>
    description.replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date) =>
    new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }).format(date);

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

        const events = [...new Set(
            forecastData.list
                .slice(0, 8)
                .map((item) => formatDescription(item.weather[0].description))
        )];

        weatherCurrent.innerHTML = `
            <div class="current-weather">
                <span class="weather-temp">${Math.round(currentData.main.temp)}°C</span>
                <div>
                    <p class="weather-description">${formatDescription(currentData.weather[0].description)}</p>
                    <p>Feels like ${Math.round(currentData.main.feels_like)}°C</p>
                </div>
            </div>
            <p class="weather-events"><strong>Conditions:</strong> ${events.join(', ')}</p>
        `;

        const days = new Map();

        forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const key = date.toISOString().slice(0, 10);

            if (!days.has(key) && key !== new Date().toISOString().slice(0, 10)) {
                days.set(key, item);
            }
        });

        weatherForecast.innerHTML = [...days.values()].slice(0, 3).map((item) => `
            <article class="forecast-card">
                <h3>${formatDate(new Date(item.dt * 1000))}</h3>
                <p>${Math.round(item.main.temp)}°C</p>
                <p>${formatDescription(item.weather[0].description)}</p>
            </article>
        `).join('');
    } catch (error) {
        weatherCurrent.innerHTML = '<p>Weather information is temporarily unavailable.</p>';
        weatherForecast.innerHTML = '';
        console.error(error);
    }
}

function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');

        if (!response.ok) {
            throw new Error('Unable to load member data.');
        }

        const data = await response.json();
        const eligibleMembers = data.members.filter(
            (member) => ['Gold', 'Silver'].includes(member.membershipLevel)
        );

        const selectedMembers = shuffle(eligibleMembers).slice(0, 3);

        spotlightContainer.innerHTML = selectedMembers.map((member) => `
            <article class="spotlight-card">
                <img src="${member.logo}" alt="${member.name} logo" width="120" height="80" loading="lazy">
                <div>
                    <h3>${member.name}</h3>
                    <p class="membership">${member.membershipLevel} Member</p>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        spotlightContainer.innerHTML = '<p>Business spotlights are temporarily unavailable.</p>';
        console.error(error);
    }
}

getWeather();
loadSpotlights();