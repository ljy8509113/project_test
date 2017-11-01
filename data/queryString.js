/**
 * http://usejsdoc.org/
 */
var dbManager = require('../routes/db_controller');

//users 관련 ////////////////////////////////////////
exports.selectUser = function(userId, callback){
	var query = "SELECT * FROM users WHERE user_id='" + userId + "'";
	select(query, callback);
}

exports.insertUser = function(userId, password, bitSecretKey, bitApiKey, userName, sKey, callback){
	var values = [userId.toString(), password.toString(), bitSecretKey.toString(), bitApiKey.toString(), userName.toString(), sKey.toString()];
	var valuesString = '';

	for(var i=0; i<values.length; i++ ){
		if((values.length - 1) == i){
			valuesString += "'" + values[i] + "'";
		}else{
			valuesString += "'" + values[i] + "',";
		}
	}
	var query = "(user_id, password, bit_secret_key, bit_api_key, user_name, s_key) VALUE ("+valuesString +")";
	insert('users', query, callback);
}

exports.updateFailCount = function(userId, count, callback){
	var query = "fail_password_cnt=" + count + " WHERE user_id='"+userId+"';";
	update('users', query, callback);
}

//--------------------------------- ////////////////////////////////////////

//coin_price_bithumb 관련 //////////////////////////////////////// 
exports.selectCoinPrice = function(coinName, keyTime, callback){
	var query = "SELECT * FROM coin_price_bithumb WHERE coin_name='" + coinName +"' AND key_time="+keyTime;
	select(query, callback);
}

exports.insertCoinPrice = function(coinName, price, time, keyTime, callback){
	var query = "(coin_name, time, price, key_time) VALUES ('" + coinName + "', '"+time+"', "+ price + ", " + keyTime + ")";
	insert('coin_price_bithumb', query, callback);
}

exports.updateCoinPrice = function(coinName, price, time, keyTime, callback){
	var query = "coin_name = '" + coinName.toString() + "', time='" + time + "', price="+ price + ", key_time=" + keyTime + " WHERE key_time="+keyTime+" AND coin_name='" + coinName.toString() + "';";
	update('coin_price_bithumb', query, callback);
}
//--------------------------------- ////////////////////////////////////////

////set_coin_trade 관련 //////////////////////////////////////// 
//exports.selectCoinTrade = function(userId, callback){
//	var query = "SELECT * FROM set_coin_trade WHERE user_id='"+userId +"'";
//	select(query, callback);
//}
//
//exports.saveCoinTrade = function(userId, coinName, buy, sell, buyAmount, sellAmount, callback){
//	var query = "SELECT * FROM set_coin_trade WHERE user_id='"+userId +"' AND coin_name='" + coinName +"'";
//	select(query, function(err, result){
//		if(err){
//			callback(err, null);
//		}else{
//			if(result == ''){
//				query = "(user_id, coin_name, buy, sell, buy_amount, sell_amount, status, time) VALUE ('" + userId +"','" + coinName + "'," + buy + ","+sell+ ","+ buyAmount+","+sellAmount+",0,NOW())";
//				insert('set_coin_trade', query, callback);
//			}else{
//				query = "buy="+buy+",sell="+sell+",buy_amount="+buyAmount+",sell_amount="+sellAmount+",time=NOW() WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
//				update('set_coin_trade',query, callback);
//			}
//		}
//	});
//}
//
//exports.updateCoinTrade = function(userId, coinName, buy, sell, buyAmount, sellAmount, callback){
//	var query = "buy="+buy+",sell="+sell+",buy_amount="+buyAmount+",sell_amount="+sellAmount+",time=NOW() WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
//	update('set_coin_trade', query, callback);
//}
//
//exports.updateCoinTradeStatus = function(userId, coinName, status, callback){
//	var query = "status="+status+" WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
//	update('set_coin_trade', query, callback);
//}
//
//exports.removeCoinTrade = function(userId, coinName, callback){
//	var query = "user_id='"+userId+"' AND coin_name='"+coinName+"';";
//	remove('set_coin_trade', query, callback);
//}
//---------------------------------------- ////////////////////////////////////////

//auto_trade 관련 //////////////////////////////////////// 
exports.selectAutoTrade = function(userId, callback){
	var query = "SELECT * FROM auto_trade WHERE user_id='"+userId +"'";
	select(query, callback);
}

exports.saveAutoTrade = function(userId, coinName, buy, sell, amount, status, callback){
	var query = "SELECT * FROM auto_trade WHERE user_id='"+userId +"' AND coin_name='" + coinName +"';";
	select(query, function(err, result){
		if(err){
			callback(err, null);
		}else{
			if(result == ''){
				query = "(user_id, coin_name, buy, status, amount, sell) VALUE ('"+userId+"','"+coinName+"',"+buy+","+status+","+amount+","+sell+");";
				insert('auto_trade', query, callback);
			}else{
				query = "sell="+sell+",buy="+buy+",status="+status+",amount='"+amount+"' WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
				update('auto_trade', query, callback);
			}
		}
	});
}

exports.updateAutoTradeStatus = function(userId, coinName, status, callback){
	var query = "status="+status+" WHERE user_id='"+userId+"' AND coin_name='"+coinName+"';";
	update('auto_trade', query, callback);
}

exports.removeAutoTrade = function(userId, coinName, callback){
	var query = "user_id='"+userId+"' AND coin_name='"+coinName+"';";
	remove('auto_trade', query, callback);
}

exports.selectAllAutoData = function(callback){
	var query = "SELECT auto_trade.user_id, auto_trade.coin_name, buy, status, amount bit_secret_key, bit_api_key, FROM auto_trade JOIN users ON auto_trade.user_id = users.user_id;";
	select(query, callback);
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


