const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import cors

const app = express();

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Your existing routes
// ...

// Endpoint to get current data
app.get('/data.json', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a new customer
app.post('/add-customer', (req, res) => {
    const newCustomer = req.body;
    
    const filePath = path.join(__dirname, 'data.json');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading data' });
            return;
        }

        const jsonData = JSON.parse(data);
        const newId = Object.keys(jsonData.customers).length + 1;
        jsonData.customers[newId] = newCustomer;

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).json({ message: 'Error saving data' });
                return;
            }
            res.json({ message: 'Customer added successfully' });
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`test: Server is running on http://localhost:${PORT}`);
});
