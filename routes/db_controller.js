var mysql = require('mysql');
var info = require('../.db_config.json');

var queryOption = {"select":0, "insert":1, "update":2, "remove":3};

var connection = mysql.createConnection({
	host:info.host,
	port:info.port,
	user:info.user,
	password:info.password,
	database:info.database
});

connection.connect(function(err){
	if(err){
		console.error('sql connection error : '+err);
		throw err;
	}
});

exports.selectQuery = function(query, callback){
	requestQuery(query, queryOption.select , callback);
}

exports.insertQuery = function(tableName, value, callback){
	var query = "INSERT INTO " + tableName + " SET " + value;
	requestQuery(query, queryOption.insert, callback);
}

exports.updateQuery = function(tableName, strQuery, callback){
	var query = "UPDATE " + tableName + " SET " + strQuery;
	requestQuery(query, queryOption.update, callback);
}

exports.deleteQuery = function(tableName, strQuery, callback){
	var query = "DELETE FROM " + tableName + " WHERE " + strQuery;
	requestQuery(query, queryOption.remove, callback);
}

var requestQuery = function(query, option, callback){
	var keys = Object.keys(queryOption);
	connection.query(query, function(err, result){
		if(err){
			console.log('query err option : ' + keys[option] + ' && ' + JSON.stringify(err));
		}else{
			console.log('query option : ' + keys[option] + ' && ' + JSON.stringify(result) );
		}

		return callback(err, result);
	});
}
