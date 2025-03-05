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

app.post("/edit-customer", (req, res) => {
    const updatedCustomer = req.body;

    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data file" });
        }

        let jsonData = JSON.parse(data);

        const customerIndex = jsonData.customers.findIndex(c => c.id === updatedCustomer.id);
        if (customerIndex === -1) {
            return res.status(404).json({ error: "Customer not found" });
        }

        jsonData.customers[customerIndex] = updatedCustomer;

        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error writing data file" });
            }
            res.json({ success: true, message: "Customer updated successfully!", updatedCustomer });
        });
    });
});

app.post("/delete-customer", (req, res) => {
    const { id } = req.body;

    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data file" });
        }

        let jsonData = JSON.parse(data);

        jsonData.customers = jsonData.customers.filter(c => c.id !== id);

        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error writing data file" });
            }
            res.json({ success: true, message: "Customer deleted successfully!" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})