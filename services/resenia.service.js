'use strict';

// Daos
const reseniaDao = require('../dao/resenia.dao');

module.exports = {
    registrarResenia: function(resenia, callback) {
        // Se invoca al metodo para registrar la reseña del producto
        reseniaDao.registrar(resenia, (result) => {
            callback(result);
        });
    },
    cambiarEstatusResenia: function(idUsuario, callback) {
        // Se invoca al metodo para registrar la reseña del producto
        reseniaDao.cambiarEstatusResenia(idUsuario, (result) => {
            callback(result);
        });
    },
    obtenerListaReseniaPorId: function(idProducto, offset, noElementos, callback) {

    	// Se invoca la funcion que obtiene 10 reseñas ordenadas por fecha
    	reseniaDao.obtenerListaReseniaPorId(idProducto, offset, noElementos, (result) => {
            callback(result);
        });
    }
};