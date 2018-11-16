"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let favoritoSchema = new Schema({
	producto: {type: Schema.ObjectId, ref: 'producto'},
	email: {type: String, required: [true, 'email requerido'], unique: false},

	// 1 activo, 2 eliminado
	estatusFavorito: {type: Number, required: [true, 'Estatus de productos favoritos'], default: 1}
});

module.exports = mongoose.model('favorito', favoritoSchema, 'favorito');