'use strict';
// Daos
const catalogoMetodoPagoDao = require('../dao/catalogo.metodo.pago.dao');

module.exports = {
    findAll: function(callback) {
        // Se invoca la funcion del modelo
        catalogoMetodoPagoDao.findAll((result) => {
            callback(result);
        });
    },
    obtenerMetodoPagoPorId: function(idMetodoPago, callback) {
        // Se invoca la funcion del modelo
        catalogoMetodoPagoDao.obtenerMetodoPagoPorId(idMetodoPago, (result) => {
            callback(result);
        });
    }
};