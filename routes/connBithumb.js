var request = require('request');
var coinData = require('../data/coinData');
require('date-utils');
var dbManager = require('./db_controller');
var bithumbUserAPI = require('./bithumbUserAPI');
var common = require('../data/common');

//헤더 부분
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

exports.requestCoinPrice = function(arrayCoin, isSave, dicBefore, callback){
	var options = {
		    url: 'https://api.bithumb.com/public/ticker/ALL',
		    method:'GET',
		    headers: headers,
		    qs: {}
		}
		 
	// 요청 시작 받은값은 body
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        var accountObj = JSON.parse(body);

	        var result = parseInt(accountObj.status);
	        console.log("result : " + result);
	        
	        if(result == 0){
	        	var time = accountObj.data.date;
	        	var currentCount = 0;
	        	var arrayResult = [];
	        	
	        	for(var i=0; i<arrayCoin.length; i++){
        			var data = accountObj.data[arrayCoin[i]];
        			var coin = new coinData(arrayCoin[i], data.buy_price, new Date(parseInt(time)));
        			arrayResult.push(coin);
        		}
	        	
	        	if(isSave){
	        		if(arrayResult.length > 0)
	        			saveCoinData(0, arrayResult, dicBefore, callback);
	        	}else{
	        		return callback(null, arrayResult);
	        	}
		    }else{
		    	return callback(error, "fail");	
		    }
	    }
	});
}

function saveCoinData(index, array, dicBefore, callback){
	var coin = array[index];
	var query = "SELECT * FROM coin_price_bithumb WHERE coin_name='" + coin.getCoinName() +"' AND key_time="+coin.getKeyTime();
	var current = index;
	console.log('sele q : ' + query);
	dbManager.selectQuery(query, function(err, result){
		if(err){
			
		}else{
			console.log(JSON.stringify(result));
			if(result.length == 0){
				query = coin.getInsertQuery(dicBefore);
				console.log('insert : ' + query);
				dbManager.insertQuery("coin_price_bithumb", query, function(err, result){
					if(current == (array.length - 1)){
						return callback(null, array);
					}else{
						saveCoinData(current+1, array, callback);
					}
				});
			}else{
				query = coin.getUpdateQuery(dicBefore);
				dbManager.updateQuery("coin_price_bithumb", query, function(err, result){
					if(current == (array.length - 1)){
						return callback(null, array);
					}else{
						saveCoinData(current+1, array, callback);
					}
				});
			}
		}
	});
}

exports.requestUser = function(secretKeyValue, apiKeyValue, coinName, callback){
	var api = new bithumbUserAPI(apiKeyValue, secretKeyValue);
	var rgParams = { currency:coinName };
	
	api.apiCall('/info/account', rgParams, function(err, result){
		console.log('callback : ' + JSON.stringify(result));
		return callback(err, result);	
		
	});
}

exports.requestUserWallet = function(user, callback){
	var api = new bithumbUserAPI(user.getBitApi(), user.getBitSecret());
	var rgParams = { currency:'ALL' };
	
	api.apiCall('/info/balance', rgParams, function(err, result){
		console.log('callback : ' + JSON.stringify(result));
		return callback(err, result);	
		
	});
}
