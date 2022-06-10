const connection = require('../db/db');

const getHabitaciones = (callback)=>{
    connection.query('SELECT * FROM Habitacion', (error, results, fields)=>{
        if (error) throw error;
        callback(results);
    });
}

const insertHabitacion = (habitacion,callback)=>{
    const {Habitacion} = habitacion;
    connection.query('INSERT INTO Habitacion SET Habitacion=?',[Habitacion],(error, results, fields)=>{
        if(error){
            callback(-1,error.code);
        }else{
            callback(`Added ${results.affectedRows} rows`);
        }
    });
};

const getHabitacionbyId = (idHab,callback)=>{
    connection.query('SELECT * FROM Habitacion where Id_Habitacion=?',idHab,(error, results, fields)=>{
        if (error) throw error;
        callback(results[0]);
    });
};

const updateHabitacion = (habitacion,idHab,callback)=>{
    const {Habitacion} = habitacion;
    connection.query('UPDATE Habitacion SET Habitacion=? WHERE Id_Habitacion=?',[Habitacion,idHab],(error, results, fields)=>{
        if (error) throw error;
        callback(`Updated ${results.affectedRows} rows`);
    });
};

const deleteHabitacion = (idHab,callback)=>{
    connection.query('DELETE FROM Habitacion WHERE Id_Habitacion=?',idHab,(error, results, fields)=>{
        if (error) throw error;
        callback(`Deleted ${results.affectedRows} rows`);
    })
};

module.exports = {
    getHabitaciones,
    insertHabitacion,
    getHabitacionbyId,
    updateHabitacion,
    deleteHabitacion
}