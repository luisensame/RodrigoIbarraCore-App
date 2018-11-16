'use strict';

const express = require('express');

//services
const mailService = require('../../services/mail.service');
const pedidoService = require('../../services/pedido.service');
const productoService = require('../../services/producto.service');
const catalogoMetodoPagoService = require('../../services/catalogo.metodo.pago.service');

const config = require('../../config.js');
//logs
const log4js = require('log4js'),
	log = log4js.getLogger('kitchen'),
	fileJS = 'rest.webhook > ';


// libs
const async = require('async');
const moment = require('moment');

const webhookRouter = express.Router();

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

/* POST request pay oxxo */
webhookRouter.post('/', (req, res) => {

	// Se obtiene la informacion de la orden
	let order = typeof req.body == 'string' ? JSON.parse(req.body) : req.body;

	// SE verifica si el entorno es development
	if(config.env === 'development') {

		order = {
			'data': {
				'object': {
					'id': '588258fbedbb6e85e7000f95',
					'livemode': false,
					'created_at': 1484937467,
					'currency': 'MXN',
					'payment_method': {
						'service_name': 'OxxoPay',
						'object': 'cash_payment',
						'type': 'oxxo',
						'expires_at': 1487548800,
						'store_name': 'OXXO',
						'reference': '93345678901234'
					},
					'details': {
						'name': 'Fulanito Pérez',
						'phone': '+5218181818181',
						'email': 'fulanito@conekta.com',
						'line_items': [{
							'name': 'Tacos',
							'unit_price': 1000,
							'quantity': 12
						}],
						'shipping_contact': {
							'phone': '5555555555',
							'receiver': 'Bruce Wayne',
							'address': {
								'street1': 'Calle 123 int 2 Col. Chida',
								'city': 'Cuahutemoc',
								'state': 'Ciudad de Mexico',
								'country': 'MX',
								'postal_code': '06100',
								'residential': true
							}
						},
						'object': 'details'
					},
					'object': 'charge',
					'status': 'paid',
					'amount': 13500,
					'paid_at': 1484937498,
					'fee': 1421,
					'customer_id': '',
					'order_id': 'ord_2hHuE5CCVZcLLBB3C'
				},
				'previous_attributes': {
					'status': 'pending_payment'
				}
			},
			'livemode': false,
			'webhook_status': 'successful',
			'webhook_logs': [
				{
					'id': 'webhl_2fshi2CmCGqx4p6go',
					'url': 'www.example.com',
					'failed_attempts': 0,
					'last_http_response_status': 200,
					'object': 'webhook_log',
					'last_attempted_at': 1484937503
				}
			],
			'id': '5882591b5906e7819c0007f1',
			'object': 'event',
			'type': 'charge.paid',
			'created_at': 1484937499
		};
	}

	// Se verifica si el pago fue exitoso
	if(order.type == 'charge.paid') {
		
		let pedido = {
			estatusPago: 1,
			idOrden: order.data.object.order_id
		};

		// Se invoca al servicio
		pedidoService.obtenerPedidoPorIdOrden(pedido.idOrden, (result) => {

			// Se verifica si se obtiene el pedido
			if(
				result.success && 
				result.pedido && 
				result.pedido.estatusPago == 2 && 
				result.pedido.productos && 
				result.pedido.productos.length > 0
			) {

				let listaProductos = [];
				pedido._id = result.pedido._id;
				let pedidoData = result.pedido;
				pedido.productos = result.pedido.productos;				

				// Se itera la lista de productos para obtener el id
				for(let i = 0; i < pedidoData.productos.length; i++) {
					listaProductos.push(pedidoData.productos[i]._id);
				}

				async.parallel([
					//update product in db
					function(callback) {
						productoService.obtenerListaProductosPorId(listaProductos, (result) => {
							// Se verficia si no ocurrio un error
							if(result.success) {
								return callback(null, result.productos);
							}
							return callback(true, result);
						});
					},
					function(callback) {
						// Se invoca al servicio de conekta
						catalogoMetodoPagoService.obtenerMetodoPagoPorId(pedidoData.metodoPago, (result) => {
							// Se verifica si no ocurrio un error
							if(result.success && !result.err) {
								return callback(null, result.metodoPago);
							}
							return callback(true, result);
						});
					},
				], function(err, results) {

					if(err) {
						log.error(fileJS, 'Error obtenerPedidoPorIdOrden: ', err);
						//when error
						return res.status(500).json({
							success: false,
							message: 'Error al obtenerPedidoPorIdOrden'
						});
					}

					let metodoPago = results[1];
					pedidoData.productos = results[0];

					let fechaActual = moment().format('YYYY/MM/DD HH:mm:ss'); // Se obtiene la fecha actual
					let fechaEntrega = moment(fechaActual, 'YYYY/MM/DD HH:mm:ss').add(config.diasEntrega, 'days'); // Se calcula la fecha de entrega
					fechaEntrega = moment(fechaEntrega).format(); // Se aplica formato ISODate
					
					// Se itera la lista
					for(let i = 0; i < pedidoData.productos.length; i++) {						
						pedido.productos[i].fechaEntrega = fechaEntrega; // Se obtiene la fecha de entrega
						pedidoData.productos[i].noPiezas = pedido.productos[i].noPiezas; // Se obtiene el numero de piezas que se adquieren
						decrementarPiezasDisponibles(pedidoData.productos[i], pedido.productos[i]); // Se invoca la funcion
					}

					// Se invoca al servicio
					pedidoService.cambiarEstatusPedidoPorId(pedido, (result) => {

						// Se verifica si se actualizo correctamente
						if(result.success) {

							let mailData = {
								monto: pedidoData.monto,
								metodoPago: metodoPago.metodo,
								productos: pedidoData.productos,
								diasEntrega: config.diasEntrega,
								email: pedidoData.usuario.email,
								options: {to: pedidoData.usuario.email}
							};
							//console.log("Pagando con oxxo, enviar correo")
							mailService.confirmacionPago(mailData);


							//Mail de notificacion de compra para staff
							pedidoService.obtenerPedidoPorIdOrdenNotificacionStaff(pedidoData.idOrden, false, function (resultPedidoStaff){								
									if (resultPedidoStaff && resultPedidoStaff.success) {
										var mailNotificacionData = {
											to: config.mailStaff,
											pedido: resultPedidoStaff.pedido,
											metodoPago: metodoPago.metodo
										};
										console.log("Enviando Datos a staff")
										mailService.notificacionCompraStaff(mailNotificacionData);

										//Notificacion a soporte cuando sucede una compra
										var mailNotificacionDataSoporte = {
											to: config.mantenimiento.email,
											pedido: resultPedidoStaff.pedido,
											metodoPago: metodoPago.metodo
										};
										mailService.notificacionCompraStaff(mailNotificacionDataSoporte);
								}
							});
						}else{
							log.error(fileJS, 'Error al cambiar estatus del pedido: ', pedido._id);
						}
					});

					res.status(200).json({
						success: true,
						message: 'Finalizacion de proceso de pedido'
					});
				});
			} else {				
				log.error(fileJS, 'Pedido no encontrado id orden: ', pedido.idOrden);
				res.status(404).json({
					success: false,
					message: 'Pedido no encontrado'
				});
			}
		});
	} else {				
		res.status(200).json({
			success: false,
			message: 'Tipo de charge orden no valida'
		});
	}
});

module.exports = webhookRouter;