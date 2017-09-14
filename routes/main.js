var dbManager = require('./db_controller');
var coinData = require('../data/coinData');
var connBithumb = require('./connBithumb');
var common = require('../data/common');
var autoData = require('../data/autoCoinData');
var userData = require('./userInfo');

var _isEndQuery = false;
var _isEndRequest = false;
var info;
var dicAutoCoin;
var coinPrice;
var userAssets;

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
			
			var secret = common.disarmedString(result[0].user_name, result[0].user_id, result[0].bit_secret_key);
			var api = common.disarmedString(result[0].user_name, result[0].user_id, result[0].bit_api_key);
			
			userData.init(result[0].user_id, secret, api, result[0].auto_setting_list, result[0].user_name);
			
//			info = new user(result[0].user_id, secret, api, result[0].auto_setting_list, result[0].user_name);
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
					console.log('requestCoinPrice end');
				}
				
				if(userData.getUser().getBitApi() != null && userData.getUser().getBitSecret() != null){
					connBithumb.requestUserWallet(userData.getUser(), function(err, result){
						if(err){
							res.render('error',{error:err});
						}else{
							if( parseInt(result.status) == 0 ){
								console.log('requestUserWallet end');
								var data = result.data;
								
								userData.setAssets(data);
								userAssets = userData.getAssets().getData();
								console.log('dicResult : ' + JSON.stringify(userAssets));
								
								_isEndRequest = true;
								resultInit(res);
							}else{
								_isEndRequest = true;
								resultInit(res);
							}
						}
					});
				}
			});
			
		}
	});
}


function resultInit(res){
	if(_isEndRequest && _isEndQuery){
		_isEndRequest = false;
		_isEndQuery = false;
		
		res.render('main',{data:userData.getUser(), arrayPrice:coinPrice, dicSettingCoin:dicAutoCoin, assets:userAssets});
	}
}



