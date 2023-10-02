const axios = require('axios');
const patientsAdapter = require('../adapter/patients');
const doctorsAdapter = require('../adapter/doctors');
const path = require('../../environment');

exports.get = (req, res, next) => {
    const patientsService =  axios.get(path.services.PATIENTS);
    const doctorsService = axios.get(path.services.DOCTORS);

    Promise.all([patientsService, doctorsService]).then(
        ([patients, doctors]) => res.json({
            patients: patientsAdapter.patient(patients.data),
            doctors: doctorsAdapter.doctors(doctors.data)
        })
    );
}