document.addEventListener('DOMContentLoaded', function() {
    const bookRoomLink = document.getElementById('book-room-link');
    const formSection = document.getElementById('form-section');
    const checkoutSection = document.getElementById('checkout-section');
    const paymentConfirmation = document.getElementById('payment-confirmation');

    if (bookRoomLink) {
        bookRoomLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (formSection) {
                formSection.style.display = 'block';
                checkoutSection.style.display = 'none';
                paymentConfirmation.style.display = 'none';
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Get the room availability table and stored data table
    const roomAvailabilityTable = document.getElementById('room-availability-table');
    const storedDataTable = document.getElementById('stored-data-table');
    const roomAvailabilityList = document.getElementById('room-availability-list');
    const storedDataList = document.getElementById('stored-data-list');

    // Initialize the room availability data
    const roomAvailabilityData = {};

    // Initialize the stored data
    const storedData = [];

    function updateRoomAvailability(roomNumber, numberOfNights) {
    const today = new Date();

    for (let i = 0; i < numberOfNights; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        window.updateAvailabilityData(dateString, roomNumber, 'booked');
    }
    }


// Add event listener to the book room button
    document.getElementById('book-room').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Book room button clicked');

// Get the form data
    bookingDetails = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        idNumber: document.getElementById('id-number').value,
        phoneNumber: document.getElementById('phone-number').value,
        amountToPay: parseFloat(document.getElementById('amount-to-pay').value),
        numberOfNights: document.getElementById('number-of-nights').value,
        roomNumber: document.getElementById('room-number').value,
        paymentMethod: document.getElementById('payment-method').value
    };

// Validate the form data
    if (Object.values(bookingDetails).some(value => value === '')) {
        alert('Please fill in all the fields');
        return;
    }

// Calculate the total amount to pay
    bookingDetails.amountToPay = bookingDetails.numberOfNights * 1000;

// Update the checkout form with personal details
    document.getElementById('personal-details').innerHTML = `
        <h3>Personal Details:</h3>
        <p>Name: ${bookingDetails.firstName} ${bookingDetails.lastName}</p>
        <p>ID Number: ${bookingDetails.idNumber}</p>
        <p>Phone Number: ${bookingDetails.phoneNumber}</p>
        <p>Room Number: ${bookingDetails.roomNumber}</p>
        <p>Number of Nights: ${bookingDetails.numberOfNights}</p>
        <p>Payment Method: ${bookingDetails.paymentMethod}</p>
    `;

// Update the total amount to pay
    document.getElementById('total-amount').textContent = `Ksh ${bookingDetails.    amountToPay.toFixed(2)}`;

// Hide the booking form and show the checkout form
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('checkout-section').style.display = 'block';

    });

// Function to update stored data
    function updateStoredData(data) {
    let storedData = JSON.parse(localStorage.getItem('storedData')) || [];
storedData.push(data);
    localStorage.setItem('storedData', JSON.stringify(storedData));
    console.log('Data stored:', data);
    }


// Function to generate stored data table
    function generateStoredDataTable() {
    const storedDataList = document.getElementById('stored-data-list');
    if (!storedDataList) {
        console.log('stored-data-list element not found');
        return;
    }

    const storedData = JSON.parse(localStorage.getItem('storedData')) || [];
    console.log('Retrieved stored data:', storedData);

    storedDataList.innerHTML = '';
    storedData.forEach((data) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.date}</td>
            <td>${data.firstName}</td>
            <td>${data.lastName}</td>
            <td>${data.idNumber}</td>
            <td>${data.phoneNumber}</td>
            <td>${data.amountToPay}</td>
            <td>${data.numberOfNights}</td>
            <td>${data.roomNumber}</td>
            <td>${data.paymentMethod}</td>
            <td>${data.transactionNumber}</td>
            <td>${data.cashAmount}</td>
            <td>${data.balance}</td>
        `;
        storedDataList.appendChild(row);
    });
    console.log('Table generated');
    }

// Add event listener to the checkout button
    document.getElementById('checkout-button').addEventListener('click', (e) => {
e.preventDefault();


// Get the checkout form data
    const amountPaid = parseFloat(document.getElementById('amount-paid').value);
    const transactionNumber = document.getElementById('transaction-number').value;

// Validate the checkout form data
    if (isNaN(amountPaid) || transactionNumber === '') {
        alert('Please fill in all the fields correctly');
        return;
    }

// Calculate balance
    const balance = bookingDetails.amountToPay - amountPaid;

// Update payment confirmation details
    document.getElementById('payment-confirmation-details').innerHTML = `
        <p>Amount Paid: Ksh${amountPaid.toFixed(2)}</p>
        <p>Total Amount: Ksh${bookingDetails.amountToPay.toFixed(2)}</p>
        <p>Balance: Ksh${balance.toFixed(2)}</p>
        <p>Transaction Number: ${transactionNumber}</p>
    `;

// Hide the checkout form and show the payment confirmation section
    document.getElementById('checkout-section').style.display = 'none';
    document.getElementById('payment-confirmation').style.display = 'block';

// Update room availability
    updateRoomAvailability(bookingDetails.roomNumber, bookingDetails.numberOfNights);

// Update stored data
    const currentDate = new Date().toISOString().split('T')[0];
    updateStoredData({
        date: currentDate,
        ...bookingDetails,
        transactionNumber,
        cashAmount: amountPaid,
        balance
    });


// Update room availability
    updateRoomAvailabilityData(currentDate, bookingDetails.roomNumber, 'Occupied');

// Save the booking data
    window.saveBookingData(bookingDetails);

    });

// Initial generation of tables
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM content loaded');
        generateStoredDataTable();
        generateRoomAvailabilityTable();
    });

// Add this function to get available rooms for a specific date
    function getAvailableRooms(date) {
    const availabilityData = JSON.parse(localStorage.getItem('roomAvailability')) || {};
    const dateData = availabilityData[date] || {};
    const allRooms = Array.from({length: 10}, (_, i) => i + 1); // Assuming 10 rooms
    return allRooms.filter(roomNumber => dateData[roomNumber] !== 'booked');
    }

// Call this function when loading the booking page to update the room list
    function updateAvailableRoomsList() {
    const today = new Date().toISOString().split('T')[0];
    const availableRooms = getAvailableRooms(today);
    const roomSelect = document.getElementById('room-number');
    roomSelect.innerHTML = availableRooms.map(room => `<option value="${room}">Room ${room}</option>`).join('');
    }

// Call this when the booking page loads
    document.addEventListener('DOMContentLoaded', updateAvailableRoomsList);

 });


