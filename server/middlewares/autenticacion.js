const jwt = require('jsonwebtoken');

// ===========================
// Verificar token
// ===========================

let verificaToken = (req, res, next)=>{
    // Obtenemos el token que es enviado en los headers
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Token no valido.'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// ===========================
// Verificar Admin role
// ===========================

let verificaAdminRole = (req, res, next)=>{
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message: 'El usuario no es administrador.'
            }
        }); 
    }
    // console.log(usuario);
}


module.exports = {
    verificaToken,
    verificaAdminRole
}