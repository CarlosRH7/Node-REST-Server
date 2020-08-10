// =============================
// Puerto, se configura el puerto para local y en producción
// =============================
process.env.PORT = process.env.PORT || 3000


// =============================
// Base de datos, se configura la conexión para local y en producción
// =============================
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


// =============================
// Vencimiento del token
// =============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';

// =============================
// SEED de autenticación
// =============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



// =============================
// Google Cliend ID, para el login
// =============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '226251464091-r2nggv9unbr62sbgesg25aou091bju9v.apps.googleusercontent.com';