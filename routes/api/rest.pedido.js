'use strict';

const express = require('express');

//services
const mailService = require('../../services/mail.service');
const pedidoService = require('../../services/pedido.service');
const usuarioService = require('../../services/usuario.service');
const conektaService = require('../../services/conekta.service');
const productoService = require('../../services/producto.service');
const catalogoMetodoPagoService = require('../../services/catalogo.metodo.pago.service');

// Libs
const async = require('async');
const moment = require('moment');

// Configuracion
const config = require('../../config');

const pedidoRouter = express.Router();

/**
 * Funcion que genera la informacion del pedido a registrar
 * @param  {[Object]} pedido  [Informacion del pedido]
 * @param  {[String]} idOrden [Id de la orde]
 * @return {[Json]}         [informacion a registrar]
 */
function generarInformacionPedido(pedido, idOrden) {

	let productos = []; // Lista de productos
	let precioTotal = 0; // Se establece el precio
	let fechaActual = moment().format('YYYY/MM/DD HH:mm:ss'); // Se obtiene la fecha actual

	// Se itera la lista
	for(let i = 0; i < pedido.productos.length; i++) {

		// Cantidad de piezas a adquirir
		let cantidad = (pedido.productos[i].noPiezas) ? pedido.productos[i].noPiezas : 1;
		let precio = (parseInt(pedido.productos[i].precio) * cantidad) + pedido.productos[i].costoEnvio; // Se obtiene el precio por las piezas
		precioTotal += precio; // Se suma al precio total

		productos.push({
			estatusEntrega: 1, // Se establece el estatus de la entrega en pendiente
			noPiezas: cantidad, // Numero de piezas que adquirio
			_id: pedido.productos[i]._id, // Id del producto
			color: pedido.productos[i].color, // Color que ha adquirido
			precio: pedido.productos[i].precio, // Precio a pagar por producto
			costoEnvio: pedido.productos[i].costoEnvio, // Consto de envio
			caracteristicas: pedido.productos[i].caracteristicas, // Caracteristicas
		});
	}

	// Se retorna un json
	return {
		estatusPago: 2, // Se establece el estatus de pago como pendiente
		idOrden: idOrden, // Se agrega el id de orden
		monto: precioTotal, // Se establece el precio total
		productos: productos, // Se establece la lista de productos
		usuario: pedido.usuario._id, // Se establece el id del usuario
		metodoPago: pedido.metodoPago, // Se establece el metodo de pago
		fechaRegistro: fechaActual
	};
}

function actualizarIdOrden(pedido) {
	// Se invoca al servicio
	pedidoService.actualizarIdOrden(pedido, (result) => {
		console.log(result);
	});
}

/**
 * Funcion que decrementa el numero de piezas del producto
 * @param  {Object} productoData 
 * @param  {Object} producto     
 */
function decrementarPiezasDisponibles(productoData, producto) {

	let productoPiezas = {
		_id: producto._id,
		piezasDisponibles: productoData.piezasDisponibles
	};

	// Se verifica si el producto tiene mas de una pieza
	if(productoData.piezasDisponibles > 0) {

		// Se verifica si tengo piezas para cubrir el total de productos requeridos
		if(productoData.piezasDisponibles > producto.noPiezas) {
			productoPiezas.piezasDisponibles = producto.noPiezas;
		}

		productoPiezas.piezasDisponibles *= -1; // Se obtiene el decremento
		productoService.actualizarPiezasDisponiblesProducto(productoPiezas, (result) => {});
	}

	// Se invoca el producto
	let piezasRestantes = productoData.piezasDisponibles - (productoPiezas.piezasDisponibles * -1);

	// Si las piezas restantes es menor o igual que sero y resurtir es falso se deshabilita el producto
	if(piezasRestantes <= 0 && !productoData.resurtir) {
		let p = {
			_id: productoPiezas._id,
			status: false
		};
		productoService.desactivarProducto(p, (result) => {});
	}
}

/**
 * API REST que crea la orden de pago mediante OXXOPay
 */
