//'use strict';
/*
const express = require('express');
const multipart = require('connect-multiparty');
const async = require('async');


//services
const productsLandingService = require('../../services/productsLandingService');
const router = express.Router();
*/
/* ----------------- GET PRODUCTO por ID ----------------- */
/*
router.get('productoslanding/:id', (req, res) => {	
	console.log("here")
	//Se obtiene el id del producto
	let idProducto = req.params.id;
	//Se invoca al servicio para buscar el producto
	productsLandingService.obtenerProductoPorId(idProducto, (result) => {
		if (result.err || !result.success) {
			return res.status(500).json({success: false, message: 'Error al consultar producto por id'});
		}	
		return res.status(200).json({success: true, message: 'Operacion exitosa', producto: result.producto});
	});		
});

module.exports = router;
*/
// Librerías externas
var express 		= require("express")
var router 			= express.Router()

var productsLandingService	= require("../../services/productsLandingService")
var categoriesLandingService = require("../../services/categoriesLandingService")
var usuarioService = require('../../services/usuario.service');
router.get("/products/:id",productsLandingService.obtenerProductoPorId)
router.post("/products/:id",productsLandingService.obtenerListaProductosCategoria)
router.get("/categories",categoriesLandingService.find)
router.get("/categorias_padre",categoriesLandingService.findAllFathers)
router.get("/categorias_hijo/:id",categoriesLandingService.findAllChildrensByFather)
router.get("/categorias_nieto/:id",categoriesLandingService.findAllGrandSonByFather)
router.post("/despertarservidor", (req, res) => {
	return res.status(200).json({success: true, message: 'Se ha despertado el servidor con exito'});
})
router.post("/recoverypassword",(req, res) => {
	console.log(req.body.email)
	let email = req.body.email; // Se obtiene la informacion del usuario

	// Se verifica el objeto usuario
	if(email) {

		let usuario = {email: email};

		// Se invoca al metodo ue busca al usuario
		usuarioService.buscarPorEmail(usuario.email, (result) => {

			// Se verifica si no hay error
			if(result && result.success) {

				// Se verifica si existe el usuario y si es de origen local
				if(result.usuario) {

					// Object user
					let usuarioData = {
						email: result.usuario.email,
						imagen: result.usuario.imagen,
						idOrigen: result.usuario.idOrigen,
						apellidos: result.usuario.apellidos,
						fechaRegistro: result.usuario.fechaRegistro,
						nombreCompleto: result.usuario.nombreCompleto,
					};
					
					// Se verifica si es de tipo local
					if(result.usuario.idOrigen == 1) {
						
						// Se invoca el servicio de recuperar contrasenia
						usuarioService.recuperarContrasenia(usuario, (result) => {

							// Se verifica si el objeto 
							if(result && result.success) {
								return res.status(200).json({success: true, message: 'Se ha recuperado la contrasenia', usuario: usuarioData});
							} else {
								log.error(fileJS, 'Error al recuperar la contraseña: ', result);
								return res.status(500).json({success: false, message: 'Error al recuperar la contrasenia'});
							}
						});
					} else {
						return res.status(200).json({success: true, message: 'El usuario es de facebook', usuario: usuarioData});
					}
				} else {
					return res.status(200).json(result);
				}
			} else {
				log.error(fileJS, 'Error al recuperar la contraseña: ', result);
				return res.status(500).json({success: false, message: 'Error al recuperar la contrasenia'});
			}
		});
	} else {
		log.error(fileJS, 'Error al recuperar la contraseña params invalidos');
		return res.status(500).json({success: false, message: 'Parametros invalidos'});
	}
});
// Exportar el módulo de rutas para API
module.exports = router