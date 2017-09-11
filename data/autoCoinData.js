function autoCoinData(coinId, buy, sell, isAuto, time, buyPrice, sellAmount){
	this.coinId = coinId;
	this.buy = buy;
	this.sell = sell;
	this.isAuto =  isAuto;
	this.time = time;
	this.buyPrice = buyPrice
	this.sellAmount = sellAmount;
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

proto.setIsAuto = function(isAuto){
	this.isAuto = isAuto;
};

proto.getIsAuto = function(){
	return this.isAuto;
};

proto.setTime = function(time){
	this.time = time;
};

proto.getTime = function(){
	return this.time;
};

proto.setBuyPrice = function(buyPrice){
	this.buyPrice = buyPrice;
};

proto.getBuyPrice = function(){
	return this.buyPrice;
};

proto.setSellAmount = function(sellAmount){
	this.sellAmount = sellAmount;
};

proto.getSellAmount = function(){
	return this.sellAmount;
};

module.exports = autoCoinData;
