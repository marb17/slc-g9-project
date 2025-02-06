function getValues() {
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const duration = document.getElementById('duration').value
    const payment = document.getElementById('payment').value
    const date = document.getElementById('arrival').value
}

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