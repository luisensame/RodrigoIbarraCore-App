var mongoose = require('mongoose'),
    Schema = mongoose.Schema;    

var reseniaSchema = new Schema({    
    producto: {type: Schema.ObjectId, ref: 'producto'},
    usuario: {type: Schema.ObjectId, ref: 'usuario'},
    calificacion: {type: Number, required: [true, 'Calificación requerida']},
    fechaRegistro: {type: Date, required: [true, 'Fecha de registro requerida'], default: Date.now},

    /**
     * 1 Es activo
     * 2 Es inactivo
     */
    estatusResenia: {type: Number, required: [true, 'Se necesita el estatus de la resenia'], default: 1}
});
module.exports = mongoose.model('resenia', reseniaSchema, 'resenia');