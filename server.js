// import express from 'express';
// import CORS from 'cors';

// const app = express();
// const port = 3000;  // Port on which the server will run

// app.use(CORS());
// // Middleware to parse JSON bodies
// app.use(express.json());

// // CORS Middleware
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// // Store the last received data from ESP32
// let bmsData = {};

// // Endpoint to receive data from ESP32
// app.post('/data', (req, res) => {
//     console.log('Data received from ESP32:', req.body);
    
//     // Store the data received from ESP32
//     bmsData = req.body;
    
//     // Respond back to the ESP32
//     res.json({ message: 'Data received successfully' });
// });

// // Endpoint to send data to React frontend
// app.get('/data', (req, res) => {
//     res.json(bmsData);  // Send the stored BMS data to the frontend
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

import express from 'express';
import CORS from 'cors';
import mongoose from 'mongoose';

// Create the Express app
const app = express();
const port = 3000;  // Port on which the server will run

// Middleware to parse JSON bodies
app.use(CORS());
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// MongoDB connection (replace <username>, <password>, and <dbname> with your MongoDB credentials)
const uri = 'mongodb+srv://covailabs1:KRISHtec%405747@bmsdashboard.upate.mongodb.net/?retryWrites=true&w=majority&appName=bmsdashboard';

// Connect to the MongoDB cluster
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for the Protection Status object
const protectionStatusSchema = new mongoose.Schema({
    Single_Cell_Overvoltage_Count: Number,
    Discharge_Over_Temperature_Count: Number,
    Whole_Pack_Undervoltage_Count: Number,
    Discharge_Overcurrent_Count: Number,
    Charging_Overcurrent_Count: Number,
    Software_Lock_MOS_Count: Number,
    Whole_Pack_Overvoltage_Count: Number,
    Discharge_Low_Temperature_Count: Number,
    Short_Circuit_Protection_Count: Number,
    Charging_Over_Temperature_Count: Number,
    Charging_Low_Temperature_Count: Number,
    Front_end_Detection_IC_Error_Count: Number,
    Single_Cell_Undervoltage_Count: Number
});

// Define a schema for the Cells array
const cellSchema = new mongoose.Schema({
    Voltage: Number,
    Cell_no: Number
});

// Define a schema for BMS data
const bmsSchema = new mongoose.Schema({
    Watts: Number,
    Software_Version: Number,
    Total_Voltage: Number,
    Mosfet_Status: String,
    Balance_Current_mA: Number,
    Temperature_Sensor_2: Number,
    Temperature_Sensor_1: Number,
    Amps: Number,
    Mosfet_Discharge: String,
    Mosfet_Charge: String,
    Capacity_Remaining_Ah: Number,
    Remaining_Capacity_Ah: Number,
    Balance_Code_Low: String,
    Full_Charge_Capacity_Ah: Number,
    Nominal_Capacity_Ah: Number,
    Protection_Status: protectionStatusSchema,
    Humidity: Number,
    Cells: [cellSchema],
    Balance_Current: Number,
    Cycle_Count: Number,
    Capacity_Remaining_Wh: Number,
    Capacity_Remaining_Percent: Number,
    Remaining_Capacity: Number,
    receivedAt: { type: Date, default: Date.now }
});

// Create a model from the schema
const BmsData = mongoose.model('BmsData', bmsSchema);

// Store the last received data from ESP32
let bmsData = {};

// Endpoint to receive data from ESP32 and save it to MongoDB
app.post('/data', async (req, res) => {
    console.log('Data received from ESP32:', req.body);

    // Store the data received from ESP32
    bmsData = req.body;

    try {
        // Add timestamp and save the data to MongoDB
        const newData = new BmsData(bmsData);
        await newData.save();
        console.log('Data saved to MongoDB');

        // Respond back to the ESP32
        res.json({ message: 'Data received and stored successfully' });
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        res.status(500).json({ message: 'Error storing data' });
    }
});

// Endpoint to send data to React frontend
app.get('/data', (req, res) => {
    res.json(bmsData);  // Send the stored BMS data to the frontend
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
