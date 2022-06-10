const connection = require('../db/db');

const insertCita = (cita,callback)=>{
    const {Fecha,Descripcion,idDoc,idPac} = cita;
    connection.query('INSERT INTO Cita SET Fecha=?,Descripcion=?,Id_Doctor=?,Id_Paciente=?',[Fecha,Descripcion,idDoc,idPac],(error, results, fields)=>{
        if(error){
            callback(-1,error.code);
        }else{
            callback(`Added ${results.affectedRows} rows`);
        }
    });
};

const getCitas = (callback)=>{
    connection.query('SELECT * FROM Cita', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
};

const getCitasAdmin = (callback)=>{
    connection.query('SELECT c.Id_Cita,c.Id_Doctor,c.Id_Paciente,c.Fecha,c.Descripcion,d.nombre,p.Nombre FROM Cita c JOIN Paciente p, Doctor d where c.Id_Paciente=p.Id_Paciente and c.Id_Doctor=d.Id_Doctor', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
};

const getCitasDoc = (idDoc,callback)=>{
    connection.query('SELECT c.Id_Cita,c.Id_Doctor,c.Id_Paciente,c.Fecha,c.Descripcion,p.Nombre FROM Cita c JOIN Paciente p, Doctor d where c.Id_Paciente=p.Id_Paciente and c.Id_Doctor=d.Id_Doctor and d.Id_Doctor=?',idDoc,(error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
};

const getCitasbyIdDoc = (idDoc,callback)=>{
    connection.query('SELECT * FROM Cita where Id_Doctor=?',idDoc, (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
};

const getCitasbyIdPac = (idPac,callback)=>{
    connection.query('SELECT c.Id_Cita,c.Fecha,c.Descripcion,d.nombre FROM Cita c JOIN Paciente p, Doctor d where c.Id_Paciente=p.Id_Paciente and c.Id_Doctor=d.Id_Doctor and p.Id_Paciente=?',idPac, (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
};

const getCitabyId = (idCita,callback)=>{
    connection.query('SELECT * FROM Cita where Id_Cita=?',idCita,(error, results, fields)=>{
        if (error) throw error;
        callback(results[0]);
    });
};

const updateCita = (cita,idCita,callback)=>{
    const {Fecha,Descripcion,idDoc,idPac} = cita;
    connection.query('UPDATE Cita SET Fecha=?,Descripcion=?,Id_Doctor=?,Id_Paciente=? WHERE Id_Cita=?',[Fecha,Descripcion,idDoc,idPac,idCita],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const deleteCita = (idCita,callback)=>{
    connection.query('DELETE FROM Cita WHERE Id_Cita=?',idCita,(error, results, fields)=>{
        if (error) throw error;
        callback(`Deleted ${results.affectedRows} rows`);
    })
};

module.exports = {
    getCitas,
    insertCita,
    getCitabyId,
    updateCita,
    deleteCita,
    getCitasbyIdDoc,
    getCitasbyIdPac,
    getCitasAdmin,
    getCitasDoc
}