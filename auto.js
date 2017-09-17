var server = require('./bin/www');
var request = require('request');
var coinData = require('./data/coinData');
require('date-utils');
var dbManager = require('./routes/db_controller');
var bithumbUserAPI = require('./routes/bithumbUserAPI');
var common = require('./data/common');
var connBithumb = require('./routes/connBithumb');

var _arrayUsers = [];
var _dicBeforePrice = null;

var startTimer = setInterval(function(){
	var time = new Date();
	var min = time.toFormat('MI');
	var sec = time.toFormat('SS');
	console.log('check ----- ');
	
	if( min % 3 == 0 && sec == 0){
		console.log('start - ');
		clearInterval(startTimer);
		requestPrice();
		autoTimer();
	}
		
}, 1000);

function autoTimer(){
	setInterval(function(){
		requestPrice();
	}, 180000);
}

function requestPrice(){
	console.log('timer : ' + new Date());
	connBithumb.requestCoinPrice(common.getCoinCodeList(), true, _dicBeforePrice,  function(err, result){
		if(err){
			//res.render('error',{error:err});
		}else{
			console.log('requestCoinPrice end : ' + JSON.stringify(result));
			var array = common.getCoinCodeList();
			var dic = {};
			
			for(var i=0; i<result.length; i++){
				dic[result[i].getCoinName()] = result[i].getPrice();
			}
			
			if(_dicBeforePrice == null){
				_dicBeforePrice = dic;
			}else{
				
			}
		}
	});
}

function getUserData(){
	dbManager.selectQuery();
}




