var user = require('../data/user'); 
var assets = require('../data/assets');

var userData = null;
var assetsData = null;

exports.init = function(userId, bitSecret, bitApi, autoSettingList, userName){
	if(userData == null){
		userData = new user(userId, bitSecret, bitApi, autoSettingList, userName);
		console.log('if user : ' + userData);
	}else{
		userData.setValues(userId, bitSecret, bitApi, autoSettingList, userName);
		console.log('else user : ' + userData);
	}
	
}

exports.setAssets = function(data){
	if(assetsData == null)
		assetsData = new assets(data);
	else
		assetsData.setData(data);
}

exports.getUser = function(){
	console.log('get user : ' + userData);
	return userData;
}

exports.getAssets = function(){
	return assetsData;
}


