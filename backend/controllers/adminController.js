const connection = require('../db/db');

const getAdminbyId = (idAdmin,callback)=>{
    connection.query('SELECT * FROM Admin where Id_Administrador=?',idAdmin,(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};

const getAdminbyEmail = (email,callback)=>{
    connection.query('SELECT * FROM Admin where Correo=?',email,(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};

const getDocNum = (callback)=>{
    connection.query('SELECT count(*) as docNum FROM Doctor',(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};

const getPacNum = (callback)=>{
    connection.query('SELECT count(*) as pacNum FROM Paciente',(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};

const getAdmNum = (callback)=>{
    connection.query('SELECT count(*) as admNum FROM Admin',(error, results, fields)=>{
        if (error) throw error;
        if(results.length>0)
            callback(results[0]);
        else    
            callback(-1);
    });
};
module.exports = {
    getAdminbyId,
    getAdminbyEmail,
    getAdmNum,
    getDocNum,
    getPacNum
}