var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var catalogoEstatusPedido = new Schema({
    estatus: {type: String, required: [true, 'estatus requerido']}
});
module.exports = mongoose.model('catalogo_estatus_pedido', catalogoEstatusPedido, 'catalogo_estatus_pedido');