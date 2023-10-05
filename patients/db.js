const mongoose = require('mongoose');

// Connect to the "patientsDB" database
mongoose.connect('mongodb://localhost/patientsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Export the mongoose connection
module.exports = mongoose.connection;
