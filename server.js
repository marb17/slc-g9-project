const cors = require('cors');
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data/info.json")

app.use(express.json())
app.use(cors())

app.post("/add-customer", (req, res) => {
    const newCustomer = req.body

    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data file"})
        }

        let jsonData = JSON.parse(data);

        if (!jsonData.customers) {
            jsonData.customers = []
        }

        jsonData.customers.push(newCustomer)

        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 4), (err) =>{
            if (err) {
                return res.status(500).json({ error: "Error writing data file" })
            }
            res.json({ message: "Customer added successfully!", newCustomer})
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http:localhost:${PORT}`)
})