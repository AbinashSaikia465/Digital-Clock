/**
 * Digital Clock Logic
 */

let is24HourFormat = false;

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
document.getElementById('toggle-format').addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    document.getElementById('toggle-format').textContent = 
        is24HourFormat ? 'SWITCH TO 12H' : 'SWITCH TO 24H';
    updateClock(); // Update immediately
});

// Start the Heartbeat
setInterval(updateClock, 1000);
updateClock();
