const express = require('express')
const app = express()


// Importamos las rutas del usuario
app.use( require('./usuario') );
// Importamos las rutas del login
app.use( require('./login'));
// Importamos las rutas de categoria
app.use(require('./categoria'));
// Importamos las rutas de productos
app.use(require('./producto'));


module.exports = app;