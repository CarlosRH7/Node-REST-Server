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
    urlDB = 'mongodb+srv://cafeApp:FyC45VZJoBE9J6gr@cluster0-5xitk.mongodb.net/cafe';
}

// creamos la variable URLDB de manera global
process.env.URLDB = urlDB;




