document.getElementById("customer-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const customerData = {
        "id": Date.now().toString(),
        "name": document.getElementById('name').value,
        "room": document.getElementById('room').value,
        "date": document.getElementById('arrival').value,
        "email": document.getElementById('email').value,
        "payment": document.getElementById('payment').value,
        "duration": document.getElementById('duration').value
    };

    const isFull = await checkIfRoomsFull();
    if (isFull) {
        window.alert("No more rooms available");
        return;
    }

    const isTaken = await checkIfRoomIsTaken(customerData.room, customerData.date, Number(customerData.duration));
    if (isTaken) {
        window.alert("Room already taken");
        return;
    }

    fetch("http://localhost:3000/add-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").textContent = data.message;
        window.location.href = "html/customers/customers.html";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("message").textContent = "Failed to add customer";
    });
});



function populateRoomNumberDropdown(data) {
    const elementRoom = document.getElementById("room")

    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Select a Room"
    defaultOption.disabled = true
    defaultOption.selected = true
    elementRoom.appendChild(defaultOption)

    data.forEach(roomname => {
       const option = document.createElement("option")
        option.value = roomname
        option.textContent = roomname
                
        elementRoom.appendChild(option)
    });

}

fetch('../../data/info.json')
    .then(response => response.json())
    .then(info => {
        populateRoomNumberDropdown(info.rooms)
    })

function checkIfDateIsBetween(date, days) {
    const arrivalDate = new Date(date); // Convert string to Date
    const EndDate = new Date(arrivalDate); // Copy the arrival date
    EndDate.setUTCDate(arrivalDate.getUTCDate() + days); // Add the duration in days

    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set to midnight to ignore time during comparison

    arrivalDate.setHours(0, 0, 0, 0); // Set to midnight
    EndDate.setHours(0, 0, 0, 0); // Set to midnight

    console.log("Today: ", today); // Debugging
    console.log("Arrival Date: ", arrivalDate); // Debugging
    console.log("End Date: ", EndDate); // Debugging

    // Check if today is between the arrival and end date
    if (today >= arrivalDate && today <= EndDate) {
        console.log("Customer is within the stay period");
        return true;
    }

    console.log("Customer is not within the stay period");
    return false;
}

async function checkIfRoomsFull() {
    try {
        const response = await fetch('../../data/info.json');
        const info = await response.json();
        
        let tot_customers = 0; // Declare outside of loop

        info.customers.forEach(customer => {
            if (checkIfDateIsBetween(customer.date, Number(customer.duration))) {
                tot_customers += 1; // Correctly increment count
            }
        });

        console.log("Total Customers:", tot_customers);

        return tot_customers >= info.maxrooms;
    } catch (error) {
        console.error("Error checking rooms:", error);
        return false;
    }
}

function isDateRangeOverlapping(start1, end1, start2, end2) {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);

    // Ensure dates are valid
    if (isNaN(s1) || isNaN(e1) || isNaN(s2) || isNaN(e2)) {
        console.error("Invalid date input");
        return false;
    }

    // Normalize time (set to midnight for fair comparison)
    s1.setHours(0, 0, 0, 0);
    e1.setHours(0, 0, 0, 0);
    s2.setHours(0, 0, 0, 0);
    e2.setHours(0, 0, 0, 0);

    // Two ranges overlap if one starts before the other ends
    return s1 <= e2 && s2 <= e1;
}

function addDays(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

async function checkIfRoomIsTaken(room, date, days) {
    try {
        const response = await fetch('../../data/info.json');
        const info = await response.json();

        // Ensure date is a Date object
        const newStart = new Date(date);
        const newEnd = addDays(newStart, days);

        for (const customer of info.customers) {  // ✅ Corrected key name
            if (customer.room == room) {
                const customerStart = new Date(customer.date);
                const customerEnd = addDays(customerStart, Number(customer.duration)); // ✅ Ensure duration is a number
                
                if (isDateRangeOverlapping(newStart, newEnd, customerStart, customerEnd)) {
                    return true; // ✅ Exit early if overlap found
                }
            }
        }

        return false;
    }
    catch (error) {
        console.error("Error checking rooms:", error);
        return false;
    }
}
