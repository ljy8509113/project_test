var express = require('express');
var router = express.Router();
var dbManager = require('./db_controller');
var mysql = require('mysql');


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
	var bit_cert = req.body.bitsum_cert;
	var bit_api = req.body.bitsum_api;

	var query = "SELECT * FROM users WHERE name='" + name + "'";
	dbManager.selectQuery(query, function(err, result){
		if(err){
			res.render('error', {error:err});
		}else{
			if(result == ''){
//				var insert = "name='"+name+"' password='"+pw+"' bit_cer_key='"+bit_cert+"' bit_api_key='"+bit_api+"'"; 
				var insert = "(name, password, bit_cer_key, bit_api_key) VALUE ('" + name + "', '" + pw + "','" + bit_cert + "','" + bit_api + "')";
				dbManager.insertQuery('users', insert, function(err, result){
					if(err){
						res.render('error', { error:err});
					}else{
//						res.render('main');
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

module.exports = router;
