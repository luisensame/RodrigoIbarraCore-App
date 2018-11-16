'use strict';
// Daos
const catalogoEstadoDao = require('../dao/catalogo.estado.dao');

module.exports = {
    findAll: function(callback) {
        // Se invoca la funcion del modelo
        catalogoEstadoDao.findAll((result) => {
            callback(result);
        });
    }
};