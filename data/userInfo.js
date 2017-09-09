var dbManager = require('../routes/db_controller');
var userList;

function userInfo(userId, bitCert, bitApi, autoSettingList, userName){
	this.userId = userId;
	this.bitCert = bitCert;
	this.bitApi = bitApi;
	this.autoSettingList =  autoSettingList;
	this.userName = userName;
}

var proto = userInfo.prototype;

proto.setUserId = function(userId){
	this.userId = userId;
};

proto.getUserId = function(){
	return this.userId;
};

proto.setBitCert = function(bitCert){
	this.bitCert = bitCert;
};

proto.getBitCert = function(){
	return this.bitCert;
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

exports.getUserInfo = function(){
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
				var userData = new userInfo(result[i].user_id, result[i].bit_cer_key, result[i].bit_api_key, result[i].auto_setting_list, result[i].user_name);
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

