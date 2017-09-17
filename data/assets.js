var common = require('./common');

function assets(data){
	this.dicCoinList = {};
	this.dicCoinList = dataSetting(data);
}

function makeDic(availableValue, totalValue, inUseValue, lastPrice){
	if(availableValue > 0 || totalValue > 0 || inUseValue > 0){
		var dicValue = {
				available:availableValue,
				total:totalValue,
				inUse:inUseValue,
				priceValue:(totalValue * lastPrice)
		};
		
		return dicValue;
	}else{
		return null;
	}
}

function dataSetting(data){
	var dic = {};
	var array = common.getCoinCodeList();
	var available = 0;
	var total = 0;
	var inUse = 0;
	var lastPrice = 0;
	
	for(var i=0; i<array.length; i++){
		var key = array[i].toLowerCase();
		
		availableValue = data["available_"+key];
		totalValue = data["total_"+key];
		inUseValue = data["in_use_"+key];
		lastPrice = parseInt(data["xcoin_last_"+key]);
		
		var dicResult = makeDic(availableValue, totalValue, inUseValue, lastPrice);
		
		if(dicResult != null){
			dic[common.getCoinName(array[i])] = dicResult;
		}
	}
	
	var dicResult = makeDic(data.available_krw, data.total_krw, data.in_use_krw, 1);
	
	if(dicResult != null){
		dic['원화'] = dicResult;
	}
	
	return dic;
}

var proto = assets.prototype;

proto.setData = function(data){
	this.dicCoinList = dataSetting(data);
}

proto.setData = function(key, availableValue, totalValue, inUseValue){
	var dicResult = makeDic(key, availableValue, totalValue, inUseValue);
	if(dicResult != null)
		this.dicCoinList[key] = dicResult;
};

proto.getData = function(){
	return this.dicCoinList;
};

module.exports = assets;

