const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


app.post('/login', (req, res)=>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o contraseña incorrecta.'
                }
            });
        }
        // Compara la contraseña
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o contraseña incorrecta.'
                }
            });
        }

        // Crear token con jwt
        // Expira en 30 dias { expiresIn: 60 * 60 * 24 * 30 });
        // {expiresIn: segundos * minutos * horas * dias}
        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });

    });
    
})



module.exports = app;