var server = require('./bin/www');
var request = require('request');
var coinData = require('./data/coinData');
var autoData = require('./data/autoCoinData');
require('date-utils');
var dbManager = require('./routes/db_controller');
var bithumbUserAPI = require('./routes/bithumbUserAPI');
var common = require('./data/common');
var connBithumb = require('./routes/connBithumb');

var _arrayUsers = [];
var _autoData = [];
var _isGetData = false;

var startTimer = setInterval(function(){
	var time = new Date();
	var min = time.toFormat('MI');
	var sec = time.toFormat('SS');
	console.log('check ----- ');
	
	if(!_isGetData){
		_isGetData = true;
		var query = "SELECT user_id, coin_name, buy, sell, time, buy_price, sell_amount, bit_secret_key, bit_api_key FROM set_coin_trade JOIN users ON set_coin_trade.user_id = users.user_id;";
		dbManager.selectQuery(query, function(err, result){
			if(err){
				
			}else{
				if(result.length == 0){
					
				}else{
					for(var i=0; i<result.length; i++){
						var coinData = new autoCoinData(result[i].coin_name, result[i].buy, result[i].sell, result[i].time, result[i].buy_price, result[i].sell_amount, result[i].bit_secret_key, result[i].bit_api_key);
						_arrayUsers.push(coinData);
					}
				}
			}
		});
	}else{
		if( min % 3 == 0 && sec == 0){
			console.log('start - ');
			clearInterval(startTimer);
			requestPrice();
			autoTimer();
		}
	}
}, 1000);

function autoTimer(){
	setInterval(function(){
		requestPrice();
	}, 180000);
}

function requestPrice(){
	console.log('timer : ' + new Date());
	connBithumb.requestCoinPrice(common.getCoinCodeList(), true, function(err, result){
		if(err){
			//res.render('error',{error:err});
		}else{
			console.log('requestCoinPrice end : ' + JSON.stringify(result));
			var array = common.getCoinCodeList();
			var dic = {};
			
			for(var i=0; i<result.length; i++){
				dic[result[i].getCoinName()] = result[i].getPrice();
			}
			
		}
	});
}

function getUserData(){
	dbManager.selectQuery();
}




