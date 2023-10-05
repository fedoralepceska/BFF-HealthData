var http = require('http');
const express = require('express');
const cors = require('cors')
const routes = require('./src/routes');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/healthdata', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const server = http.createServer(app);

app.use(cors());

routes.init(app);

server.listen(3003);