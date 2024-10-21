
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(cors());  // Enable CORS for cross-origin requests
  
  // MongoDB connection
  const uri = 'mongodb+srv://covailabs1:KRISHtec%405747@bmsdashboard.upate.mongodb.net/?retryWrites=true&w=majority&appName=bmsdashboard';
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));
  
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
  
  const BMS = mongoose.model('BMS', bmsSchema);
  
  // API route to get recent BMS data
  app.get('/data', async (req, res) => {
      try {
          const recentBMSData = await BMS.find().sort({ receivedAt: -1 }).limit(1);
          res.json(recentBMSData);
      } catch (error) {
          console.error('Error fetching BMS data:', error);
          res.status(500).json({ message: 'Error retrieving BMS data' });
      }
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
  