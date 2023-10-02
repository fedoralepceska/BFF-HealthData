const express = require('express');
const router = express.Router();
const doctors = require('./data/doctors.json');

router.delete('/:id', (req, res) => {
    const doctorIdToDelete = req.params.id;

    // Find the index of the patient to delete in the patients array
    const doctorIndex = doctors.findIndex((doctor) => doctor.id === parseInt(doctorIdToDelete));

    if (doctorIndex !== -1) {
        // Remove the patient from the array
        doctors.splice(doctorIndex, 1);

        // Write the updated data back to the patients.json file (similar to your existing code)
        // ...

        res.status(200).json({ message: 'Patient deleted successfully' });
    } else {
        res.status(404).json({ message: 'Patient not found' });
    }
});

module.exports = router;
