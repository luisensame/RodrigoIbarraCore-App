'use strict';

// Modelos
const usuarioStaffModel = require('../models/usuario.staff');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'usuario.staff.dao > ';

module.exports = {	

    /**
     * Funcion que accede al modelo de datos para obtener un objeto usuario por email y password
     * @param  {UsuarioStaff}   usuarioStaff Objeto
     * @param  {Function} callback     Retorna el valor de la consulta     
     */
    find: function (usuarioStaff, callback) {        
        let query = usuarioStaffModel.findOne({email: usuarioStaff.email, password: usuarioStaff.password});
        query.select('nombre email');
        query.exec((err, usuario) => {            
            // Se verifica si ocurrio un error
            if (err) {
                log.error(fileJS, 'Error find: ', err);
                return callback({success: false, err: err});
            }
            return callback({success: true, usuario: usuario});
        });
    }
};