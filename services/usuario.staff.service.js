'use strict';

// Daos
const usuarioStaffDao = require('../dao/usuario.staff.dao');

module.exports = {

    /**
     * Funcion que busca un usuario por medio de email y password
     * @param  {UsuarioStaff}   usuarioStaff objeto
     * @param  {Function} callback     Retorna el valor del dao     
     */
    find: function (usuarioStaff, callback) {
        // Se invoca la funcion del modelo
        usuarioStaffDao.find(usuarioStaff, (result) => {            
            callback(result);
        });
    }
};