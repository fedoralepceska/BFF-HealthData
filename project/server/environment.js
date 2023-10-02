exports.BASE_URL = 'http://localhost:3003';
exports.PATIENTS_SERVICE = 'http://localhost:3002';
exports.DOCTORS_SERVICE = 'http://localhost:3001';

exports.services = {
    PATIENTS: `${this.BASE_URL}/patients`,
    DOCTORS: `${this.BASE_URL}/doctors`,
}