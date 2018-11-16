'use strict';

// Daos
const usuarioDao = require('../dao/usuario.dao');

// Libs
const moment = require('moment');

// Services
const mailService = require('./mail.service');

// Funciones
function generarContrasenia(longitud) {
    
    let contrasenia = '';
    let caracteres = 'abcdefghjkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ12345678';    
    
    for (let i = 0; i < (longitud); i++)
        contrasenia += caracteres.charAt(Math.floor(Math.random() * caracteres.length));

    var pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&].{7,16}$/;
                
    // Se verifica si es valido con el pattern
    if(!pattern.test(contrasenia)) {
        console.log('Contrasenia no es valida');
        generarContrasenia(longitud);
    } 

    return contrasenia;
}

module.exports = {
    /**
     * Funcion que obtiene la informacion de un usuario por email
     * @param  {String}   email    del usuario a buscar
     * @param  {Function} callback encapsula la informacion de retorno async     
     */
    buscarPorEmail: function (email, callback) {

        // Se invoca la funcion del modelo
        usuarioDao.buscarPorEmail(email, (result) => {

            // Se verifica si existe el usuarios
            if(!result.err && result.success) {

                // Se verifica si se obtiene info del usuario y si el usuario se encuentra eliminado
                if(result.usuario && result.usuario.estatusUsuario == 2) {
                    result = {success: true};
                }
            }

            callback(result);
        });
    },

    /**
     * Funcion que registra a un usuario nuevo
     * @param  {Object}   usuario     Objeto de tipo usuario que contiene la informacion a registrar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    registrarUsuario: function(usuario, callback) {

        // Se invoca al metoso para buscar al usuario
        usuarioDao.buscarPorEmail(usuario.email, (result) => {
            
            // Se verifica si no hay un error
            if(result.success) {

                // Se verifica si el usuario existe
                if(!result.usuario) {

                    // Se recupera la fecha actual
                    usuario.fechaRegistro = moment().format('YYYY/MM/DD HH:mm:ss');

                    // Se invoca al metodo de registro
                    usuarioDao.registrarUsuario(usuario, (result) => {

                        // Se verifica si se registro correctamente
                        // Se envia un correo
                        if(result.success) {                            
                            let mailData = {
                                options: {to: usuario.email},
                                usuario: {
                                    email: usuario.email
                                }
                            };

                            mailService.bienvenida(mailData); // call service to send mail
                        }

                        callback(result);
                    });
                } else if(result.usuario.estatusUsuario == 2) { // Se verifica si la cuenta esta eliminada

                    // Se activa la cuenta
                    usuario.estatusUsuario = 1;

                    // Se invoca al servicio
                    usuarioDao.activarCuentaUsuario(usuario, (result) => {

                        // Se verifica si se registro correctamente
                        // Se envia un correo
                        if(result.success) {                            
                            let mailData = {
                                options: {to: usuario.email},
                                usuario: {
                                    email: usuario.email
                                }
                            };

                            mailService.bienvenida(mailData); // call service to send mail
                        }

                        callback(result);
                    });
                } else {
                    callback(result);
                }
            } else {
                callback(result);
            }
        });
    },

    /**
     * Funcion que recupera la contrasenia de un usuario
     * @param  {String}   email       Email del usuario a recuperar la contrasenia
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    recuperarContrasenia: function(usuario, callback) {

        // Se obtiene una contrasenia aleatoria
        usuario.password = generarContrasenia(8);

        // Se inoca al dao
        usuarioDao.actualizarContrasenia(usuario, (result) => {
            
            // Se verifica si se actualizo correctamente
            if(result && result.success) {

                // Se envia un correo con la nueva contrasenia
                let mailData = {
                    options: {to: usuario.email},
                    usuario: {
                        password: usuario.password,
                        email: usuario.nombreCompleto || usuario.email,
                    }
                };

                mailService.recuperarContrasenia(mailData); // call service to send mail
            }

            callback(result);
        });
    },
    /**
     * Funcion que actualiza la informacion de un usuario lcoal
     * @param  {Object}   usuario     Informacion del usuario a actualizar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    actualizarInformacion: function(usuario, callback) {

        // Se invoca al metodo que actualiza la informacion
        usuarioDao.actualizarInformacion(usuario, (result) => {
            callback(result);
        });
    },
    /**
     * Funcion que elimina la cuenta de un usuario
     * @param  {Object}   usuario     Informacion del usuario a actualizar
     * @param  {Function} callback    callback encapsula la informacion de retorno async
     */
    eliminarCuentaUsuario: function(email, callback) {

        // Se invoca al metodo que actualiza la informacion
        usuarioDao.eliminarCuentaUsuario(email, (result) => {
            callback(result);
        });
    }
};