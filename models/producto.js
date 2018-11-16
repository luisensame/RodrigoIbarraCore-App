var mongoose = require('mongoose'),
    Schema = mongoose.Schema;    

var productoSchema = new Schema({
    nombre: {type: String, required: [true, 'nombre requerido']},
    descripcion: {type: String},
    precio: {type: Number, required: [true, 'precio requerido']},
    costoEnvio: {type: Number, required: [true, 'costo envio requerido']},
    piezasDisponibles: {type: Number, required: [true, 'piezas disponibles requeridas']},
    imagenes: [],
    proveedor: {type: Schema.ObjectId, ref: 'proveedor', required: [true, 'Id de Proveedor requerido']},
    fechaRegistro: {type: Date, required: [true, 'Fecha de registro requerida'], default: Date.now},
    resurtir: {type: Boolean, default: false}, //false producto no resurtido
    fechaExpiracion: {type: Date, required: [true, 'Fecha de expiracion requerida'], default: Date.now},
    colores: [],
    modelo: {type: String},
    status: {type: Boolean, required: [true, 'status de producto requerido'], default: true}, //false inactivo true Activo
    visitas: {type: Number, default: 0},//numero de visitas del producto
    categoria: {type: Schema.ObjectId, ref: 'catalogo_categoria_producto', required: [true, 'Id de Categoria requerida']},//id de la categoria del producto
    oferta: {type: Boolean, default: false},//si el producto se encuentra en oferta
    caracteristicas: []//caracteristicas dinamicas generadas por el usuario
});
productoSchema.index({nombre: 'text'});
module.exports = mongoose.model('producto', productoSchema, 'producto');
