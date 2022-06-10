const mySQL = require('mysql');
const connection = mySQL.createConnection(process.env.DATABASE_URL);

/*
const connection = mySQL.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'burrito_blanco'
});
*/

connection.connect(err=>{
    if (err) {
      console.error('Error al conectar' + err.stack);
      return;
    }   
    console.log('DB conectada');
});

module.exports = connection;