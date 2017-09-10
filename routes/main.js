var dbManager = require('./db_controller');
var userInfo = require('../data/userInfo');
var request = require('request');

var arrayCoin = ["BTC", "ETH", "DASH", "LTC", "ETC", "XRP", "BCH", "XMR"];

// 헤더 부분
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

exports.initMain = function(req, res, user_id, isFirst){
	var query = "SELECT * FROM users WHERE user_id='" + user_id + "'";
	var info;

	dbManager.selectQuery(query, function(err, result){
		if(err){

		}else{
			info = new userInfo(result[0].user_id, result[0].bit_cer_key, result[0].bit_api_key, result[0].auto_setting_list, result[0].user_name);
			var coinName = [];
			for(var i=0; i<arrayCoin.length; i++){
				coinName.push(info.getCoinName(arrayCoin[i]));	
			}
			
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
			        	var data = accountObj.data;
			        	var bitCoin = data.BTC;	
			        	console.log('BTC : ' + JSON.stringify(bitCoin));

			        }else{
			        	
			        }

			        res.render('main',{data:info, coinNames:coinName});
			    }
			});
			
		}
	});
				
}
