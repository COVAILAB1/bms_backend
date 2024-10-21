const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://covailabs1:KRISHtec%405747@bmsdashboard.upate.mongodb.net/?retryWrites=true&w=majority&appName=bmsdashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define the Protection Status schema
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

// Define the Cells schema
const cellSchema = new mongoose.Schema({
    Voltage: Number,
    Cell_no: Number
});

// Define the BMS data schema
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

// Create the BMS model
const BMS = mongoose.model('BMS', bmsSchema);

// Define the endpoint to retrieve the most recent data and send it to the frontend
app.get('/api/data', async (req, res) => {
    try {
        // Retrieve the most recent data from the 'bmsdatas' collection
        const recentBmsData = await BMS.findOne().sort({ receivedAt: -1 });

        // Send the recent data to the frontend or another service
        const endpointUrl = 'http://192.168.1.37/your-data-endpoint'; // replace with your actual endpoint URL
        await axios.post(endpointUrl, recentBmsData);

        // Send the response to the client
        res.status(200).json(recentBmsData);
    } catch (error) {
        console.error('Error retrieving or sending data:', error);
        res.status(500).json({ message: 'Error retrieving data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


