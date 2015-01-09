var express = require('express');
var DOCUMENT_ROOT = '../dist';
var PORT =  3100;

var app = express();
app.configure(function () {

		//app.use( puer.connect(app, server, options) )
	    app.use( express.bodyParser() );
	    app.use( express.static(DOCUMENT_ROOT) );
	});
app.listen( PORT );

console.log("process.pid", process.pid);
console.log("Node server started at port " + PORT);