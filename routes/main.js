var dbManager = require('./db_controller');

var name = '';
var bitCerKey = '';
var bitApiKey = '';

exports.initMain = function(req, res, name, isFirst){
	res.render('main',{user:name});
}
