var urlEncode = require('urlencode');
var crypto = require('crypto');

exports.getCoinName = function(coin){
	if(coin.toUpperCase() == "BTC"){
		return "비트코인";
	}else if(coin == "ETH"){
		return "이더리움";
	}else if(coin == "DASH"){
		return "대시";
	}else if(coin == "LTC"){
		return "라이트코인";
	}else if(coin == "ETC"){
		return "이더리움(C)";
	}else if(coin == "XRP"){
		return "리플";
	}else if(coin == "BCH"){
		return "비트캐쉬";
	}else if(coin == "XMR"){
		return "모네로";
	}else{
		return "none";
	}
}

exports.getCoinCodeList = function(){
	var array = ["BTC", "ETH", "DASH", "LTC", "ETC", "XRP", "BCH", "XMR"]; 
	return array;
}

exports.makeString = function(user, identity, value){
	var key = urlEncode(user) + urlEncode(identity);
	const cipher = crypto.createCipher('aes-256-cbc',key);
	let result = cipher.update(value, 'utf-8', 'base64');

	return result+= cipher.final('base64');
}

exports.disarmedString = function(user, identity, value){
	var key = urlEncode(user) + urlEncode(identity);
	const decipher = crypto.createDecipher('aes-256-cbc', key);
	let result = decipher.update(value, 'base64', 'utf-8');

	return result += decipher.final('utf8');
}

exports.getTime = function(){
	var time = new Date();
	return time.toFormat('YYYY-MM-DD HH:MI:SS');
}


