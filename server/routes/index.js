const express = require('express')
const app = express()


// importamos las rutas del usuario
app.use( require('./usuario') );
// Importamos las rutas del login
app.use( require('./login'));


module.exports = app;