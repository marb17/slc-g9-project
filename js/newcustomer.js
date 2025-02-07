document.getElementById("customer-form").addEventListener("submit", function(event) {
    event.preventDefault()

    const customerData = {
        "id": Date.now().toString(),
        "name": document.getElementById('name').value,
        "room": document.getElementById('room').value,
        "date": document.getElementById('arrival').value,
        "email": document.getElementById('email').value,
        "payment": document.getElementById('payment').value,
        "duration": document.getElementById('duration').value
    }

    fetch("http://localhost:3000/add-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").textContent = data.message
        window.location.href = "html/customers/customers.html"
    })
    .catch(error => {
        console.error("Error:", error)
        document.getElementById("message").textContent = "Failed to add customer"
    })
})


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