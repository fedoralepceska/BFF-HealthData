const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    id: Number,
    name: String,
    surname: String,
    location: Object,
    gender: String,
    email: String,
    phone: String,
    cell: String
});

module.exports = mongoose.model('Doctor', doctorSchema);