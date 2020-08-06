const mongoose = require('mongoose');

// Importamos el paquete mongoose-unique-validator para validar campos en este caso el email y rol
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol válido.'

}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        
    },
    password:{
        type: String,
        required: [true, 'El password es necesario']
    },
    img:{
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum:  rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Retornar el registro pero sin el password
usuarioSchema.methods.toJSON = function() {
    let user =  this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// Agregamos el plugin mongoose-unique-validator a usuarioSchema
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único.'});

module.exports = mongoose.model('usuario', usuarioSchema);