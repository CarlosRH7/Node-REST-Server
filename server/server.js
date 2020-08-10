require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const app = express()

// Incluimos el paquete path para poder renderizar nuestra vista html
const path = require('path');

// Incluimos el paquete body-parser
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// importamos todas las rutas que se encuantran en routes/index
app.use(require('./routes/index'));

// middleware express, para poder agregar una plantilla html desde la carpeta public
app.use(express.static( path.resolve(__dirname, '../public')));

// app.get('/', function (req, res) {
//   res.render('index', {
//   });
// })

// Connect DB
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
},(err)=>{
    if(err) throw err;

    console.log('Connect DB')
});

app.listen(process.env.PORT, ()=>{
   console.log('Escuchando puerto: ', process.env.PORT); 
})