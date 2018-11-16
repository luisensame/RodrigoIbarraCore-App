var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var representanteSchema = new Schema({
    nombre: {type: String, required: [true, 'nombre requerido']},
    apellidos: {type: String, required: [true, 'direccion requerida']},
    email: {type: String, required: [true, 'email requerido'], index: {unique: true}},
    telefono: {type: String},
    direccion: {type: String, required: [true, 'direccion requerida']},
    fechaRegistro: {type: Date, required: [true, 'fecha de registro requerida']}
});
module.exports = mongoose.model('representante', representanteSchema, 'representante');