fetch('../../data/info.json')
    .then(response => response.json())
    .then(info => {
        const hotelName = info.name;
        const avarooms = info.maxrooms - (info.customers).length; /*replace*/

        document.getElementById('hotel-name').textContent = hotelName
        try {
            document.getElementById('avaliable-rooms').textContent = avarooms /*replace*/
        } catch (error) {
            console.log("its a different page dw")   
        }

        /*table population*/
        function populateTable(data) {
            const tableBody = document.querySelector("#customer-table")
            
            data.forEach(rowdata => {
                const row = document.createElement("tr")
                
                Object.values(rowdata).forEach(value => {
                    const cell = document.createElement("td")
                    cell.textContent = value
                    row.appendChild(cell)
                });
                tableBody.appendChild(row)
            });
        }
        
        populateTable(info.customers)
    })