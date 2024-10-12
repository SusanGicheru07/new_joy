document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded on stored-data page');
    clearAllStoredData(); // Clear all existing data
    generateStoredDataTable();
});

function clearAllStoredData() {
    localStorage.removeItem('storedData');
    console.log('All stored data has been cleared');
}

function generateStoredDataTable() {
    const storedDataList = document.getElementById('stored-data-list');
    if (!storedDataList) {
        console.log('stored-data-list element not found');
        return;
    }

    const storedData = JSON.parse(localStorage.getItem('storedData')) || [];
    console.log('Retrieved stored data:', storedData);

    // Sort the data by date
    storedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    storedDataList.innerHTML = '';

    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    storedData.forEach((data) => {
        const bookingDate = new Date(data.date);
        if (bookingDate >= twoWeeksAgo && bookingDate <= today) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.date || ''}</td>
                <td>${data.firstName || ''}</td>
                <td>${data.lastName || ''}</td>
                <td>${data.idNumber || ''}</td>
                <td>${data.phoneNumber || ''}</td>
                <td>${data.amountToPay || ''}</td>
                <td>${data.numberOfNights || ''}</td>
                <td>${data.roomNumber || ''}</td>
                <td>${data.paymentMethod || ''}</td>
                <td>${data.transactionNumber || ''}</td>
                <td>${data.cashAmount || ''}</td>
                <td>${data.balance || ''}</td>
            `;
            storedDataList.appendChild(row);
        }
    });
    console.log('Table generated');
}

function clearOldData() {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    let storedData = JSON.parse(localStorage.getItem('storedData')) || [];
    storedData = storedData.filter(data => new Date(data.date) >= twoWeeksAgo);
    
    localStorage.setItem('storedData', JSON.stringify(storedData));
    console.log('Old data cleared');
}

function saveBookingData(bookingDetails) {
    let storedData = JSON.parse(localStorage.getItem('storedData')) || [];
    storedData.push(bookingDetails);
    localStorage.setItem('storedData', JSON.stringify(storedData));
    console.log('Booking data saved');

    // Clear old data after saving new data
    clearOldData();
}

// Expose these functions globally so they can be called from other scripts
window.saveBookingData = saveBookingData;
window.clearAllStoredData = clearAllStoredData;
