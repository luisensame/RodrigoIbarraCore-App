'use strict';

const express = require('express');

//services
const reseniaService = require('../../services/resenia.service');
const pedidoService = require('../../services/pedido.service');

// Configuracion
const config = require('../../config');

const reseniaRouter = express.Router();

/* ----------------- POST CREACION DE RESEÑA DEL PRODUCTO ----------------- */
reseniaRouter.post('/', (req, res) => {				
	//se obtienen los datos de reseña
	var reseniaParams = req.body.resenia;

	console.log('reseniaParams: ', reseniaParams);

	//Primero se actualiza el producto del pedido a entregado
	pedidoService.actualizarEstatusEntregaProductoPedido(reseniaParams.idPedido, reseniaParams.idProducto, 2, function (result){
		console.log('result actualizarEstatusEntregaProductoPedido: ', result);
		//Si se actualizo correctamente se registra la reseña del producto
		if (result.success) {
			var resenia = {
				producto: reseniaParams.idProducto,
				usuario: reseniaParams.usuario,
				calificacion: reseniaParams.calificacion
			};
			//Proceso para almacenar la reseña en bd
			reseniaService.registrarResenia(resenia, function (resultResenia){
				console.log('resultResenia: ', resultResenia);
				if (!resultResenia.success) {
					return res.status(500).json({success: false, message: 'Error al registrar reseña del producto'});
				}
				return res.status(200).json({success: true, message: 'Reseña de producto exitosa.'});
			});		
		}else{
			return res.status(500).json({success: false, message: 'Error al marcar producto como entregado'});
		}
	});
});

/**
 * GET [Ruta que obtiene 10 reseñas ordenadas por fecha]
 */
reseniaRouter.get('/:idProducto', (req, res) => {

	// Se obtiene el id de producto
	const idProducto = req.params.idProducto;

	// Se verifica si el parametro existe
	if(idProducto) {

		// Se invoca el servicio
		reseniaService.obtenerListaReseniaPorId(idProducto, config.resenia.offset, config.resenia.noElementos, (result) => {

			//Si se actualizo correctamente se registra la reseña del producto
			if(result.success && !result.err) {
				//Proceso para almacenar la reseña en bd
				return res.status(200).json({success: true, listaResenia: result.listaResenia,
					message: 'Se obtiene la lista de resenias'});
			} else {
				return res.status(500).json({success: false, 
					message: 'Ocurrio un error al obtener la lista de resenias'});
			}
		});
	} else {
		return res.status(500).json({success: false, parametros: true, message: 'Parametros invalidos'});
	}
});

module.exports = reseniaRouter;