pedidoRouter.post('/efectivo', (req, res) => {

	// Se obtiene la informacion del pedido
	let pedido = req.body.pedido;

	// Se verifica si existe un pedido
	if(pedido) {

		async.parallel([
			//update product in db
			(callback) => {
				// Se invoca al servicio de conekta
				conektaService.crearPagoEfectivo(pedido, (err, order) => {
					return callback(err, order);
				});				
			},
			(callback) => {
				// Se verifica si existe la propiedad
				if(pedido.usuario.direccionEnvio) {
					// Se invoca al servicio de conekta
					usuarioService.actualizarInformacion(pedido.usuario, (result) => {
						// Se verifica si no ocurrio un error
						if(result.success && !result.err) {
							return callback(null, result);
						}
						return callback(true, result);
					});
				}
			},
		], (err, results) => {
			console.log(err)
			if(err) {
				//when error
				return res.status(500).json({
					pago: false,
					success: false,
					message: 'Error al generar el pago'
				});
			}

			let order = results[0]; // Se obtiene la informacion del usuario
			let pedidoData = generarInformacionPedido(pedido, order.id);

			// Se invoca al servicio
			pedidoService.registrarPedido(pedidoData, (result) => {				
				// Se verifica si se registra correctamente el pedido
				if(result && result.success) {
					let mailData = {
						monto: pedidoData.monto,
						email: pedido.usuario.email,
						options: {to: pedido.usuario.email},
						referencia: order.charges.data[0].payment_method.reference,
					};
					mailService.reciboPagoEfectivo(mailData); // call service to send mail
					return res.status(200).json({
						success: true,
						message: 'El pago fue generado correctamente'
					});
				} else {
					return res.status(500).json({
						pago: false,
						success: false,
						message: 'Error al generar el pago'
					});
				}
			});
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error al validar los datos'
		});
	}
});

/**
 * API REST que crea la orden de pago mediante spi
 */
pedidoRouter.post('/transferencia', (req, res) => {

	// Se obtiene la informacion del pedido
	let pedido = req.body.pedido;

	// Se verifica si existe un pedido
	if(pedido) {
		async.parallel([
			//update product in db
			(callback) => {						
				// Se invoca al servicio de conekta
				conektaService.crearPagoTransferencia(pedido, (err, order) => {
					return callback(err, order);
				});
			},
			(callback) => {
				// Se verifica si existe la propiedad
				if(pedido.usuario.direccionEnvio) {
					// Se invoca al servicio de conekta
					usuarioService.actualizarInformacion(pedido.usuario, (result) => {
						// Se verifica si no ocurrio un error
						if(result.success && !result.err) {
							return callback(null, result);
						}
						return callback(true, result);
					});
				}
			},
		], (err, results) => {

			if(err) {
				//when error
				return res.status(500).json({
					pago: false,
					success: false,
					message: 'Error al generar el pago'
				});
			}

			let order = results[0]; // Se obtiene la informacion del usuario
			let pedidoData = generarInformacionPedido(pedido, order.id);

			// Se invoca al servicio
			pedidoService.registrarPedido(pedidoData, (result) => {				
				// Se verifica si se registra correctamente el pedido
				if(result && result.success) {
					let mailData = {
						monto: pedidoData.monto,
						email: pedido.usuario.email,
						options: {to: pedido.usuario.email},
						bank: order.charges.data[0].payment_method.receiving_account_bank,
						clabe: order.charges.data[0].payment_method.receiving_account_number,
					};
					mailService.reciboPagoTransferencia(mailData); // call service to send mail
					return res.status(200).json({
						success: true,
						message: 'El pago fue generado correctamente'
					});
				} else {
					return res.status(500).json({
						pago: false,
						success: false,
						message: 'Error al generar el pago'
					});
				}
			});
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error al validar los datos'
		});
	}
});

/**
 * API REST que crea la orden de prepago
 */
