fetch('data.json') // Replace 'data.json' with the path to your JSON file
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        // Get the message from the JSON data
        const accommodation_name = data.accommodation_name;

        // Assign the text to the HTML element with id 'message'
        document.getElementById('accommodation_name').textContent = accommodation_name;
    })
    .catch(error => console.error('Error fetching the JSON file:', error));

// Fetch the JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        function addCustomer(name, email, length_of_stay, date_arrival) {
            const newId = Object.keys(data.customers).length + 1;
            const newCustomer = {
                name: name,
                email: email,
                length_of_stay: length_of_stay,
                date_arrival: date_arrival
            };
            data.customers[newId] = newCustomer;
        }
    })
    .catch(error => console.error('Error fetching the JSON file:', error));
