function autoCoinData(coinName, buy, userId, secretKey, apiKey, status, amount, isBefore){
	this.coinName = coinName;
	this.buy = buy;
	this.userId = userId;
	this.secretKey = secretKey;
	this.apiKey = apiKey;
	this.status = status;
	this.amount = amount;
	this.isBefore = isBefore;
}

var proto = autoCoinData.prototype;

proto.setCoinName = function(coinName){
	this.coinName = coinName;
};

proto.getCoinName = function(){
	return this.coinName;
};

proto.setBuy = function(buy){
	this.buy = buy;
};

proto.getBuy = function(){
	return this.buy;
};

//proto.setSell = function(sell){
//	this.sell = sell;
//};
//
//proto.getSell = function(){
//	return this.sell;
//};
//
//proto.setTime = function(time){
//	this.time = time;
//};
//
//proto.getTime = function(){
//	return this.time;
//};
//
//proto.setBuyAmount = function(buyAmount){
//	this.buyAmount = buyAmount;
//};
//
//proto.getBuyAmount = function(){
//	return this.buyAmount;
//};
//
//proto.setSellAmount = function(sellAmount){
//	this.sellAmount = sellAmount;
//};
//
//proto.getSellAmount = function(){
//	return this.sellAmount;
//};

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

proto.setStatus = function(status){
	this.status = status;
};

proto.getStatus= function(){
	return this.status;
};

proto.setAmount = function(amount){
	this.amount = amount;
};

proto.getAmount= function(){
	return this.amount;
};

proto.setIsBefore = function(isBefore){
	this.isBefore = isBefore;
};

proto.getIsBefore= function(){
	return this.isBefore;
};

module.exports = autoCoinData;



