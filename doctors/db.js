const mongoose = require('mongoose');

// Connect to the "doctorsDB" database
mongoose.connect('mongodb://localhost/doctorsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Export the mongoose connection
module.exports = mongoose.connection;
