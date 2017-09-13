var dbManager = require('./db_controller');
var userInfo = require('../data/userInfo');
var coinData = require('../data/coinData');
var connBithumb = require('./connBithumb');
var common = require('../data/common');
var autoData = require('../data/autoCoinData');

var _isEndQuery = false;
var _isEndRequest = false;
var info;
var dicAutoCoin;
var coinPrice;

exports.initMain = function(req, res, user_id, isFirst){
	var query = "SELECT * FROM users WHERE user_id='" + user_id + "'";
	
	dicAutoCoin = {};	
	coniPrice = [];
	
	dbManager.selectQuery(query, function(err, result){
		if(err){
			res.render('error',{error:err});
		}else{
			query = "SELECT * FROM set_coin_trade WHERE user_id='"+user_id+"'";
			dbManager.selectQuery(query, function(err, result){
				if(err){
					res.render('error',{error:err});
				}else{
					if(result){
						for(var i=0; i<result.length; i++){
							var data = new autoData(result[i].coin_name, result[i].buy, result[i].sell, true, result[i].time, result[i].buy_price, result[i].sell_amount);
							dicAutoCoin[result[i].coin_name] = data;
						}
					}
				}
				
				_isEndQuery = true;
				resultInit(res);
			});
			
			info = new userInfo(result[0].user_id, result[0].bit_secret_key, result[0].bit_api_key, result[0].auto_setting_list, result[0].user_name);
			var coinName = [];
			var arrayCoin = common.getCoinCodeList();
			
			for(var i=0; i<arrayCoin.length; i++){
				coinName.push(common.getCoinName(arrayCoin[i]));
			}
			
			connBithumb.requestCoinPrice(arrayCoin, false, function(err, result){
				if(err){
					res.render('error',{error:err});
				}else{
					coinPrice = result;
				}
				
				_isEndRequest = true;
				resultInit(res);
			});
			
//			connBithumb.requestUserInfo('','', function(err, result){
//				if(err){
//					
//				}else{
//					console.log('main result : ' + result);
//				}
//			});
		}
	});
}


function resultInit(res){
	if(_isEndRequest && _isEndQuery){
		_isEndRequest = false;
		_isEndQuery = false;
		
		res.render('main',{data:info, arrayPrice:coinPrice, dicSettingCoin:dicAutoCoin});
	}
}


