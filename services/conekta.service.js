'use strict';

const express = require('express');

const conekta = require('conekta');
const config = require('../config');

conekta.api_key = config.conekta.apiKey;
conekta.api_version = config.conekta.apiVersion;

/**
 * Funcion que genera el json con la informacion
 * para crear la orden de pago
 * @param  {[object]} pedido 	[informacion del pedido que se agrega a la orden de pago]
 * @param  {[String]} type 		[Tipo de orden para realizar el pago (OXXO pay, spi)]
 * @return {[JSON]}				[retorna el json para crear la orden de pago]
 */
function generarJsonOrden(pedido, type) {

	// Se recupera el nombre del usuario
	let nombre = pedido.usuario.email;

	// Se verifica si tiene un nombre
	if(pedido.usuario.nombreCompleto && pedido.usuario.apellidos) {
		nombre = pedido.usuario.nombreCompleto + ' ' + pedido.usuario.apellidos;
	}

	let items = []; // Se crea un array que contenra los articulos a comprar
	let precioEnvio = 0;
	let precioTotal = 0; // Se establece la suma de envio al precio total

	// Se itera la lista
	for(let i = 0; i < pedido.productos.length; i++) {

		let producto = pedido.productos[i]; // Se obtiene la informacion del producto

		// Se obtiene la cantidad de piezas que va adquirir
		let cantidad = (producto.noPiezas) ? producto.noPiezas : 1;
		precioEnvio += pedido.productos[i].costoEnvio;
		let precio = (parseInt(producto.precio) * cantidad) + pedido.productos[i].costoEnvio; // Se multiplica el costo por la cantidad de piezas adquiridas
		precioTotal += precio; // Se suma al precio total a pagar				

		// Se agrega la informacion a la lista de articulos
		items.push({
			'quantity': cantidad, // La cantidad a adquirir
			'unit_price': (producto.precio * 100), // El precio del producto en centavos
			'name': producto.nombre + '-' + producto._id, // Se establece el nombre del articulos
		});
	}

	let customerInfo = {
		'name': nombre, // Se agrega el nombre del usuario
		'email': pedido.usuario.email, // Se agrega el email del usuario
		'phone': pedido.usuario.direccionEnvio.telefono, // Se agrega el telefono del usuario
	};

	let paymentMethod = {type: type};

	// Se verifica el tipo de pago
	if(type == 'card') {
		customerInfo.customer_id = pedido.usuario.customer.id // Se agrega el telefono del usuario
		paymentMethod.payment_source_id = pedido.usuario.customer.tokenId;
	}

	// Json para crear la orden
	let jsonConekta = {
		'line_items': items, // Se agrega la lista de articulos
		'shipping_lines': [{
			'amount': (precioEnvio * 100), // Se agrega el precio de envio en centavos
			'carrier': 'Sell-it'
		}],
		'currency': 'MXN',
		'customer_info': customerInfo,
		'shipping_contact': {
			'phone': pedido.usuario.direccionEnvio.telefono, // Se agrega el telefono del usuario
			'receiver': nombre, // Se agrega el nombre del usuario
			'address': { // Se agrega la direccion de envio del usuario
				'street1': pedido.usuario.direccionEnvio.calle,
				'city': pedido.usuario.direccionEnvio.municipio,
				'state': pedido.usuario.direccionEnvio.estado,
				'country': 'MX',
				'postal_code': pedido.usuario.direccionEnvio.codigoPostal.toString(),
				'residential': true
			}
		},
		'charges':[{
			'payment_method': paymentMethod
		}]
	};
	
	// Se retorna el json
	return jsonConekta;
}

module.exports = {
	
	crearPagoEfectivo: function (pedido, callback) {

		// Se genera la ordern
		conekta.Order.create(generarJsonOrden(pedido, 'oxxo_cash'), function(err, res) {

			// Se verifica si existe un error
			if(!err) {
				res = res.toObject();
			}
			
			callback(err, res);
		});
	},

	crearPagoTransferencia: function (pedido, callback) {
		// Se genera la ordern
		conekta.Order.create(generarJsonOrden(pedido, 'spei'), function(err, res) {
			// Se verifica si existe un error
			if(!err) {
				res = res.toObject();
			}			
			callback(err, res);
		});
	},

	crearPagoTarjeta: function (pedido, callback) {

		// Se genera la ordern
		conekta.Order.create(generarJsonOrden(pedido, 'card'), function(err, res) {

			// Se verifica si existe un error
			if(!err) {
				res = res.toObject();
			}
			
			callback(err, res);
		});
	},

	buscarCustomer: function(customerId, callback) {

		// Se invoca al servicio
		conekta.Customer.find(customerId, (err, customer) => {
			
			// Si ocurrio un error
			if(err) {
				return callback({success : false, message : err.message});
			}

			return callback({success : true, tarjeta : customer.toObject()});
		});
	},

	crearCustomer: function(usuario, tokenId, callback) {

		// Se recupera el nombre del usuario
		let nombre = usuario.email;

		// Se verifica si tiene un nombre
		if(usuario.nombreCompleto && usuario.apellidos) {
			nombre = usuario.nombreCompleto + ' ' + usuario.apellidos;
		}

		conekta.Customer.create({
			'name': nombre,
			'email': usuario.email,
			'phone': usuario.direccionEnvio.telefono,
			'payment_sources': [{
				'type': 'card',
				'token_id': tokenId
			}]
		}, function(err, customer) {

			if(!err) {
				customer = customer.toObject();
			}

			callback(err, customer);
		});
	}
};