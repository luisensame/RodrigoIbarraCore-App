var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usuarioStaffSchema = new Schema({
    nombre: {type: String, required: [true, 'nombre requerido']},
    email: {type: String, required: [true, 'email requerido'], index: {unique: true}},
    password: {type: String, required: [true, 'Password requerido']}
});
module.exports = mongoose.model('usuario_staff', usuarioStaffSchema, 'usuario_staff');