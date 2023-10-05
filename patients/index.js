var http = require('http');
const express = require('express');
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');
const Patient = require('./model'); // Import your Mongoose model


const app = express();

const patientsDataPath = path.join(__dirname, 'data', 'patients.json');
const patients = JSON.parse(fs.readFileSync(patientsDataPath, 'utf8'));

app.get('/patients', async function (req, res, next) {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.delete('/patients/:id', (req, res) => {
  const patientIdToDelete = req.params.id;

  // Find the index of the doctor to delete in the doctors array
  const patientIndex = patients.findIndex((patient) => patient.id.toString() === patientIdToDelete);

  if (patientIndex !== -1) {
    // Remove the doctor from the array
    patients.splice(patientIndex, 1);

    // Write the updated data back to the doctors.json file
    fs.writeFileSync(patientsDataPath, JSON.stringify(patients, null, 2));

    res.status(200).json({ message: 'patient deleted successfully' });
  } else {
    res.status(404).json({ message: 'patient not found' });
  }
});

const server = http.createServer(app);
server.listen(3002);