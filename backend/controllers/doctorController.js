const connection = require('../db/db');

const insertDoctor = (doctor,callback)=>{
    const {Nombre,ApellidoM,ApellidoP,Especialidad,Consultorio,Correo,Password} = doctor;
    connection.query('INSERT INTO Doctor SET Nombre=?,ApellidoM=?,ApellidoP=?,Especialidad=?,Consultorio=?,Correo=?,Password=?',[Nombre,ApellidoM,ApellidoP,Especialidad,Consultorio,Correo,Password],(error, results, fields)=>{
        if(error){
            console.log(error.message);
            callback(-1,error.code);
        }else{
            callback(`Added ${results.affectedRows} rows`);
        }
    });
};

const getDoctors = (callback)=>{
    connection.query('SELECT * FROM Doctor', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
};

const getDoctorbyId = (idDoctor,callback)=>{
    connection.query('SELECT * FROM Doctor where Id_Doctor=?',idDoctor,(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};

const getDoctorbyEmail = (email,callback)=>{
    connection.query('SELECT * FROM Doctor where Correo=?',email,(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};

const updateDoctor = (doctor,idDoctor,callback)=>{
    const {Nombre,ApellidoM,ApellidoP,Especialidad,Consultorio,Correo} = doctor;
    connection.query('UPDATE Doctor SET Nombre=?,ApellidoM=?,ApellidoP=?,Especialidad=?,Consultorio=?,Correo=? WHERE Id_Doctor=?',[Nombre,ApellidoM,ApellidoP,Especialidad,Consultorio,Correo,idDoctor],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const updateDoctorWithPass = (doctor,pass,idDoctor,callback)=>{
    const {Nombre,ApellidoM,ApellidoP,Especialidad,Consultorio,Correo} = doctor;
    connection.query('UPDATE Doctor SET Nombre=?,ApellidoM=?,ApellidoP=?,Especialidad=?,Consultorio=?,Correo=?,Password=? WHERE Id_Doctor=?',[Nombre,ApellidoM,ApellidoP,Especialidad,Consultorio,Correo,pass,idDoctor],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const deleteDoctor = (idDoctor,callback)=>{
    
    connection.query('DELETE FROM Doctor WHERE Id_Doctor=?',idDoctor,(error, results, fields)=>{
        if (error) throw error;
        callback(`Deleted ${results.affectedRows} rows`);
    })
};

module.exports = {
    insertDoctor,
    getDoctors,
    getDoctorbyId,
    updateDoctor,
    deleteDoctor,
    getDoctorbyEmail,
    updateDoctorWithPass
}