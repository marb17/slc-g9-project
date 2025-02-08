// function addDays(date, days) {
//     const result = new Date(date)
//     result.setDate(result.getDate() + days)
//     return result
// }
function checkIfDateIsBetween(date, days) {
    const arrivalDate = new Date(date); // Convert string to Date
    const EndDate = new Date(arrivalDate); // Copy the arrival date
    EndDate.setUTCDate(arrivalDate.getUTCDate() + days); // Add the duration in days

    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set to midnight to ignore time during comparison

    arrivalDate.setHours(0, 0, 0, 0); // Set to midnight
    EndDate.setHours(0, 0, 0, 0); // Set to midnight

    // console.log("Today: ", today); // Debugging
    // console.log("Arrival Date: ", arrivalDate); // Debugging
    // console.log("End Date: ", EndDate); // Debugging

    // Check if today is between the arrival and end date
    if (today >= arrivalDate && today <= EndDate) {
        console.log("Customer is within the stay period");
        return true;
    }

    console.log("Customer is not within the stay period");
    return false;
}

fetch('../../data/info.json')
    .then(response => response.json())
    .then(info => {
        const hotelName = info.name;
        // const avarooms = info.maxrooms - (info.customers).length; /*replace*/

        document.getElementById('hotel-name').textContent = hotelName
        
        // customers avaliable //
        var customers_avaliable = info.maxrooms
        var tot_customers = 0
        var revenue_month = 0
        
        try {
            // document.getElementById('avaliable-rooms').textContent = avarooms /*replace*/
            (info.customers).forEach(customer => {
                if (checkIfDateIsBetween(customer.date, Number(customer.duration))) {
                    customers_avaliable -= 1
                    tot_customers += 1
                    revenue_month += Number(customer.payment)
                }
            });
            
            document.getElementById('avaliable-rooms').textContent = customers_avaliable
            document.getElementById('total-customers').textContent = tot_customers
            document.getElementById('revenue-month').textContent = "Rp " + revenue_month
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