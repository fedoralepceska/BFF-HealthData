var http = require('http');
const express = require('express');
const fs = require("fs");
const path = require("path");

const app = express();

const patientsDataPath = path.join(__dirname, 'data', 'patients.json');
const patients = JSON.parse(fs.readFileSync(patientsDataPath, 'utf8'));

app.get('/patients', function(req, res, next) {
  res.json(patients);
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