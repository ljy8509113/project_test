var common = require('./common');

function coinData(coinName, price, time){
	this.coinName = coinName;
	this.price =  price;
	this.time = time;
	this.keyTime = makeKeyTime(time);
	this.coinNameKor = getKorName(coinName);
}
var proto = coinData.prototype;

function makeKeyTime(time){
	var key = time.toFormat('HHMI');
	console.log('key : ' + key);
	return key;
};

function getKorName(coinName){
	return common.getCoinName(coinName);
}

proto.setCoinName = function(coinName){
	this.coinName = coinName;
};

proto.getCoinName = function(){
	return this.coinName;
};

proto.setPrice = function(price){
	this.price = price;
};

proto.getPrice = function(){
	return this.price;
};

proto.setTime = function(time){
	this.time = time;
};

proto.getTime = function(){
	return this.time;
};

proto.setKeyTime = function(keyTime){
	this.keyTime = keyTime;
};

proto.getKeyTime = function(){
	return this.keyTime;
};

proto.setCoinNameKor = function(coinNameKor){
	this.coinNameKor = coinNameKor;
};

proto.getCoinNameKor = function(){
	return this.coinNameKor;
};

proto.getInsertQuery = function(){
	return"(coin_name, time, price, key_time) VALUE ('" + this.coinName.toString() + "', " + this.time + ", "+ this.price + ", " + this.keyTime + ")";
};

proto.getUpdateQuery = function(){
	return"coin_name = '" + this.coinName.toString() + "', time=" + this.time + ", price="+ this.price + ", key_time=" + this.keyTime;
};

module.exports = coinData;

