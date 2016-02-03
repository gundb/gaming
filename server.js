var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 80;

var Gun = require('gun');
var gun = Gun({ 
	file: false,
	wire: {put: function(g,cb){
		cb("Gaming server is in memory only.");
	},get: function(lex,cb){
		var soul = lex[Gun._.soul];
		var node = gun.__.graph[soul];
		console.log("GET", soul, node);
		if(!node){
			return cb(null);
		}
		cb(null, node);
		cb(null, Gun.is.node.soul.ify({}, soul));
		cb(null, {});
	}}
});

var server = require('http').createServer(function(req, res){
	if(gun.wsp.server(req, res)){ 
		return; // filters gun requests!
	}
	require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error',function(){ // static files!
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(require('fs').readFileSync(require('path').join(__dirname, 'index.html'))); // or default to index
	}).pipe(res); // stream
});
gun.wsp(server);
server.listen(port);

console.log('Server started on port ' + port + ' with /gun');
