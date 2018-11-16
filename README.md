	Sell-it CORE APP

Core de procesamiento de toda la plataforma Sell-it.


- Estructura de la aplicación core Sell-it

		* Models --- Collections en Mongodb
		* Dao folder --- Contiene los controllers que utilizan los modelos para consultar o realizar cualquier operacion a la bd
		* Services folder --- Capa de servicios que funcionara como intermediario para la comunicacion entre controllers y daos entre otras libs que aplique
		* Routes folder --- Capa de controllers para acceder a los datos de servicio o procesamiento sobre algun recurso (api, pages, etc ...)
		* Public folder ---  Contendra asstes publicos para pages (no aplica su uso en este momento)
		* Views folder --- Vistas para pages (no aplica su uso en este momento)
		* node_modules folder --- Contiene los modulos y dependencias configurados en package.json
		* app file --- Archivo principal para la ejecucion del servidor con todas las dependencias y conexiones a la bd.
		* config file --- Archivo que contiene todas las configuraciones para el kore de Sell-it.
		* package.json --- Archivo de configuracion de dependencias o modulos necesarios para Sell-it
		* README.md --- Resumen para ambientar aplicación, conceptos y estructura de la aplicación core de Sell-it

Tecnologías definidas para este proyecto:

	- Node.js
	- Expressjs
	- MongoDB
	- Mongoose

Para que la aplicacion tome el ambiente (QA, desarrollo y produccion) es necesario crear una variable de entorno en el sistema llamada Sell-it_ENV, esta variable es obtenida desde el core para cargar las configuraciones correspondientes de acuerdo al ambiente.

Variable de entorno en SO Windows

	1.- Equipo > Click derecho > propiedades
	2.- En la nueva ventana seleccionar "Configuracion avanzada del sistema" 
	3.- Posteriormente seleccionar el botón "variables de entorno"
	4.- En la siguiente venta en la seccion de Variables del Sistema presionar botón "Nueva"
	5.- Colocar en el campo Nombre Variable "Sell-it_ENV" (Sin comillas)
	6.- Colocar en campo Valor Variable "development" para desarrollo local, "QA" para ambiente en heroku y "production" para ambiente en produccion (colocar valores sin comillas).

Ambiente de Desarrollo

1.- Clonar el repositorio
	
		git clone url-repositorio

2.- Instalar dependecias 
	
		npm install

3.- Ejecutar ambiente de desarrollo
	
		npm start

4.- Verificar ejecucion en puerto 3000
	
		http://localhost:3000





Ambiente de QA (Heroku y MLAB)

La base de datos Sell-it-dv se encuentra instalada en https://mlab.com,
dicho sitio permite crear bases de datos mongodb con un plan free.
Este sitio ofrece el path de conexion para ser utilizado por algun servicio externo
en este caso la aplicacion core utilizara este path para almacenar la informacion.

	mongodb://<dbuser>:<dbpassword>@ds135680.mlab.com:35680/Sell-it-dev

Para poder conectarse satisfactoriamente a la bd es necesario que se cuente con un usuario
dentro del dashboard de mlab.

El path de mongodb se establece en el archivo config para el ambiente QA con Heroku.

Para trabajar con Herokum fue necesario crear una app en su plataforma y relacionar 
el proyecto con su repositorio 

	https://git.heroku.com/Sell-it-core-app.git

Para crear la variable de entorno Sell-it_ENV en Heroku ejecutar lo siguiente:

		//Creacion de variable de sistema
		heroku config:set Sell-it_ENV=QA

		 //Verificar configuracion
		heroku config

		//obtener configuracion
		heroku config:get Sell-it_ENV

		//Eliminar configuracion
		 heroku config:unset Sell-it_ENV

Para poder usar este repositorio y deployar los cambios del proyecto es necesario lo siguiente

1.- Autenticacion heroku
	
		heroku login

2.- Agregar los cambios
		
		git add .

3.- Commit de los cambios

		git commit -am "make it better"

4.- Push cambios en gitlab y el repo de heroku
	
		git push heroku dev:master


REST API WEBHOOK para Conekta

		https://Sell-it-core-app.herokuapp.com/api/webhook
		
