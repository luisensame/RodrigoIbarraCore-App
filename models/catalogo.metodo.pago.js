var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var catalogoMetodoPago = new Schema({
	identificador: {type: Number, required: [true, 'identificador requerido'], index: {unique: true}},
    metodo: {type: String, required: [true, 'metodo de pago requerido']}
})
module.exports = mongoose.model('catalogo_metodo_pago', catalogoMetodoPago, 'catalogo_metodo_pago');