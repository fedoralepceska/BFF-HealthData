const httpProxy = require('express-http-proxy');
const path = require('../environment');

const patientsDoctorsService = require('./service/patientsDoctors');
const patientsDeleteRoutes = require('../../../patients/patients-delete');
const doctorsDeleteRoutes = require('../../../doctors/doctors-delete');

exports.init = (app) => {
    
    const patientServiceProxy = httpProxy(path.PATIENTS_SERVICE);
    const doctorsServiceProxy = httpProxy(path.DOCTORS_SERVICE);

    app.get('/patients', (req, res, next) => {
        patientServiceProxy(req, res, next);
    });

    app.delete('/doctors/:id', (req, res, next) => {
        doctorsServiceProxy(req, res, next);
    });

    app.delete('/patients/:id', (req, res, next) => {
        patientServiceProxy(req, res, next);
    });

    app.get('/doctors', (req, res, next) => {
        doctorsServiceProxy(req, res, next);
    });
    
    app.get('/patientsDoctors', (req, res, next) => {
        patientsDoctorsService.get(req, res, next);
    });
}