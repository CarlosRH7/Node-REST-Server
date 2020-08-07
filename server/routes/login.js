const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
// importamos paqutes de google para la auntenticaciín
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

// Configuraciones de Google

// Verificación del token
async function verify(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async (req, res)=>{
    let token = req.body.idtoken;

    // Validamos el token
    let googleUser = await verify(token)
    .catch(err => {
        return res.status(403).json({
            ok:false,
            err
        });
    });

    // Verificamos si el usuario existe en la base de datos
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        // Si existe el usuario en la DB
        if(usuarioDB) {
            // si el usuario es de google
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Debe de usar su autenticación normal.'
                    }
                });
            }else{
                // si el usuario si se autentico con google
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            // si el usuario es la primera vez que se autentica con google
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.password = ':)';

            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    })
   

});

module.exports = app;