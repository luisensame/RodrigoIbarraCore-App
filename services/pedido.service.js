'use strict';

// Daos
const pedidoDao = require('../dao/pedido.dao');

module.exports = {

	/**
	 * Funcion que registra un nuevo pedido
	 * @param  {Object}   pedido  Informacion del pedido a registrar
	 * @param {Funcion}      callback function
	 */
    registrarPedido: function(pedido, callback) {
        // Se invoca la funcion del modelo
        pedidoDao.registrarPedido(pedido, (result) => {
            callback(result);
        });
    },
    /**
     * Funcion que actualiza el estatus de un pedido
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}  callback function
     */
    cambiarEstatusPedidoPorId: function(pedido, callback) {
        // Se invoca la funcion del modelo
        pedidoDao.cambiarEstatusPedidoPorId(pedido, (result) => {
            callback(result);
        });
    },
    /**
     * Funcion que actualiza el estatus de un pedido
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}  callback function
     */
    obtenerPedidoPorIdOrden: function(idOrden, callback) {
        // Se invoca la funcion del modelo
        pedidoDao.obtenerPedidoPorIdOrden(idOrden, (result) => {
            callback(result);
        });
    },

    /**
     * Funcion que obtiene una lisa de productos por el id de usuario
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}  callback function
     */
    obtenerListaProductosPorUsuario: function(idUsuario, callback) {
        // Se invoca la funcion del modelo
        pedidoDao.obtenerListaProductosPorUsuario(idUsuario, (result) => {
            callback(result);
        });
    },

    /**
     * Funcion que obtiene el total de pedidos por usuario y estatus de entrega
     * @param  {String}   usuarioId      del usuario
     * @param  {Integer}   estatusEntrega del pedido y/o productos
     * @param  {Function} callback       Encapsula el resultado de la operacion     
     */
    obtenerTotalPedidosPorUsuario: function(usuarioId, estatusEntrega, callback){
        pedidoDao.obtenerTotalPedidosPorUsuario(usuarioId, estatusEntrega, function (result){
            callback(result);
        });
    },

    obtenerProductosPedidosPorUsuario: function(usuarioId, estatusEntrega, paginacion, callback){
        pedidoDao.obtenerProductosPedidosPorUsuario(usuarioId, estatusEntrega, paginacion, function (result){
            callback(result);
        });
    },
    /**
     * Funcion que actualiza el estatus de un pedido
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}  callback function
     */
    obtenerPedidoPorId: function(idPedido, callback) {
        // Se invoca la funcion del modelo
        pedidoDao.obtenerPedidoPorId(idPedido, (result) => {
            callback(result);
        });
    },

    /**
     * Funcion que desactiva el pedido cuando el usuario es eliminado
     * @param  {[String]}   idUsuario [id del usuario relacionado los pedidos]
     * @retur  {Function} callback  [callback function]
     */
    desactivarPedido: function(idUsuario, callback) {

        // Se invoca la funcion
        pedidoDao.desactivarPedido(idUsuario, (result) => {
            callback(result);
        });
    },

    actualizarEstatusEntregaProductoPedido: function (idPedido, idProducto, estatusEntrega, callback) {
        pedidoDao.actualizarEstatusEntregaProductoPedido(idPedido, idProducto, estatusEntrega, function (result) {
            callback(result);
        });
    },

    obtenerPedidoPorIdOrdenNotificacionStaff: function (id, flagIfId, callback){
        pedidoDao.obtenerPedidoPorIdOrdenNotificacionStaff(id, flagIfId, function (result) {
            callback(result);
        });
    },
    actualizarIdOrden: function(pedido, callback) {
        pedidoDao.actualizarIdOrden(pedido, function (result) {
            callback(result);
        });  
    }
};