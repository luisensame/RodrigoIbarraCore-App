var mongoose = require('mongoose'),
    Schema = mongoose.Schema;    

var proveedorSchema = new Schema({
    nombreEmpresa: {type: String, required: [true, 'nombre requerido']},
    email: {type: String, required: [true, 'email requerido'], index: {unique: true}},
    telefono: {type: String},
    direccion: {type: String, required: [true, 'direccion requerida']},
    estado: {type: Schema.ObjectId, ref: 'catalogo_estado', required: [true, 'Estado requerido']},
    codigoPostal: {type: String, required: [true, 'codigo postal requerido']},
    fechaRegistro: {type: Date, required: [true, 'fecha de registro requerida']},
    representante: {type: Schema.ObjectId, ref: 'representante'}
});
module.exports = mongoose.model('proveedor', proveedorSchema, 'proveedor');