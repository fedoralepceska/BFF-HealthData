exports.patient = (data) => {
    let response = {};

    data.results.forEach(patient => {
        response = {
            id: patient.id,
            fullName: `${patient.name}  ${patient.surname}`,
            year: patient.year
        }
    });
    
    return response;
}