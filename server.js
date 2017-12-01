const
	server = require( 'express' )(),
	jsonfile = require( 'jsonfile' ),
	port = 3000;

server.get( '/',function( req, res ){
	res.send( jsonfile.readFileSync('./package.json') );
});


// // server.use(express.static('public'));

server.listen( port, function(){
	console.log('Port ' + port );
});