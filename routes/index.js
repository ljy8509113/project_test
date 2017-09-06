var express = require('express');
var router = express.Router();
var dbManager = require('./db_controller');
var mysql = require('mysql');
var urlEncode = require('urlencode');
var crypto = require('crypto');
var main = require('./main');

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',function(req, res){
	login(req,res);
});

router.post('/regist', function(req, res){
	res.render('regist', {title:'회원가입'});
});

router.post('/regist_data', function(req, res){
	regist(req, res);
});

function login(req, res){
	var name = req.body.name;
	var pw = req.body.password;

	var query = "SELECT * FROM users WHERE name='" + name + "'";
	dbManager.selectQuery(query, function(err, result){
		if(err){ 
			res.render('error',{error:err});
		}else{
			if(result == ''){
				var msg = "아이디가 존재하지 않습니다.";
				res.send({isSuccess:true,msg:msg});
			}else{
				if(pw == result[0].password && result[0].fail_password_cnt < 10){
					query = "fail_password_cnt=0";
					dbManager.updateQuery('users', query, function(err, result){
						if(err){
							res.render('error',{error:err});
						}else{
							res.send({isSuccess:true, name:name, password:pw});
						}
					});
				}else{
					var failCnt = result[0].fail_password_cnt;
					var msg = "";

					if(failCnt < 10){
						failCnt += 1;

						query = "fail_password_cnt="+failCnt;
						dbManager.updateQuery('users', query, function(err, result){
							if(err){
								res.render('error',{error:err});
							}else{
								msg = "패스워드가 다름 " + failCnt + "/10";
								res.send({isSuccess:false, msg:msg});
							}
						});
					}else{
						msg = "패스워드 10번 틀림. 관리자에게 문의 바람.";
						res.send({isSuccess:false, msg:msg});
					}
				}
			}
		}
	});
}

function regist(req, res){
	var name = req.body.name;
	var pw = req.body.password;
	var user_name = req.body.user_name;
	var bit_cert = makeString(user_name, name, req.body.bitsum_cert);
	var bit_api = makeString(user_name, name, req.body.bitsum_api);

	var query = "SELECT * FROM users WHERE name='" + name + "'";	
	dbManager.selectQuery(query, function(err, result){
		if(err){
			res.render('error', {error:err});
		}else{
			if(result == ''){
//				var insert = "name='"+name+"' password='"+pw+"' bit_cer_key='"+bit_cert+"' bit_api_key='"+bit_api+"'"; 
				var insert = "(name, password, bit_cer_key, bit_api_key, user_name) VALUE ('" + name + "', '" + pw + "','" + bit_cert + "','" + bit_api + "','" + user_name + "')";
				dbManager.insertQuery('users', insert, function(err, result){
					if(err){
						res.render('error', { error:err});
					}else{
						main.initMain(req, res, name, true);
					}
				});
			}else{
				var errorValue = new Error();
				errorValue.status = "Overlap ID";
				errorValue.stack = "아이디가 존재합니다.";
				res.render("error", {error:errorValue});
			}
		}
	});
}

function makeString(user, identity, value){
	var key = urlEncode(user) + urlEncode(identity);
	const cipher = crypto.createCipher('aes-256-cbc',key);
	let result = cipher.update(value, 'utf-8', 'base64');

	return result+= cipher.final('base64');
}

function disarmedString(user, identity, value){
	var key = urlEncode(user) + urlEncode(identity);
	const decipher = crypto.createDecipher('aes-256-cbc', key);
	let result = decipher.update(value, 'base64', 'utf-8');

	return result += decipher.final('utf8');
}

module.exports = router;
