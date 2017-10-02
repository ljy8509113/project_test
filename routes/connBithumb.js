var request = require('request');
var coinData = require('../data/coinData');
require('date-utils');
var dbManager = require('./db_controller');
var bithumbUserAPI = require('./bithumbUserAPI');
var common = require('../data/common');
var query = require('../data/queryString');

//헤더 부분
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

exports.requestAllCoinPrice = function(arrayCoin, callback){
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
        			var coin = new coinData(arrayCoin[i], data.buy_price, new Date(parseInt(time)), 0);
        			arrayResult.push(coin);
        		}
	        	
//	        	if(isSave){
//	        		if(arrayResult.length > 0)
//	        			saveCoinData(0, arrayResult, callback);
//	        	}else{
//	        		return callback(null, arrayResult);
//	        	}
	        	return callback(null, arrayResult);
		    }else{
		    	return callback(error, "fail");	
		    }
	    }
	});
}

//function saveCoinData(index, array, callback){
//	var coin = array[index];
////	var query = "SELECT * FROM coin_price_bithumb WHERE coin_name='" + coin.getCoinName() +"' AND key_time="+coin.getKeyTime();
//	var current = index;
//	console.log('sele q : ' + query);
//	
//	query.selectCoinPrice(coin.getCoinName(), coin.getKeyTime(), function(err, result){
//		if(err){
//			
//		}else{
//			console.log(JSON.stringify(result));
//			if(result == ''){
//				query.insertCoinPrice(coin.getCoinName(), coin.getPrice(), coin.getTime(), coin.getKeyTime(), function(err, result){
//					if(current == (array.length - 1)){
//						return callback(null, array);
//					}else{
//						saveCoinData(current+1, array, callback);
//					}
//				});
//			}else{
//				query.updateCoinPrice(coin.getCoinName(), coin.getPrice(), coin.getTime(), coin.getKeyTime(), function(err, result){
//					if(current == (array.length - 1)){
//						return callback(null, array);
//					}else{
//						saveCoinData(current+1, array, callback);
//					}
//				});
//			}
//		}
//	});
//}

exports.requestCoinPrice = function(coin, callback){
	var options = {
		    url: 'https://api.bithumb.com/public/ticker/',
		    method:'GET',
		    headers: headers,
		    qs: {coin}
		}
		 
	// 요청 시작 받은값은 body
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        var accountObj = JSON.parse(body);

	        var result = parseInt(accountObj.status);
	        console.log("result : " + JSON.stringify(accountObj));
	        
	        if(result == 0){
	        	var nowPrice = accountObj.data.buy_price;
	        	return callback(null, nowPrice);
	        	
		    }else{
		    	return callback(error, "fail");	
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

var _requestCurrentCount = 0;
var _requestEndCount = 0;

exports.requestAllTradeHistory = function(arrayCoin, callback){
	_requestEndCount = arrayCoin.length;
	var limitedDate = new Date();
	limitedDate.setDate( limitedDate.getDate() - 30 );
	console.log('30 after : ' + limitedDate);
	
	for(var i=0; i<arrayCoin.length; i++){
		query.selectLastTradeKey(function(err, result){
			if(err){
				
			}else{
				requestTradeHistory(arrayCoin[i], 0, result, limitedDate, function(err, result){
					if(err){
						
					}else{
						
					}
				});
			}
		});
		
	}
}

function requestTradeHistory(coinName, index, lastKey, limitedDate, callback){
	var urlString = 'https://api.bithumb.com/public/recent_transactions/' + coinName + "/";
	var li
	var options = {
		    url: urlString,
		    method:'GET',
		    headers: headers,
		    qs: {'offset':index, 'count':100}
		}
		 
	// 요청 시작 받은값은 body
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        var accountObj = JSON.parse(body);

	        var result = parseInt(accountObj.status);
	        console.log("result : " + JSON.stringify(accountObj));
	        
	        if(result == 0){
//	        	var nowPrice = accountObj.data.buy_price;
//	        	return callback(null, nowPrice);
	        	
	        	var data = accountObj.data;
	        	
	        	for(var i=0; i<data.length; i++){
	        		resData = data[i];
	        		
	        	}
	        	
		    }else{
		    	return callback(error, "fail");	
		    }
	    }
	});
}





