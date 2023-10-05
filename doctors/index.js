const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const Doctor = require('./models/Doctor'); // Import the patient model
const db = require('./db');

app.use(express.json());


app.get('/doctors', async (req, res) => {
  try {
    // Use the "Doctor" model to query the "patients" collection in the "doctorsDB" database
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/doctors/:id', async (req, res) => {
  try {
    const patientIdToDelete = req.params.id;

    // Use the "Doctor" model to find the doctor by ID and remove it
    const deletedDoctor = await Doctor.findByIdAndRemove(doctorIdToDelete);

    if (!deletedDoctor) {
      // If the doctor with the provided ID does not exist, return a 404 Not Found response
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = http.createServer(app);
server.listen(3001);