var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var catalogoOrigenUsuario = new Schema({
    origen: {type: String, required: [true, 'origen requerido']}
});
module.exports = mongoose.model('catalogo_origen_usuario', catalogoOrigenUsuario, 'catalogo_origen_usuario');