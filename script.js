/**
 * Digital Clock Logic
 */

let is24HourFormat = false;
const themeStorageKey = 'digital-clock-theme';
const defaultTheme = 'midnight';

const formatButton = document.getElementById('toggle-format');
const themeMenu = document.getElementById('theme-menu');
const closeThemeMenuButton = document.getElementById('close-theme-menu');
const themeOptionButtons = document.querySelectorAll('.theme-option');

function applyTheme(themeName) {
    document.documentElement.dataset.theme = themeName;
    localStorage.setItem(themeStorageKey, themeName);
}

function getActiveTheme() {
    return document.documentElement.dataset.theme || localStorage.getItem(themeStorageKey) || defaultTheme;
}

function openThemeMenu() {
    themeMenu.hidden = false;
    themeMenu.setAttribute('aria-hidden', 'false');
    themeMenu.classList.add('is-open');
    themeOptionButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.themeChoice === getActiveTheme());
    });
    document.querySelector(`.theme-option[data-theme-choice="${getActiveTheme()}"]`)?.focus();
}

function closeThemeMenu() {
    themeMenu.classList.remove('is-open');
    themeMenu.setAttribute('aria-hidden', 'true');
    themeMenu.hidden = true;
}

applyTheme(getActiveTheme());

function updateClock() {
    const now = new Date();
    
    // 1. Handle Time
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Determine AM/PM
    const isPm = hours >= 12;
    
    // Handle 12/24 hour conversion
    if (!is24HourFormat) {
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    }
    const formattedHours = String(hours).padStart(2, '0');

    // Update DOM Time
    document.getElementById('hours').textContent = formattedHours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    // Update AM/PM Indicators
    const amEl = document.getElementById('am');
    const pmEl = document.getElementById('pm');
    
    if (is24HourFormat) {
        amEl.classList.remove('active');
        pmEl.classList.remove('active');
    } else {
        if (isPm) {
            pmEl.classList.add('active');
            amEl.classList.remove('active');
        } else {
            amEl.classList.add('active');
            pmEl.classList.remove('active');
        }
    }

    // 2. Handle Day of the Week
    // Reset all days first
    for (let i = 0; i < 7; i++) {
        document.getElementById(`day-${i}`).classList.remove('active');
    }
    // Highlight current day
    const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday...
    document.getElementById(`day-${dayIndex}`).classList.add('active');

    // 3. Handle Date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('date-display').textContent = dateString;
}

// Toggle Format Logic
formatButton.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    formatButton.textContent = 
        is24HourFormat ? 'SWITCH TO 12H' : 'SWITCH TO 24H';
    updateClock(); // Update immediately
});

themeOptionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        applyTheme(button.dataset.themeChoice);
        closeThemeMenu();
    });
});

closeThemeMenuButton.addEventListener('click', closeThemeMenu);

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        if (themeMenu.hidden) {
            openThemeMenu();
        } else {
            closeThemeMenu();
        }
    }

    if (event.key === 'Escape' && !themeMenu.hidden) {
        closeThemeMenu();
    }
});

// Start the Heartbeat
setInterval(updateClock, 1000);
updateClock();
