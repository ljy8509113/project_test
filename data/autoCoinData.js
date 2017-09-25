function autoCoinData(coinId, buy, sell, time, buyAmount, sellAmount, userId, secretKey, apiKey){
	this.coinId = coinId;
	this.buy = buy;
	this.sell = sell;
	this.time = time;
	this.buyAmount = buyAmount;
	this.sellAmount = sellAmount;
	this.userId = userId;
	this.secretKey = secretKey;
	this.apiKey = apiKey;
}

var proto = autoCoinData.prototype;

proto.setCoinId = function(coinId){
	this.coinId = coinId;
};

proto.getCoinId = function(){
	return this.coinId;
};

proto.setBuy = function(buy){
	this.buy = buy;
};

proto.getBuy = function(){
	return this.buy;
};

proto.setSell = function(sell){
	this.sell = sell;
};

proto.getSell = function(){
	return this.sell;
};

proto.setTime = function(time){
	this.time = time;
};

proto.getTime = function(){
	return this.time;
};

proto.setBuyAmount = function(buyAmount){
	this.buyAmount = buyAmount;
};

proto.getBuyAmount = function(){
	return this.buyAmount;
};

proto.setSellAmount = function(sellAmount){
	this.sellAmount = sellAmount;
};

proto.getSellAmount = function(){
	return this.sellAmount;
};

proto.setUserId = function(userId){
	this.userId = userId;
};

proto.getUserId = function(){
	return this.userId;
};

proto.setSecretKey = function(secretKey){
	this.secretKey = secretKey;
};

proto.getSecretKey = function(){
	return this.secretKey;
};

proto.setApiKey = function(apiKey){
	this.apiKey = apiKey;
};

proto.getApiKey= function(){
	return this.apiKey;
};

module.exports = autoCoinData;


