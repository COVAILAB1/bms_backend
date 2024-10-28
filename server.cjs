const express = require("express");
const cors = require("cors"); // Import CORS middleware
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// MongoDB connection string
const uri = "mongodb+srv://covailabs1:KRISHtec%405747@bmsdashboard.upate.mongodb.net/?retryWrites=true&w=majority&appName=bmsdashboard";

async function getRecentData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const database = client.db("test");
    const collection = database.collection("bmsdatas");

    // Retrieve the most recent document with specific fields
    const recentData = await collection
      .find({}, {
        projection: {
          _id: 1,
          Watts: 1,
          Software_Version: 1,
          Total_Voltage: 1,
          Mosfet_Status: 1,
          Balance_Current_mA: 1,
          Temperature_Sensor_1: 1,
          Temperature_Sensor_2: 1,
          Amps: 1,
          Mosfet_Discharge: 1,
          Mosfet_Charge: 1,
          Capacity_Remaining_Ah: 1,
          Remaining_Capacity_Ah: 1,
          Balance_Code_Low: 1,
          Full_Charge_Capacity_Ah: 1,
          Nominal_Capacity_Ah: 1,
          Protection_Status: 1,
          Humidity: 1,
          Cells: 1,
          Balance_Current: 1,
          Cycle_Count: 1,
          Capacity_Remaining_Wh: 1,
          Capacity_Remaining_Percent: 1,
          Remaining_Capacity: 1,
          receivedAt: 1
        }
      })
      .sort({ _id: -1 }) // Sort by _id in descending order
      .limit(1)
      .toArray();
    return recentData[0]; // Return only the first document object
  } catch (error) {
    console.error("Error retrieving data from MongoDB Atlas:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// API endpoint to get recent BMS data
app.get("/data", async (req, res) => {
  try {
    const data = await getRecentData();
    res.json(data); // Send the data as JSON response
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
