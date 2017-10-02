var server = require('./bin/www');
var request = require('request');
var coinData = require('./data/coinData');
var autoCoinData = require('./data/autoCoinData');
require('date-utils');
var dbManager = require('./routes/db_controller');
var bithumbUserAPI = require('./routes/bithumbUserAPI');
var common = require('./data/common');
var connBithumb = require('./routes/connBithumb');
var query = require('./data/queryString');

var _arrayUsers = [];
var _autoData = [];
var _isGetData = false;
var _arrayRequestCoin = [];

var startTimer = setInterval(function(){
	var time = new Date();
	var min = time.toFormat('MI');
	var sec = time.toFormat('SS');
	console.log('check ----- ');
	
	if(!_isGetData){
		_isGetData = true;

		query.selectAllAutoData(function(err, result){
			if(err){
				console.log('not auto data');
			}else{
				if(result == ''){
					console.log('not auto data');
				}else{
					for(var i=0; i<result.length; i++){
//						var coinData = new autoCoinData(result[i].coin_name, result[i].buy, result[i].sell, result[i].time, result[i].buy_price, result[i].sell_amount, result[i].bit_secret_key, result[i].bit_api_key, result[i].status);
						var coinData = new autoCoinData(result[i].coin_name, result[i].buy, result[i].user_id, secret, api, result[i].status, result[i].amount, result[i].is_before_data);
						setUserDataArray(coinData);
					}
					
					for(var i=0; i<_arrayUsers.length; i++){
						var isAdd = false;
						
						if(_arrayRequestCoin.length == 0){
							_arrayRequestCoin.push(_arrayUsers[i].getCoinName());
						}else{
							for(var j=0; j<_arrayRequestCoin.length; j++){
								if( _arrayRequestCoin[j] == _arrayUsers[i].getCoinName() ){
									isAdd = true;
								}
							}
							
							if(!isAdd){
								_arrayRequestCoin.push(_arrayUsers[i].getCoinName());
							}
							
						}
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
//	connBithumb.requestAllCoinPrice(common.getCoinCodeList(), function(err, result){
//		if(err){
//			//res.render('error',{error:err});
//			console.log('requestPrice err : ' + JSON.stringify(err));
//		}else{
//			console.log('requestCoinPrice end : ' + JSON.stringify(result));
//			var array = common.getCoinCodeList();
//			var dic = {};
//			
//			for(var i=0; i<result.length; i++){
//				dic[result[i].getCoinName()] = result[i].getPrice();
//			}
//			
//			if(_arrayUsers.length > 0){
//				checkTradePrice(dic);
//			}
//		}
//	});
	
	
	connBithumb.requestAllTradeHistory(_arrayRequestCoin, function(err, result){
		if(err){
			
		}else{
			
		}
	});
}


function checkTradePrice(dicCurrent){
	for(var i = _arrayUsers.length; i >= 0; i--){
		var data = _arrayUsers[i];
		var price = dicCurrent[data.getCoinId()];
		
		if(price != null && price != 'undefined'){
			if(data.getStatus() == 0){
				//구매 진행해야 하는 상태
				if(data.getBuy() >= price){
					
				}
			}else{
				//판매 진행해야 하는 상태
				if(data.getSell() <= price){
					
				}
			}
		}
	}
}

function setUserDataArray(data){
	if(_arrayUsers.length == 0){
		_arrayUsers.push(data);	
	}else{
		for(var i=0; i<_arrayUsers.length; i++){
			if(_arrayUsers[i].getUserId() == data.getUserId() && _arrayUsers[i].getCoinName() == data.getCoinName() && _arrayUsers[i].getIsBefore() == data.getIsBefore()){
				_arrayUsers[i] = data;
			}else{
				_arrayUsers.push(data);
			}
		}
	}
}

exports.updateData = function(data){
	console.log('updateData : ' + data);
	setUserDataArray(data);
}




