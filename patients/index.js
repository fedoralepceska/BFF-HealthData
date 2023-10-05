var http = require('http');
const express = require('express');
const fs = require("fs");
const Patient = require('./models/Patient'); // Import the patient model
const db = require('./db');
const app = express();


app.get('/patients', async (req, res) => {
  try {
    // Use the "Patient" model to query the "patients" collection in the "patientsDB" database
    const patients = await Patient.find({});
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/patients/:id', async (req, res) => {
  try {
    const patientIdToDelete = req.params.id;

    // Use the "Patient" model to find the patient by ID and remove it
    const deletedPatient = await Patient.findByIdAndRemove(patientIdToDelete);

    if (!deletedPatient) {
      // If the patient with the provided ID does not exist, return a 404 Not Found response
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = http.createServer(app);
server.listen(3002);