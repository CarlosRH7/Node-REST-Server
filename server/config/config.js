// ===============
// Puerto, se configura el puerto para local y en producción
// ===============
process.env.PORT = process.env.PORT || 3000

// ===============
// Base de datos, se configura la conexión para local y en producción
// ===============

//Entorno 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URL;
}

// creamos la variable URLDB de manera global
process.env.URLDB = urlDB;




