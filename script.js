fetch('data.json') // Replace 'data.json' with the path to your JSON file
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        // Get the message from the JSON data
        const accommodation_name = data.accommodation_name;
        const avaliable_rooms = data.avaliable_rooms - (data.customers).length;

        // Assign the text to the HTML element with id 'message'
        document.getElementById('accommodation_name').textContent = accommodation_name;
        document.getElementById('avaliable_rooms').textContent = avaliable_rooms;
    })
    .catch(error => console.error('Error fetching the JSON file:', error));

// Fetch the JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        function addCustomer(name, email, length_of_stay, date_arrival, cash, room) {
            const newId = Object.keys(data.customers).length + 1;
            const newCustomer = {
                name: name,
                email: email,
                length_of_stay: length_of_stay,
                date_arrival: date_arrival,
                cash: cash,
                room: room
            };
            data.customers[newId] = newCustomer;
        }
    })
    .catch(error => console.error('Error fetching the JSON file:', error));

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.getElementById('rooms-list');

    // Fetch the JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Iterate over each room in the 'rooms' array and create an option element
            data.rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.id; // Set the value to the room ID
                option.textContent = room.name; // Set the display text to the room name
                dropdown.appendChild(option); // Add the option to the dropdown
            });
        })
        .catch(error => console.error('Error fetching the JSON data:', error));
     
        dropdown.addEventListener('change', () => {
        const defaultOption = dropdown.querySelector('option[value="Select a Room"]');
        if (defaultOption) {
            defaultOption.remove(); // Remove the default "Select a room" option
        }
    });
});