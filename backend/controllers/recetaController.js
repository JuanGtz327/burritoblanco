const connection = require('../db/db');

const getRecetas = (callback)=>{
    connection.query('SELECT * FROM Receta', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const getRecetasAdmin = (callback)=>{
    connection.query('SELECT r.Id_Receta,r.Descripcion,d.nombre,p.Nombre FROM Receta r JOIN Paciente p, Doctor d, Cita c where c.Id_Cita=r.Id_Cita and c.Id_Doctor=d.Id_Doctor and c.Id_Paciente=p.Id_Paciente;', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const getRecetasDoc = (idDoc,callback)=>{
    connection.query('SELECT r.Id_Receta,r.Descripcion,p.Nombre FROM Receta r JOIN Paciente p, Doctor d, Cita c where c.Id_Cita=r.Id_Cita and c.Id_Doctor=d.Id_Doctor and c.Id_Paciente=p.Id_Paciente and d.Id_Doctor=?',idDoc, (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const getRecetasbyIdDoc = (idDoc,callback)=>{
    connection.query("SELECT r.Id_Receta,c.Id_Doctor,c.Id_Cita,r.Descripcion FROM Receta r JOIN Cita c where r.Id_Cita=c.Id_Cita and c.Id_Doctor=?",idDoc, (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const getRecetasbyIdPac = (idPac,callback)=>{
    connection.query("SELECT r.Id_Receta,r.Descripcion,d.nombre FROM Receta r JOIN Cita c, Doctor d, Paciente p where r.Id_Cita=c.Id_Cita and c.Id_Doctor=d.Id_Doctor and c.id_Paciente=p.Id_Paciente and p.Id_Paciente=?",idPac, (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const insertReceta = (receta,callback)=>{
    const {idCita,Descripcion} = receta;
    connection.query('INSERT INTO Receta SET Id_Cita=?,Descripcion=?',[idCita,Descripcion],(error, results, fields)=>{
        if(error){
            callback(-1,error.code);
        }else{
            callback(`Added ${results.affectedRows} rows`);
        }
    });
};

const getRecetabyId = (idRec,callback)=>{
    connection.query('SELECT * FROM Receta where Id_Receta=?',idRec,(error, results, fields)=>{
        if (error) throw error;
        callback(results[0]);
    });
};

const updateReceta = (receta,idRec,callback)=>{
    const {idCita,Descripcion} = receta;
    connection.query('UPDATE Receta SET Id_Cita=?,Descripcion=? WHERE Id_Receta=?',[idCita,Descripcion,idRec],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const deleteReceta = (idRec,callback)=>{
    connection.query('DELETE FROM Receta WHERE Id_Receta=?',idRec,(error, results, fields)=>{
        if (error) throw error;
        callback(`Deleted ${results.affectedRows} rows`);
    })
};

module.exports = {
    getRecetas,
    insertReceta,
    getRecetabyId,
    updateReceta,
    deleteReceta,
    getRecetasbyIdDoc,
    getRecetasbyIdPac,
    getRecetasAdmin,
    getRecetasDoc
}