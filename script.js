document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const accommodation_name = data.accommodation_name;
            document.getElementById('accommodation_name').textContent = accommodation_name;

            populateDropdown(data.rooms);
            setupAddCustomerButton(data);
            updateTotalCustomers(data.customers); // Update total customers on page load
        })
        .catch(error => console.error('Error fetching the JSON data:', error));

    function populateDropdown(rooms) {
        const dropdown = document.getElementById('rooms-list');
        // Check if dropdown exists
        if (dropdown) {
            // Clear existing options (if any)
            dropdown.innerHTML = '';

            // Create and add the default "Select a Room" option
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "Select a Room";
            dropdown.appendChild(defaultOption);

            // Populate dropdown with room options
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id; // Set the value to the room ID
                option.textContent = room.name; // Set the text to the room name
                dropdown.appendChild(option); // Add the option to the dropdown
            });

            // Add change event listener after population
            dropdown.addEventListener('change', () => {
                const selectedValue = dropdown.value;
                // Log the selected value to check
                console.log("Selected room:", selectedValue);
            });
        } else {
            console.error('Dropdown element not found.');
        }
    }

    function setupAddCustomerButton(data) {
        const addnewcusbut = document.getElementById('new-cus-button');
        const input_name = document.getElementById('name');
        const input_email = document.getElementById('email');
        const input_duration = document.getElementById('duration');
        const input_payment = document.getElementById('cash');
        const input_room = document.getElementById('rooms-list');
        const input_arrival = document.getElementById('arrivedate');

        addnewcusbut.addEventListener('click', function () {
            const newCustomer = {
                name: input_name.value,
                email: input_email.value,
                length_of_stay: input_duration.value,
                date_arrival: input_arrival.value,
                cash: input_payment.value,
                room: input_room.value
            };

            fetch('http://127.0.0.1:3000/add-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            })
                .then(response => response.json())
                .then(() => {
                    // Update the customers data
                    fetch('data.json')
                        .then(response => response.json())
                        .then(updatedData => {
                            updateTotalCustomers(updatedData.customers);
                            window.location.href = 'customer.html';
                        })
                        .catch(error => console.error('Error fetching updated data:', error));
                })
                .catch(error => console.error('Error adding customer:', error));
        });
    }

    function updateTotalCustomers(customers) {
        const totalCustomers = Object.keys(customers).length;
        document.getElementById('tot-cus').textContent = `${totalCustomers}`;
    }
});
