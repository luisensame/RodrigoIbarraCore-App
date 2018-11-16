'use strict';

const express = require('express');

//services
const catalogoEstadoService = require('../../services/catalogo.estado.service');

const catalogoEstadoRouter = express.Router();

/* ------------------------ GET information catalogo de metodo de pago ------------------------ */
catalogoEstadoRouter.get('/', (req, res) => {

	// Invoque service user
	catalogoEstadoService.findAll((result) => {

		// If request is correct
		if (result.success) {
			//when success
			return res.status(200).json({
				success: true,					
				message: 'success request catalogo estados',
				catalogo: result.catalogo
			});
		}

		//when error
		return res.status(500).json({
			success: false,
			message: 'Error to get catalogo estados'
		});
	});	
});

module.exports = catalogoEstadoRouter;