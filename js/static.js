fetch('../data/info.json')
    .then(response => response.json())
    .then(info => {
        const hotelName = info.name;
        const avarooms = info.maxrooms - (info.customers).length; /*replace*/

        document.getElementById('hotel-name').textContent = hotelName
        document.getElementById('avaliable-rooms').textContent = avarooms /*replace*/
    })