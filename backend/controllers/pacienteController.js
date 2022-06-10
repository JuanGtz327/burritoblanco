const connection = require('../db/db');

const getPacientes = (callback)=>{
    connection.query('SELECT * FROM Paciente', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const getPacientesAdmin = (callback)=>{
    connection.query('SELECT p.Id_Paciente,p.Id_Doctor,p.Id_Habitacion,p.Edad,p.Nombre,p.ApellidoP,p.ApellidoM,p.Genero,p.Correo,p.Domicilio,d.nombre,h.Habitacion FROM Paciente p JOIN Habitacion h, Doctor d where p.Id_Habitacion=h.Id_Habitacion and p.Id_Doctor=d.Id_Doctor;', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const getPacientesByIdDoc = (idDoc,callback)=>{
    connection.query('SELECT * FROM Paciente where Id_Doctor=?',idDoc, (error, results, fields)=>{
        if (error) throw error;
        callback(results);
        
    });
}

const getPacienteByEmail= (email,callback)=>{
    connection.query('SELECT * FROM Paciente where Correo=?',email, (error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
}

const insertPaciente = (paciente,callback)=>{
    const {idDoc,idHab,Edad,Nombre,ApellidoM,ApellidoP,Genero,Correo,Domicilio,Password} = paciente;
    connection.query('INSERT INTO Paciente SET Id_Doctor=?,Id_Habitacion=?,Edad=?,Nombre=?,ApellidoM=?,ApellidoP=?,Genero=?,Correo=?,Domicilio=?,Password=?',[idDoc,idHab,Edad,Nombre,ApellidoM,ApellidoP,Genero,Correo,Domicilio,Password],(error, results, fields)=>{
        if(error){
            callback(-1,error.code);
        }else{
            callback(`Added ${results.affectedRows} rows`);
        }
    });
};

const getPacientebyId = (idPaciente,callback)=>{
    connection.query('SELECT * FROM Paciente where Id_Paciente=?',idPaciente,(error, results, fields)=>{
        if (error) throw error;
        callback(results[0]);
    });
};

const updatePaciente = (paciente,idPaciente,callback)=>{
    const {idDoc,idHab,Edad,Nombre,ApellidoM,ApellidoP,Genero,Correo,Domicilio} = paciente;
    connection.query('UPDATE Paciente SET Id_Doctor=?,Id_Habitacion=?,Edad=?,Nombre=?,ApellidoM=?,ApellidoP=?,Genero=?,Correo=?,Domicilio=? WHERE Id_Paciente=?',[idDoc,idHab,Edad,Nombre,ApellidoM,ApellidoP,Genero,Correo,Domicilio,idPaciente],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const updatePacienteWithPass = (paciente,pass,idPaciente,callback)=>{
    const {idDoc,idHab,Edad,Nombre,ApellidoM,ApellidoP,Genero,Correo,Domicilio} = paciente;
    connection.query('UPDATE Paciente SET Id_Doctor=?,Id_Habitacion=?,Edad=?,Nombre=?,ApellidoM=?,ApellidoP=?,Genero=?,Correo=?,Domicilio=?,Password=? WHERE Id_Paciente=?',[idDoc,idHab,Edad,Nombre,ApellidoM,ApellidoP,Genero,Correo,Domicilio,pass,idPaciente],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const deletePaciente = (idPaciente,callback)=>{
    connection.query('DELETE FROM Paciente WHERE Id_Paciente=?',idPaciente,(error, results, fields)=>{
        if (error) throw error;
        callback(`Deleted ${results.affectedRows} rows`);
    })
};

module.exports = {
    getPacientes,
    insertPaciente,
    getPacientebyId,
    updatePaciente,
    deletePaciente,
    getPacientesByIdDoc,
    getPacienteByEmail,
    updatePacienteWithPass,
    getPacientesAdmin
}