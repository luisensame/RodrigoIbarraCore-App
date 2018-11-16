'use strict';

const mongoose = require('mongoose');

// Models
const pedidoModel = require('../models/pedido');
const productoModel = require('../models/producto');
const async = require('async');

const config = require('../config.js');

//logs
const log4js = require('log4js'),
    log = log4js.getLogger('kitchen'),
    fileJS = 'pedido.dao > ';

module.exports = {

    /**
     * Funcion que registra un nuevo pedido
     * @param  {Object}   pedido  Informacion del pedido a registrar
     * @param {Funcion}      callback function
     */
    registrarPedido: function(pedido, callback) {

    	let query = new pedidoModel(pedido);
        query.save((err, pedidoData) => {
            
            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error registrarPedido: ', err);
                return callback({success: false});
            }

            return callback({success: true, id: pedidoData._id});
        });
    },

    /**
     * Funcion que actualiza el estatus de un pedido
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}      callback function
     */
    cambiarEstatusPedidoPorId: function(pedido, callback) {

        let query = pedidoModel.findOneAndUpdate({_id: pedido._id}, pedido);
        query.exec((err, p) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error cambiarEstatusPedidoPorId: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
    },

    /**
     * Funcion que actualiza el estatus de un pedido
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}      callback function
     */
    obtenerPedidoPorIdOrden: function(idOrden, callback) {

        let query = pedidoModel.find({idOrden: idOrden}).populate('usuario');
        query.exec((err, pedido) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error obtenerPedidoPorIdOrden: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, pedido: pedido[0]  || pedido});
        });
    },    

    /**
     * Funcion que obtiene una lisa de productos por el id de usuario
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}  callback function
     */
    obtenerListaProductosPorUsuario: function(idUsuario, callback) {

        let query = pedidoModel.find({usuario: idUsuario});
        query.exec((err, listaProductos) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error obtenerListaProductosPorUsuario: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, listaProductos: listaProductos});
        });
    },

    /**
     * Funcion que obtiene el total de pedidos de un usuario por estatus de entrega
     * @param  {String}   usuarioId      id del usuario
     * @param  {Integer}   estatusEntrega Estatus de entrega pendiente/entregado
     * @param  {Function} callback       Encapsula el resultado de la operacion     
     */
    obtenerTotalPedidosPorUsuario: function(usuarioId, estatusEntrega, callback){
        var secureObjectIdUsuario = (mongoose.Types.ObjectId.isValid(usuarioId)) ? (mongoose.Types.ObjectId(usuarioId)) : '123456789012';
        const findQuery = [
            { $match: { $and: [{ 'usuario': secureObjectIdUsuario, 'estatusPago': 1, 'activo': true} ]} },
            { $unwind: "$productos" },
            { $match: { 'productos.estatusEntrega': estatusEntrega } },
            { $group: {_id: null, count : {$sum : 1} } }
        ];

        //De todos los pedidos del usuario se obtienen los productos con estatus de entrega
        pedidoModel.aggregate(findQuery, function (err, result){
            //Si error al consultar
            if (err) {
                log.error(fileJS, 'Error obtenerTotalPedidosPorUsuario: ', err);
                return callback({success: false, err: err});
            }       
            var count = 0;
            if (result.length > 0 && result[0]) {
                count = result[0].count;
            }
            return callback({success: true, totalPedidos: count});
        });        
    },

    /**
     * Funcion que obtiene una lista de pedidos con productos filtrados por estatus de entrega
     * @param  {String}   usuarioId      id del usuario
     * @param  {Integer}   estatusEntrega Estatus de entrega pendiente/entregado
     * @param  {JSON}   paginacion contiene el indice y el limite para obtener los resultados paginados
     * @param  {Function} callback       Encapsula el resultado de la operacion     
     */
    obtenerProductosPedidosPorUsuario: function(usuarioId, estatusEntrega, paginacion,  callback){        
        var secureObjectIdUsuario = (mongoose.Types.ObjectId.isValid(usuarioId)) ? (mongoose.Types.ObjectId(usuarioId)) : '123456789012';
        const findQuery = [
            { $match: { $and: [{ 'usuario': secureObjectIdUsuario, 'estatusPago': 1, 'activo': true} ]} },
            { $unwind: "$productos" },
            { $match: { 'productos.estatusEntrega': estatusEntrega } },
            { $group: {_id: "$_id", productos: {$push: "$productos"} } },
            { $skip: paginacion.offSet },
            { $limit: paginacion.noElementos }
        ];

        //De todos los pedidos del usuario se obtienen los productos con estatus de entrega
        pedidoModel.aggregate(findQuery, function (err, pedidos){
            //Si error al consultar
            if (err) {
                log.error(fileJS, 'Error obtenerProductosPedidosPorUsuario: ', err);
                return callback({success: false, err: err});
            }            

            //Se itera sobre pedidos para extraer productos encontrados
            async.forEachOf(pedidos, (pedido, i, callbackPedido) => {                                

                //Se itera sobre los productos del pedido
                async.forEachOf(pedido.productos, (producto, j, callbackProductos) => {
                    //Se consulta producto por producto
                    productoModel.findById(producto._id, function (errProducto, productoResult){
                        //Si error
                        if (errProducto) {
                            log.error(fileJS, 'Error obtenerProductosPedidosPorUsuario: ', errProducto);
                            callbackProductos(errProducto);
                        }

                        //Se optienen propiedades y se establecen en el objeto principal de pedidos
                        pedidos[i].productos[j]['nombre'] = productoResult['nombre'];
                        pedidos[i].productos[j]['imagenes'] = productoResult['imagenes'];
                        callbackProductos();
                    });
                }, function (errProducto){
                    //Si surge error al consultar el producto
                    if (errProducto) {
                        log.error(fileJS, 'Error obtenerProductosPedidosPorUsuario: ', errProducto);
                        callbackPedido(errProducto);
                    }

                    callbackPedido();
                });
            }, function (errPedido){
                //Si surgio error al consultar productos del los pedidos
                if (errPedido) {
                    log.error(fileJS, 'Error obtenerProductosPedidosPorUsuario: ', errPedido);
                    return callback({success: false, err: errPedido});
                }
                
                return callback({success: true, pedidos: pedidos});
            });                        
        });        
    },
    /**
     * Funcion que actualiza el estatus de un pedido
     * @param {Object}   producto  Informacion del producto
     * @param {Funcion}      callback function
     */
    obtenerPedidoPorId: function(idPedido, callback) {

        let query = pedidoModel.find({_id: idPedido}).populate('usuario');
        query.exec((err, pedido) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error obtenerPedidoPorId: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true, pedido: pedido[0]  || pedido});
        });
    },
    /**
     * Funcion que desactiva el pedido cuando el usuario es eliminado
     * @param  {[String]}   idUsuario [id del usuario relacionado los pedidos]
     * @retur  {Function} callback  [callback function]
     */
    desactivarPedido: function(idUsuario, callback) {

        let query = pedidoModel.update({usuario: idUsuario}, {$set: {activo: false}}, { multi: true });
        query.exec((err) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error desactivarPedido: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
    },    

    /**
     * Funcion que actualiza el estatus de un producto sobre un pedido en especifico
     * @param  {ObjectId}   idPedido       del pedido
     * @param  {ObjectId}   idProducto     del producto
     * @param  {Integer}   estatusEntrega estatus del producto entregado/pendiente
     * @param  {Function} callback       Encapsula el resultado de la operacion     
     */
    actualizarEstatusEntregaProductoPedido: function (idPedido, idProducto, estatusEntrega, callback){
        pedidoModel.update(
            {_id: idPedido, 'productos._id': idProducto},
            {$set: {'productos.$.estatusEntrega': estatusEntrega}},
            function (err, result){                
                if (err) {
                    log.error(fileJS, 'Error actualizarEstatusEntregaProductoPedido: ', err);
                    return callback({success: false, err: err});
                }
                return callback({success: true, message: 'Estatus de producto actualizado'});
            });
    },

    
    /**
     * Funcion que obtiene la informacion del pedido con sus productos complementados para el staff de sell-it
     * @param  {String}   idOrden  de orden conekta
     * @param  {Function} callback Encapsula resultado de la operacion     
     */
    obtenerPedidoPorIdOrdenNotificacionStaff: function(id, flagIfId,  callback){
        let query = null;
        // Si el flag es busqueda por solo id
        if (flagIfId) {            
            query = pedidoModel.findById(id).populate('usuario');
        }else {
            // Si es false se busca por id de orden
            query = pedidoModel.findOne({idOrden: id}).populate('usuario');
        }

        query.exec((err, pedido) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error obtenerPedidoPorIdOrdenNotificacionStaff: ', err);
                return callback({success: false, err: err});
            }
            
            //Se itera sobre los productos del pedido
            async.forEachOf(pedido.productos, (producto, j, callbackProductos) => {
                //Se consulta producto por producto
                productoModel.findById(producto._id, function (errProducto, productoResult){
                    //Si error
                    if (errProducto) {
                        log.error(fileJS, 'Error obtenerPedidoPorIdOrdenNotificacionStaff: ', errProducto);
                        return callbackProductos(errProducto);
                    }

                    //Se optienen propiedades y se establecen en el objeto principal de pedidos
                    pedido.productos[j]['nombre'] = productoResult['nombre'];
                    pedido.productos[j]['modelo'] = productoResult['modelo'];
                    pedido.productos[j]['imagenes'] = productoResult['imagenes'];

                    callbackProductos();
                });
            }, function (errProducto){
                //Si surge error al consultar el producto
                if (errProducto) {                    
                    callback({success: false, err: errProducto});
                }
                callback({success: true, pedido: pedido});
            });            
        });
    },

    actualizarIdOrden: function(pedido, callback) {

        pedido._id = (mongoose.Types.ObjectId(pedido._id)) ? pedido._id : '123456789012';

        let query = pedidoModel.findOneAndUpdate({_id: pedido._id}, pedido);
        query.exec((err) => {

            // Se verifica si ocurrio un error
            if(err) {
                log.error(fileJS, 'Error actualizarIdOrden: ', err);
                return callback({success: false, err: err});
            }

            return callback({success: true});
        });
    }
};