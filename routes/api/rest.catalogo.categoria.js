'use strict';

const express = require('express');

//services
const catalogoCategoriaService = require('../../services/catalogo.categoria.producto.service');

const catalogoCategoriaRouter = express.Router();

/* ------------------------ GET information categorias de producto ------------------------ */
catalogoCategoriaRouter.get('/', (req, res) => {

	// Invoque service user
	catalogoCategoriaService.find((result) => {

		// If request is correct
		if (result.success) {				
			//when success
			return res.status(200).json({
				success: true,					
				message: 'success request',
				catalogo: result.catalogo
			});
		}

		//when error
		return res.status(500).json({
			success: false,
			message: 'Error to get catalogo'
		});
	});	
});

module.exports = catalogoCategoriaRouter;