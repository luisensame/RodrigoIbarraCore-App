var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var catalogoEstado = new Schema({	
    estado: {type: String, required: [true, 'Estado es requerido']}
});
module.exports = mongoose.model('catalogo_estado', catalogoEstado, 'catalogo_estado');