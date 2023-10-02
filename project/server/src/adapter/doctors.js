const utils = require ('../utils');

exports.doctors = (data) => {
    let response = [];

    data.results.forEach(doctor => {
        response.push({
            id: doctor.id,
            fullName: `${doctor.name}  ${doctor.surname}`,
            phone: utils.formatPhone(doctor.phone),
            gender: doctor.gender,
            email: doctor.email,
        });
    });
    
    return response;
}