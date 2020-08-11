const  express = require('express');
let app = express();
const fs = require('fs');
const path = require('path');
const {verificaTokenImg} = require('../middlewares/autenticacion')



app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res)=>{

    let tipo = req.params.tipo;
    let img =  req.params.img;



    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/not-found.png');
        res.sendfile(noImagePath);
    }

    
    
})



module.exports = app;