"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let catalogoEstatusUsuarioSchema = new Schema({
	estatus: {type: String, required: [true, 'El nombre del estatus es requerido'], unique: false}
});

module.exports = mongoose.model('catalogoEstatusUsuario', catalogoEstatusUsuarioSchema, 'catalogoEstatusUsuario');