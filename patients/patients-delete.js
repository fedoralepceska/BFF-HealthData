const express = require('express');
const router = express.Router();
const patients = require('./data/patients.json');

router.delete('/:id', (req, res) => {
    const patientIdToDelete = req.params.id;

    // Find the index of the patient to delete in the patients array
    const patientIndex = patients.findIndex((patient) => patient.id === parseInt(patientIdToDelete));

    if (patientIndex !== -1) {
        // Remove the patient from the array
        patients.splice(patientIndex, 1);

        // Write the updated data back to the patients.json file (similar to your existing code)
        // ...

        res.status(200).json({ message: 'Patient deleted successfully' });
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
});

module.exports = router;
