'use strict';

// Daos
const catalogoCategoriaDao = require('../dao/catalogo.categoria.producto.dao');

module.exports = {
    
    /**
     * Funcion que obtiene el catalogo de caterogias en un array
     * @param  {Function} callback return result      
     */
    find: function (callback) {
        // Se invoca la funcion del modelo
        catalogoCategoriaDao.find((result) => {
            callback(result);
        });
    }    
};