pedidoRouter.post('/prepago', (req, res) => {
	
	// Se obtiene la informacion del pedido
	let pedido = req.body.pedido;

	// Se verifica si existe un pedido
	if (pedido) {

		async.parallel([			
			(callback) => {
				// Se verifica si existe la propiedad
				if (pedido.usuario.direccionEnvio) {					
					usuarioService.actualizarInformacion(pedido.usuario, (result) => {
						// Se verifica si no ocurrio un error
						if (result.success && !result.err) {
							return callback(null, result);
						}
						return callback(true, result);
					});
				}
			},
		], (err, results) => {
			if (err) {
				//when error
				return res.status(500).json({
					pago: false,
					success: false,
					message: 'Error al generar el prepago'
				});
			}

			let order = results[0]; // Se obtiene la informacion del usuario
			let pedidoData = generarInformacionPedido(pedido, order.id);

			// Se invoca al servicio
			pedidoService.registrarPedido(pedidoData, (result) => {
				console.log(pedido)
				// Se verifica si se registra correctamente el pedido
				if (result && result.success) {
					let mailData = {
						monto: pedidoData.monto,
						email: pedido.usuario.email,
						options: { to: pedido.usuario.email },
						referencia: config.REFERENCIA,
						datosContacto: config.DATOS_CONTACTO,
						sucursal: pedido.usuario.direccionEnvio.sucursal,
						direccionConcreta: pedido.usuario.direccionEnvio.direccionConcreta,
						horaRecoleccion: pedido.usuario.direccionEnvio.horaRecoleccion
					};
					mailService.notificacionPrepago(mailData); // call service to send mail

					

					pedidoService.obtenerPedidoPorIdOrdenNotificacionStaff(result.id, true, function (resPedido) {
						if (resPedido.success) {												
							let mailDataToStaff = {
								monto: pedidoData.monto,
								options: { to: config.DATOS_CONTACTO.email },
								pedido: resPedido.pedido,
								sucursal: pedido.usuario.direccionEnvio.sucursal,
								direccionConcreta: pedido.usuario.direccionEnvio.direccionConcreta,
								horaRecoleccion: pedido.usuario.direccionEnvio.horaRecoleccion
							};
							mailService.notificacionPedidoPrepagoStaff(mailDataToStaff); // call service to send mail to staff

							setTimeout(() => {								
								mailDataToStaff.options = { to: config.CREACIONES_INTELIGENTES.email };
								mailService.notificacionPedidoPrepagoStaff(mailDataToStaff); // call service to send mail to staff
							}, 1000);
						}
					});

					return res.status(200).json({
						success: true,
						message: 'Su orden de prepago fue generado correctamente.'
					});
				} else {
					return res.status(500).json({
						pago: false,
						success: false,
						message: 'Error al generar prepago'
					});
				}
			});
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error al validar los datos'
		});
	}
});

/**
 * API REST que crea la orden de pago mediante spi
 */
