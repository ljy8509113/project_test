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


