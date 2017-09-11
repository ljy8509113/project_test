var dbManager = require('./db_controller');
var userInfo = require('../data/userInfo');
var coinData = require('../data/coinData');
var connBithumb = require('./connBithumb');
var common = require('../data/common');

exports.initMain = function(req, res, user_id, isFirst){
	var query = "SELECT * FROM users WHERE user_id='" + user_id + "'";
	var info;

	dbManager.selectQuery(query, function(err, result){
		if(err){

		}else{
			info = new userInfo(result[0].user_id, result[0].bit_cer_key, result[0].bit_api_key, result[0].auto_setting_list, result[0].user_name);
			var coinName = [];
			var arrayCoin = common.getCoinCodeList();
			
			for(var i=0; i<arrayCoin.length; i++){
				coinName.push(common.getCoinName(arrayCoin[i]));
				
			}
			
			connBithumb.requestCoinPrice(arrayCoin, false, function(err, result){
				if(err){
					
				}else{
					res.render('main',{data:info, coinNames:coinName});
				}
			});
			
			
		}
	});
				
}

