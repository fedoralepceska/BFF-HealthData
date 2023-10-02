const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const doctorsDataPath = path.join(__dirname, 'data', 'doctors.json');
const doctors = JSON.parse(fs.readFileSync(doctorsDataPath, 'utf8'));

app.get('/doctors', function(req, res, next) {
  // Simply send the response with doctors data
  res.json(doctors);
});

app.delete('/doctors/:id', (req, res) => {
  const doctorIdToDelete = req.params.id;

  // Find the index of the doctor to delete in the doctors array
  const doctorIndex = doctors.findIndex((doctor) => doctor.id.toString() === doctorIdToDelete);

  if (doctorIndex !== -1) {
    // Remove the doctor from the array
    doctors.splice(doctorIndex, 1);

    // Write the updated data back to the doctors.json file
    fs.writeFileSync(doctorsDataPath, JSON.stringify(doctors, null, 2));

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
});

const server = http.createServer(app);
server.listen(3001);