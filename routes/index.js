var express = require('express');
var router = express.Router();
var dbManager = require('./db_controller');
var mysql = require('mysql');
var connBitApi = require('./connBithumb');
var common = require('../data/common');
var query = require('../data/queryString');

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
	var user_id = req.body.user_id;
	var pw = req.body.password;

	query.selectUser(user_id, function(err, result){
		if(err){ 
			res.render('error',{error:err});
		}else{
			if(result == ''){
				var msg = "아이디가 존재하지 않습니다.";
				res.send({isSuccess:false,msg:msg});
			}else{
				if(pw == result[0].password){
					if(result[0].fail_password_cnt > 0){
						query.updateFailCount(user_id, 0, function(err, result){
							if(err){
								res.render('error',{error:err});
							}else{
								res.send({isSuccess:true, user_id:user_id, password:pw});
							}
						});
					}else{
						res.send({isSuccess:true, user_id:user_id, password:pw});
					}
				}else{
					var failCnt = result[0].fail_password_cnt;
					var msg = "";

					if(failCnt < 10){
						failCnt += 1;

						query.updateFailCount(user_id, failCnt, function(err, result){
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
	var user_id = req.body.user_id;
	var pw = req.body.password;
	var user_name = req.body.user_name;
	var bit_secret = common.makeString(user_name, user_id, req.body.secret_key);
	var bit_api = common.makeString(user_name, user_id, req.body.api_key);

	var date = new Date();
	var s_key = common.makeString('^*A', user_id, date.toDateString());

	query.selectUser(user_id, function(err, result){
		if(err){
			res.render('error', {error:err});
		}else{
			if(result == ''){
				query.insertUser(user_id, pw, bit_secret, bit_api, user_name, s_key, function(err, result){
					if(err){
						res.render('error', { error:err});
					}else{
						main.initMain(req, res, user_id, true);
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



router.post('/user_info', function(req, res){
	var secret = req.body.secretKey;
	var api = req.body.apiKey;
	
	connBitApi.requestUser(secret, api, 'XRP', function(err, result){
		if(err){
			res.send({isSuccess:false,msg:'오류-다시 시도 해보셈.'});
		}else{
			if(parseInt(result.status) == 0){
				res.send({isSuccess:true, msg:'검증 성공 !!'});
			}else{
				res.send({isSuccess:false, msg:'검증 오류 :' + result.message});
			}
		}
	});
});

module.exports = router;



