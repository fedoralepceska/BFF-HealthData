const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    id: Number,
    name: String,
    surname: String,
    year: Number,
});

module.exports = mongoose.model('Patient', patientSchema);
