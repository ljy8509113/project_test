var common = require('./common');
require('date-utils');

function coinData(coinName, price, time, difference){
	this.coinName = coinName;
	this.price =  price;
	this.time = time.toFormat('YYYY-MM-DD HH:MI:SS');
	this.keyTime = makeKeyTime(time);
	this.coinNameKor = getKorName(coinName);
	this.difference = difference;
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
	this.time = time.toFormat('YYYY-MM-DD HH:MI:SS');
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

proto.setDifference = function(difference){
	this.difference = difference;
};

proto.getDifference = function(){
	return this.difference;
};

proto.getInsertQuery = function(){
	return "(coin_name, time, price, key_time, difference) VALUES ('" + this.coinName.toString() + "', '" + this.time + "', "+ this.price + ", " + this.keyTime + "," + this.difference + ")";
};

proto.getUpdateQuery = function(){
	return "coin_name = '" + this.coinName.toString() + "', time='" + this.time + "', price="+ this.price + ", key_time=" + this.keyTime + ", difference="+this.difference;
};

module.exports = coinData;

