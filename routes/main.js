var express = require('express');
var router = express.Router();
var coinData = require('../data/coinData');
var connBithumb = require('./connBithumb');
var common = require('../data/common');
var autoCoinData = require('../data/autoCoinData');
var userData = require('./userInfo');
var main = require('./main');
var query = require('../data/queryString');
//var auto = require('../auto');

var _isEndQuery = false;
var _isEndRequest = false;
var info;
var dicAutoCoin;
var coinPrice;
var userAssets;

exports.initMain = function(req, res, user_id, isFirst){
	console.log('id : ' + user_id);
	dicAutoCoin = {};	
	coniPrice = [];
	
	query.selectUser(user_id, function(err, result){
		if(err){
			res.render('error',{error:err});
		}else{
			var secret = common.disarmedString(result[0].user_name, result[0].user_id, result[0].bit_secret_key);
			var api = common.disarmedString(result[0].user_name, result[0].user_id, result[0].bit_api_key);
			
			if(result != ''){
				query.selectAutoTrade(user_id, function(err, result){
					if(err){
						res.render('error',{error:err});
					}else{
						if(result != ''){
							for(var i=0; i<result.length; i++){
//								var data = new autoCoinData(result[i].coin_name, result[i].buy, result[i].sell, result[i].time, result[i].buy_amount, result[i].sell_amount, result[i].user_id, secret, api, result[i].status);
								var data = new autoCoinData(result[i].coin_name, result[i].buy, result[i].user_id, secret, api, result[i].status, result[i].amount, result[i].is_before_data);
								if(data.getIsBefore() == 0)
									dicAutoCoin[result[i].coin_name] = data;
							}
						}
					}
					_isEndQuery = true;
					resultInit(res);
				});
				
				
				userData.init(result[0].user_id, secret, api, result[0].auto_setting_list, result[0].user_name);
				
				var coinName = [];
				var arrayCoin = common.getUseCoinCodeList();//common.getCoinCodeList();
				
				for(var i=0; i<arrayCoin.length; i++){
					coinName.push(common.getCoinName(arrayCoin[i]));
				}
				
				connBithumb.requestAllCoinPrice(arrayCoin, false, function(err, result){
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

router.all('/', function(req, res) {
//	//var user_id = req.body.user_id;
	var user_id = "testAdmin";
	main.initMain(req, res, user_id, false);
});

//router.post('/checkCurrent', function(req, res){
//	var name = req.body.coin_name;
//	
//	connBithumb.requestCoinPrice(name, function(err, result){
//		if(err){
//			var message = JSON.stringify(err);
//			res.send({isSuccess:false, msg:message});
//		}else{
//			console.log('requestCoinPrice end : ' + JSON.stringify(result));
//			res.send({isSuccess:true, nowPrice:parseInt(result)});
//		}
//	});
//});

router.post('/addAuto',function(req, res){
	var name = req.body.coin_name;
	var amount = req.body.amount;
	
	query.saveAutoTrade(userData.getUserId(), name, 0, 0, amount, 0, function(err, result){
		if(err){
			var message = JSON.stringify(err);
			res.send({isSuccess:false, msg:message});
		}else{			
			var data = new autoCoinData(name, 0, userData.getUserId(), userData.getBitSecret(), userData.getBitApi(), 0, amount, 0);
			dicAutoCoin[name] = data;
//			auto.updateData(data);
			res.send({isSuccess:true, resultData:data});
		}
	});
});

//router.post('/saveAuto',function(req, res){
//	var name = req.body.coin_name;
//	var buy = req.body.buy;
//	var isPercent = req.body.is_percent;
//	var amount = req.body.amount;
//		
////	query.saveCoinTrade(userData.getUserId(), name, buy, sell, buyAmount, sellAmount, function(err, result){
//	query.saveAutoTrade(userData.getUserId(), name, buy, 0, isPercent, amount, function(err, result){
//		if(err){
//			var message = JSON.stringify(err);
//			res.send({isSuccess:false, msg:message});
//		}else{
//			var data = new autoCoinData(name, buy, userData.getUserId(), userData.getBitSecret(), userData.getBitApi(), 0, amount);
//			dicAutoCoin[name] = data;
////			auto.updateData(data);
//			res.send({isSuccess:true, resultData:data});
//		}
//	});
//});

router.all('/removeAuto', function(req, res){
	var name = req.body.coin_name;
	
	if(dicAutoCoin[name] == null){
		res.send({isSuccess:false, msg:'설정되지 않은 코인'});
	}else{
//		query.removeCoinTrade(userData.getUserId(), name, function(err, result){
		query.removeAutoTrade(userData.getUserId(), name, 0, function(err, result){
			if(err){
				var message = JSON.stringify(err);
				res.send({isSuccess:false, msg:message});
			}else{
				delete dicAutoCoin[name];
				res.send({isSuccess:true, dicSettingCoin:dicAutoCoin});
			}
		});
	}
});

module.exports = router;



