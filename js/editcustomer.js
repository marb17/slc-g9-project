document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get("id");

    if (!customerId) {
        alert("No customer ID provided");
        return;
    }

    const response = await fetch("../../data/info.json");
    const data = await response.json();
    const customer = data.customers.find(c => c.id === customerId);

    if (!customer) {
        alert("Customer not found");
        return;
    }

    document.getElementById("name").value = customer.name;
    document.getElementById("email").value = customer.email;
    document.getElementById("duration").value = customer.duration;
    document.getElementById("arrival").value = customer.date;
    document.getElementById("room").value = customer.room;
    document.getElementById("payment").value = customer.payment;

    document.getElementById("edit-customer-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const updatedCustomer = {
            id: customerId,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            duration: document.getElementById("duration").value,
            date: document.getElementById("arrival").value,
            room: document.getElementById("room").value,
            payment: document.getElementById("payment").value
        };

        fetch("http://localhost:3000/edit-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCustomer)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "../../html/customers/customers.html";
            } else {
                alert("Failed to update customer");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});

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
        
        var maxrooms = 0
        
        info.rooms.forEach(room => {
            maxrooms += 1
        });
        
        return tot_customers >= maxrooms;
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

async function populateRoomNumberDropdown(data) {
    const elementRoom = document.getElementById("room");
    elementRoom.innerHTML = "";

    // Add default "Select a Room" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a Room";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    elementRoom.appendChild(defaultOption);

    // Get input values only once
    const arrivalDate = document.getElementById('arrival').value;
    const duration = document.getElementById('duration').value;

    for (const roomname of data) {
        console.log("Checking room:", roomname.room);

        const isTaken = await checkIfRoomIsTaken(roomname.room, arrivalDate, duration);

        if (!isTaken) {
            const option = document.createElement("option");
            option.value = roomname.room;
            option.textContent = roomname.room;
            elementRoom.appendChild(option);
            console.log("Added room:", roomname.room);
        }
    }
}

async function updateCustomerDropdown() {
    fetch('../../data/info.json')
    .then(response => response.json())
    .then(info => {
            populateRoomNumberDropdown(info.rooms)
            console.log('function ran')
        })
}

document.getElementById('arrival').addEventListener("change",  async function() {
    console.log('asdfasf')
    await updateCustomerDropdown()
})

updateCustomerDropdown()