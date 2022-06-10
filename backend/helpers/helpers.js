const jwt = require("jsonwebtoken");

const getParsedDate = (date) => {
    for (let i = 0; i < date.length; i++) {
        if (date[i] == 'T') {
            if (date[i - 1] == 'M') {
                if (date[i - 2] == 'G') {
                    return date.substring(3, i - 6);
                }
            }
        }
    }
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

const validDate = (fecha,) => {
    let date = new Date();
    let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    let hours = process.env.ENVIROMENT == 'develop' ? date.getHours() : date.getHours() - 5;
    if (fecha.split("T")[0].split('-')[1] > String(date.getMonth() + 1).padStart(2, '0')) {
        return 0;
    } else if (fecha.split("T")[0].split('-')[1] == String(date.getMonth() + 1).padStart(2, '0')) {
        if (fecha.split("T")[0].split('-')[2] > String(date.getDate()).padStart(2, '0')) {
            return 0;
        } else if (fecha.split("T")[0].split('-')[2] == String(date.getDate()).padStart(2, '0')) {
            if (fecha.split("T")[1].split(":")[0] > hours) {
                return 0;
            } else if (fecha.split("T")[1].split(":")[0] == hours) {
                if (fecha.split("T")[1].split(":")[1] >= date.getMinutes()) {
                    return 0;
                } else {
                    return 'Minutos no validos';
                }
            } else {
                return 'Hora no valida';
            }
        } else {
            return 'Dia no valido';
        }
    } else if (fecha.split("T")[0] < output) {
        return 'Mes no valido';
    }
}

module.exports = {
    getParsedDate,
    generateToken,
    validDate
}