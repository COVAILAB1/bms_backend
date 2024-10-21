import express from 'express';
import CORS from 'cors';

const app = express();
const port = 3000;  // Port on which the server will run

app.use(CORS());
// Middleware to parse JSON bodies
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Store the last received data from ESP32
let bmsData = {};

// Endpoint to receive data from ESP32
app.post('/data', (req, res) => {
    console.log('Data received from ESP32:', req.body);
    
    // Store the data received from ESP32
    bmsData = req.body;
    
    // Respond back to the ESP32
    res.json({ message: 'Data received successfully' });
});

// Endpoint to send data to React frontend
app.get('/data', (req, res) => {
    res.json(bmsData);  // Send the stored BMS data to the frontend
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});