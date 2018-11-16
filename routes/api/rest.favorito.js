'use strict';

const express = require('express');

//services
const favoritoService = require('../../services/favorito.service');

const favoritoRouter = express.Router();

/* ----------------- GET TOTAL FAVORITOS ----------------- */
favoritoRouter.get('/total/:email', (req, res) => {

	// Se obtiene el email
	let email = req.params.email;

	// Se verifica si el email existe
	if(email) {

		// Se invoca al servicio
		favoritoService.obtenerTotalFavoritos(email, (result) => {

			// Se verifica si no ocurrio un error
			if(result && result.success) {
				return res.status(200).json({
					success: true,
					message: 'Se obtiene el total de favoritos',
					total: result.total
				});
			} else {
				return res.status(500).json({
					success: false,
					message: 'Ocurrio un error al obtener el total de favoritos'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametro invalido'
		});
	}
});

/* ----------------- POST REGISTRO FAVORITOS ----------------- */
favoritoRouter.post('/', (req, res) => {

	// Se obtiene el email
	let favorito = req.body;

	// Se verifica si el email existe
	if(favorito && favorito.email && favorito.producto) {

		// Se invoca el servicio
		favoritoService.verificarProductoFavorito(favorito, (result) => {
			
			// Se verifica si 
			if(result && result.success) {

				// Se verifica si el producto aun no es agregado como favorito
				if(!result.favorito || (Array.isArray(result.favorito) && result.favorito.length == 0)) {

					// Se invoca al servicio
					favoritoService.registrarFavorito(favorito, (result) => {

						// Se verifica si no ocurrio un error
						if(result && result.success) {
							return res.status(200).json({
								success: true,
								message: 'Se registro correctamente el producto como favorito',
							});
						} else {
							return res.status(500).json({
								success: false,
								message: 'Ocurrio un error al registrar el producto como favorito'
							});
						}
					});
				} else {
					//when error
					return res.status(200).json({
						success: true,
						favorito: result.favorito,
						message: 'Ya se ha agregado el producto como favorito',
					});
				}
			} else {
				//when error
				return res.status(500).json({
					success: false,
					message: 'Ocurrio un error al registrar favoritos'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametros invalidos'
		});
	}
});

/* ----------------- GET TOTAL FAVORITOS ----------------- */
favoritoRouter.get('/', (req, res) => {

	// Se verifica si el email existe
	if(typeof req.query.offSet !== 'undefined' && typeof req.query.email !== 'undefined'
		&& typeof req.query.noElementos !== 'undefined') {

		let favorito = {
			email: req.query.email,
			offSet: parseInt(req.query.offSet),
			noElementos: parseInt(req.query.noElementos)
		};

		// Se invoca al servicio
		favoritoService.obtenerFavoritos(favorito, (result) => {

			// Se verifica si no ocurrio un error
			if(result && result.success) {
				return res.status(200).json({
					success: true,
					favoritos: result.favoritos,
					message: 'Se obtiene el total de favoritos'
				});
			} else {
				return res.status(500).json({
					success: false,
					message: 'Ocurrio un error al obtener el total de favoritos'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametro invalido'
		});
	}
});

/* ----------------- DELETE FAVORITO ----------------- */
favoritoRouter.delete('/:id', (req, res) => {

	// Se verifica si el email existe
	if(req.params.id) {

		// Se invoca al servicio
		favoritoService.eliminarFavoritoPorId(req.params.id, (result) => {

			// Se verifica si no ocurrio un error
			if(result && result.success) {
				return res.status(200).json({
					success: true,
					message: 'Fue eliminado un producto como favorito'
				});
			} else {
				return res.status(500).json({
					success: false,
					message: 'Ocurrio un error al eliminar un producto como favorito'
				});
			}
		});
	} else {
		//when error
		return res.status(500).json({
			success: false,
			message: 'Parametro invalido'
		});
	}
});

module.exports = favoritoRouter;