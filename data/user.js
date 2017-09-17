var dbManager = require('../routes/db_controller');
var userList;

function user(userId, bitSecret, bitApi, autoSettingList, userName){
	this.userId = userId;
	this.bitSecret = bitSecret;
	this.bitApi = bitApi;
	this.autoSettingList =  autoSettingList;
	this.userName = userName;
}

var proto = user.prototype;

proto.setValues = function(userId, bitSecret, bitApi, autoSettingList, userName){
	this.userId = userId;
	this.bitSecret = bitSecret;
	this.bitApi = bitApi;
	this.autoSettingList =  autoSettingList;
	this.userName = userName;
}

proto.setUserId = function(userId){
	this.userId = userId;
};

proto.getUserId = function(){
	return this.userId;
};

proto.setBitSecret = function(bitSecret){
	this.bitSecret = bitSecret;
};

proto.getBitSecret = function(){
	return this.bitSecret;
};

proto.setBitApi = function(bitApi){
	this.bitApi = bitApi;
};

proto.getBitApi = function(){
	return this.bitApi;
};

proto.setAutoSettingList = function(autoSettingList){
	this.autoSettingList = autoSettingList;
};

proto.getAutoSettingList = function(){
	return this.autoSettingList;
};

proto.setUserName = function(userName){
	this.userName = userName;
};

proto.getUserName = function(){
	return this.userName;
};

exports.getUser = function(){
	if(userList == null){
		userList = [];
	}

	var query = "SELECT * FROM users";
	dbManager.selectQuery(query, function(err, result){
		if(err){
			res.render('error',{error:err});
			return null;
		}else{
			for(var i=0; i<result.length; i++){
				var userData = new user(result[i].user_id, result[i].bit_secret_key, result[i].bit_api_key, result[i].auto_setting_list, result[i].user_name);
				userList.push(userData);
			}

			return userList;
		}
	});
}

exports.updateUserData = function(userData){
	var query = "";
	dbManager.updateQuery('users', query, function(err,result){
		if(err){
			return false;
		}else{
			return true;
		}
	});
}

module.exports = user;

