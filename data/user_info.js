var dbManager = require('./db_controller');
var userList;

function data(user_id, bit_cer_key, bit_api_key, auto_setting_list, user_name){
	var user_id = user_id;
	var bit_cer_key = bit_cer_key;
	var bit_api_key = bit_api_key;
	var auto_setting_list =  auto_setting_list;
	var user_name = user_name;
}

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
				var userData = new data(result[i].user_id, result[i].bit_cer_key, result[i].bit_api_key, result[i].auto_setting_list, result[i].user_name);
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