pedidoRouter.post('/tarjeta', (req, res) => {

	// Se obtiene la informacion del pedido
	let pedido = req.body.pedido;
	let tokenId = req.body.tokenId;

	// Se verifica si existe un pedido
	if(pedido) {

		async.waterfall([

			// Funcion que genera un customer
			(callback) => {					
				// Se verifica si existe un token
				if(tokenId) {
					// Se invoca al servicio de conekta
					conektaService.crearCustomer(pedido.usuario, tokenId, (err, customer) => {
						// Se verifica si no ocurrio un error
						if(!err) {
							callback(null, null, {
								id: customer.id,
								tokenId: customer.default_payment_source_id
							});
						} else {
							callback(null, err, null);
						}
					});
				} else {
					callback(null, null, pedido.usuario.customer);
				}
			},

			// Funcion que crear registra la informacion del pedido
			(err, customer, callback) => {

				// Se verifica que no exista un error
				if(!err) {
					// Se obtiene el pedido
					let pedidoData = generarInformacionPedido(pedido);

					// Se invoca al servicio
					pedidoService.registrarPedido(pedidoData, (result) => {
						
						// Se verifica si se registra correctamente el pedido
						if(result && result.success) {
							pedido._id = result.id; // Se obtiene el id del pedido registrado
							callback(null, null, customer);
						} else {
							callback(null, {
								pago: false,
								success: false,
								message: 'Error al generar el pago'
							}, null);
						}
					});
				} else {
					callback(null, err, null);
				}
			},

			// Funcion que crea la orden de pago
			(err, customer, callback) => {

				// Se verifica que no exista un error
				if(!err) {

					// Se pasa la informacion del usuario
					pedido.usuario.customer = customer;

					// Se invoca al servicio de conekta
					conektaService.crearPagoTarjeta(pedido, (err, order) => {
						
						// Se verficia si no ocurrio un error
						if(!err) {
							callback(null, null, order);
						} else {
							callback(null, err, null);
						}
					});
				} else {
					callback(null, err, null);
				}
			},

			// Se actualiza la informacion del usuario
			(err, order, callback) => {

				// Se verifica que no exista un error
				if(!err) {

					// Se invoca al servicio de conekta
					usuarioService.actualizarInformacion(pedido.usuario, (result) => {

						// Se verifica si no ocurrio un error
						if(result.success && !result.err) {
							callback(null, order);
						} else {
							callback(true, null);
						}
					});
				} else {
					callback(err, null);
				}
			}
		], (err, order) => {

			// Se verifica si existe un error
			if(err) {
				var errorMessage = "Error al generar el pago"
				if (err.type == 'processing_error') {
					errorMessage = err.details[0].message
				}
				//when error
				return res.status(500).json({
					pago: false,
					success: false,
					message: errorMessage
				});
			}			
			
			let p = {_id: pedido._id, idOrden: order.id};
			actualizarIdOrden(p);			

			return res.status(200).json({
				success: true,
				message: 'El pago fue generado correctamente'
			});
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error al validar los datos'
		});
	}
});

/**
 * API REST que recupera una lista de pedidos de un usuario
 * @param  idUsuario del usuario
 * @param  estatusEntrega estatus de los productos de los pedidos 
 */
pedidoRouter.get('/:idUsuario', (req, res) => {

	// Se verifica si existe el parametro
	if(req.params.idUsuario) {

		// Se invoca al servicio
		pedidoService.obtenerListaProductosPorUsuario(req.params.idUsuario, (result) => {
			
			// Se verifica si no ocurrio un error
			if(!result.err) {
				return res.status(200).json({
					success: true,
					listaProductos: result.listaProductos,
					message: 'Se obtiene la lista de productos'
				});
			} else {
				return res.status(500).json({
					success: false,
					message: 'Ocurrio un error al obtener la lista de productos'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Error al validar los datos'
		});
	}
});

pedidoRouter.get('/total/:idUsuario/:estatusEntrega', (req, res) => {
    var estatusEntrega = parseInt(req.params.estatusEntrega);
    pedidoService.obtenerTotalPedidosPorUsuario(req.params.idUsuario, estatusEntrega, function (result){
        if (result.success) {
            return res.status(200).json({success: true, totalPedidos: result.totalPedidos});
        }
        
        return res.status(500).json({success: false, message: 'Error al obtener total de pedidos.'});
    });
});

/**
 * API REST que recupera una lista de pedidos de un usuario por estatus de entrega
 * @param  idUsuario del usuario
 * @param  estatusEntrega estatus de los productos de los pedidos 
 */
pedidoRouter.get('/productos/:idUsuario/:estatusEntrega', (req, res) => {

    if (!req.query.offSet || !req.query.noElementos) {
        return res.status(500).json({success: false, message: 'Error al obtener pedidos, params incorrectos'});
    }

    var estatusEntrega = parseInt(req.params.estatusEntrega);
    var paginacion = {
        offSet: parseInt(req.query.offSet),
        noElementos: parseInt(req.query.noElementos)
    };
    pedidoService.obtenerProductosPedidosPorUsuario(req.params.idUsuario, estatusEntrega, paginacion, function (result){
        if (result.success) {
            return res.status(200).json({success: true, pedidos: result.pedidos});
        }
        
        return res.status(500).json({success: false, message: 'Error al obtener pedidos'});
    });
});
module.exports = pedidoRouter;