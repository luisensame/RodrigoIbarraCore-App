var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var catalogoCategoriaProducto = new Schema({
    categoria: {type: String, required: [true, 'categoria requerida']},
    tipo: String,
    id: String,
    id_proveniente: String
});
module.exports = mongoose.model('catalogo_categoria_producto', catalogoCategoriaProducto, 'catalogo_categoria_producto');