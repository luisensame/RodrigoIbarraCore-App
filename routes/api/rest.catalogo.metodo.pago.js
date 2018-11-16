'use strict';

const express = require('express');

//services
const catalogoMetodoPagoService = require('../../services/catalogo.metodo.pago.service');

const catalogoMetodoPagoRouter = express.Router();

/* ------------------------ GET information catalogo de metodo de pago ------------------------ */
catalogoMetodoPagoRouter.get('/', (req, res) => {

	// Invoque service user
	catalogoMetodoPagoService.findAll((result) => {

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

module.exports = catalogoMetodoPagoRouter;