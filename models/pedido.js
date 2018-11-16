'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let pedido = new Schema({
	fechaRegistro: {type: Date, required: [true, 'fecha requerida']},
	monto: {type: Number, required: [true, 'monto requerido']},
	productos: [],
	usuario: {type: Schema.ObjectId, ref: 'usuario'},
	metodoPago: {type: Number, required: [true, 'Metodo de pago requerido']},
	estatusPago: {type: Number, default: 1, requerido: [true, 'Estatus de pago requerido']},
	estatusPedido: {type: Number, default: 1, requerido: [true, 'Estatus de entrega requerido']},
	idOrden: {type: String},
	activo: {type: Boolean, required: [true, 'Se requiere si esta activo o no'], default: true}
});

module.exports = mongoose.model('pedido', pedido, 'pedido');