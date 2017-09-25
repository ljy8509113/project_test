/**
 * http://usejsdoc.org/
 */
var dbManager = require('../routes/db_controller');

//users 관련 ////////////////////////////////////////
exports.selectUser = function(userId, callback){
	var query = "SELECT * FROM users WHERE user_id='" + userId + "'";
	select(query, callback);
}

//--------------------------------- ////////////////////////////////////////

//set_coin_trade 관련 //////////////////////////////////////// 
exports.selectCoinTrade = function(userId, callback){
	var query = "SELECT * FROM set_coin_trade WHERE user_id='"+userId +"'";
	select(query, callback);
}

exports.saveCoinTrade = function(userId, coinName, buy, sell, buyAmount, sellAmount, callback){
	var query = "SELECT * FROM set_coin_trade WHERE user_id='"+userId +"' AND coin_name='" + coinName +"'";
	select(query, function(err, result){
		if(err){
			callback(err, null);
		}else{
			if(result == ''){
				query = "(user_id, coin_name, buy, sell, buy_amount, sell_amount, status, time) VALUE ('" + userId +"','" + coinName + "'," + buy + ","+sell+ ","+ buyAmount+","+sellAmount+",0,NOW())";
				insert('set_coin_trade', query, callback);
			}else{
				query = "buy="+buy+",sell="+sell+",buy_amount="+buyAmount+",sell_amount="+sellAmount+",time=NOW() WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
				update('set_coin_trade',query, callback);
			}
		}
	});
}

exports.updateCoinTrade = function(userId, coinName, buy, sell, buyAmount, sellAmount, callback){
	var query = "buy="+buy+",sell="+sell+",buy_amount="+buyAmount+",sell_amount="+sellAmount+",time=NOW() WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
	update('set_coin_trade', query, callback);
}

exports.updateCoinTradeStatus = function(userId, coinName, status, callback){
	var query = "status="+status+" WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
	update('set_coin_trade', query, callback);
}

exports.removeCoinTrade = function(userId, coinName, callback){
	var query = "user_id='"+userId+"' AND coin_name='"+coinName+"';";
	remove('set_coin_trade', query, callback);
}
//---------------------------------------- ////////////////////////////////////////

function select(query, callback){
	dbManager.selectQuery(query, function(err, result){
		if(err){
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

function insert(table, query, callback){
	dbManager.insertQuery(table, query, function(err, result){
		if(err){
			callback(err, false);
		}else{
			callback(null, true);
		}
	});	
}

function update(table, query, callback){
	dbManager.updateQuery(table, query, function(err,result){
		if(err){
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

function remove(table, query, callback){
	dbManager.deleteQuery(table, query, function(err, result){
		if(err){
			callback(err, null);
		}else{
			callback(null, result);
		}
	});
}

