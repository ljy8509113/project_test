var request = require('request');
var coinData = require('../data/coinData');
require('date-utils');
var dbManager = require('./db_controller');

//헤더 부분
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

exports.requestCoinPrice = function(arrayCoin, isSave, callback){
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
	        		
	        		if(data){
//	        			console.log(arrayCoin[i] + ' >>>>> ' +JSON.stringify(data));
	        			var coin = new coinData(arrayCoin[i], data.buy_price, new Date(parseInt(time)));
	        			console.log('key time : ' + coin.getKeyTime());
	        			arrayResult.push(coin);
	        			
	        			if(isSave){
	        				var query = "SELECT * FROM coin_price_bithumb coin_name='" + coin.getCoinName() +"' WHERE key_time='"+coin.getKeyTime()+"'";
	        				dbManager.selectQuery(query, function(err, result){
	        					if(err){
	        						endCount += 1;
	        					}else{
	        						if(result){
	        							query = coin.getInsertQuery();
	        							dbManager.insertQuery("coin_price_bithumb", query, function(err, result){
	        								if(err){
	        									resultCheck(arrayResult, currentCount += 1, arrayCoin.length);
	        								}else{
	        									resultCheck(arrayResult, currentCount += 1, arrayCoin.length);
	        								}
	        							});
	        						}else{
	        							query = coin.getUpdateQuery();
	        							dbManager.insertQuery("coin_price_bithumb", query, function(err, result){
	        								if(err){
	        									resultCheck(arrayResult, currentCount += 1, arrayCoin.length);
	        								}else{
	        									resultCheck(arrayResult, currentCount += 1, arrayCoin.length);
	        								}
	        							});
	        						}
	        					}
	        				});
	        			}else{
	        				
	        			}
	        			
	        		}
	        	}
	        	
	        	return(null, "success");
		    }else{
		    	return(error, "fail");	
		    }
		    
	        
	    }
	});
}

function resultCheck(arrayResult, current, end){
	if(end == current){
		return arrayResult;
	}
}

//{
//    "status": "0000",
//    "data": {
//        "opening_price" : "504000",
//        "closing_price" : "505000",
//        "min_price"     : "504000",
//        "max_price"     : "516000",
//        "average_price" : "509533.3333",
//        "units_traded"  : "14.71960286",
//        "volume_1day"   : "14.71960286",
//        "volume_7day"   : "15.81960286",
//        "buy_price"     : "505000",
//        "sell_price"    : "504000",
//        "date"          : 1417141032622
//    }
//}
