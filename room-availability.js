document.addEventListener('DOMContentLoaded', function() {
    generateAvailabilityForms();
});

function generateAvailabilityForms() {
    const container = document.getElementById('availability-forms-container');
    container.innerHTML = ''; // Clear existing forms

    const startDate = new Date('2024-10-14');
    const roomNumbers = Array.from({length: 10}, (_, i) => i + 1); // Assuming 10 rooms

    for (let i = 0; i < 7; i++) { // Generate forms for 7 days starting from 14/10/2024
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        const form = document.createElement('div');
        form.className = 'availability-form';
        form.innerHTML = `
            <h3>${dateString}</h3>
            <form>
                ${roomNumbers.map(roomNumber => `
                    <div class="room-status">
                        <span class="room-number">Room ${roomNumber}
                        <div class="status-options">
                            <label class="status-option">
                                <input type="radio" name="room${roomNumber}" value="available" disabled>
                                Available
                            </label>
                            <label class="status-option">
                                <input type="radio" name="room${roomNumber}" value="booked" disabled>
                                Booked
                            </label>
                        </div>
                    </div>
                `).join('')}
            </form>
        `;
        container.appendChild(form);
    }

    // Load saved availability data
    loadAvailabilityData();
}

function loadAvailabilityData() {
    const availabilityData = JSON.parse(localStorage.getItem('roomAvailability')) || {};
    const forms = document.querySelectorAll('.availability-form');
    const today = new Date();

    forms.forEach(form => {
        const date = form.querySelector('h3').textContent;
        const formDate = new Date(date);

        if (formDate >= today) {
            if (availabilityData[date]) {
                Object.entries(availabilityData[date]).forEach(([roomNumber, status]) => {
                    const radio = form.querySelector(`input[name="room${roomNumber}"][value="${status}"]`);
                    if (radio) radio.checked = true;
                });
            }
        }
    });
}

function updateAvailabilityData(date, roomNumber, status) {
    let availabilityData = JSON.parse(localStorage.getItem('roomAvailability')) || {};
    if (!availabilityData[date]) {
        availabilityData[date] = {};
    }
    availabilityData[date][roomNumber] = status;
    localStorage.setItem('roomAvailability', JSON.stringify(availabilityData));

    // Refresh the forms
    loadAvailabilityData();
}

// Function to clear old data and refresh forms
function refreshWeeklyData() {
    const startDate = new Date('2024-10-14');
    const oneWeekLater = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    let availabilityData = JSON.parse(localStorage.getItem('roomAvailability')) || {};

    // Remove data outside the specified week
    Object.keys(availabilityData).forEach(date => {
        const currentDate = new Date(date);
        if (currentDate < startDate || currentDate >= oneWeekLater) {
            delete availabilityData[date];
        }
    });

    localStorage.setItem('roomAvailability', JSON.stringify(availabilityData));
    generateAvailabilityForms();
}

// Call this function when the page loads
refreshWeeklyData();

// Expose this function globally so it can be called from other scripts
window.updateAvailabilityData = updateAvailabilityData;
