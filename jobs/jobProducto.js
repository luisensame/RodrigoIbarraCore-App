'use strict';
const express = require('express');
const cronJob = require('cron').CronJob;

// Libs
const async = require('async');

// Services
const mailService = require('../services/mail.service');
const productoService = require('../services/producto.service');

// Configuracion
const config = require('../config');

function desactivarProducto() {

	new cronJob({
		cronTime: config.cron.cronTimeDesactivarProducto, // Se define en que tiempo se ejecuta el cron
		onTick: function() {

			async.waterfall([

				// Funcion que obtiene una lista de productos expirados
				(callback) => {

					// Se invoca al servicio	
					productoService.obtenerListaProductosExpirados((result) => {

						// Se verifica si no ocurrio un error
						if(result.success) {
							callback(null, null, result.productos);
						} else {
							callback(null, result.err, null);
						}
					});
				}, 

				// Funcion que desactiva una lista de productos
				(err, productos, callback) => {
					
					// Se verifica si no ocurrio un error
					if(err) return callback(err, null);

					// Se verifica si la lista de productos tiene un elemento
					if(productos && productos.length > 0) {

						let listaProductos = [];

						// Se itera la lista
						for(let i = 0; i < productos.length; i++) {
							listaProductos.push({_id: productos[i]._id});
						}

						// Se invoca al servicio	
						productoService.desactivarListaProductos(listaProductos, (result) => {

							// Se verifica si no ocurrio un error
							if(result.success) {
								callback(null, {success: true, listaProductos: productos});
							} else {
								callback(result.err, null);
							}
						});

					} else {
						callback(null, {success: true});
					}
				}
			], (err, result) => {
				
				let mailData = {
					email: config.mantenimiento.email,
					options: {to: config.mantenimiento.email},
				};

				// Se verifica si ocurrio un error
				if(err) {
					mailData.error = err;
					mailService.notificarErrorDesactivacionProducto(mailData);
				} else if(result.listaProductos) {
					mailData.listaProductos = result.listaProductos;
					mailService.notificarDesactivacionProducto(mailData);
				}
			});
		},
		start: config.cron.start,
		timeZone: config.cron.timeZone
	});
}

desactivarProducto();