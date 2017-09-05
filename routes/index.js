var express = require('express');
var router = express.Router();
var dbManager = require('./db_controller');
//var main = require('./main');

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user_info',function(req,res){
	var result = require('./user_info').setData(req,res);
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
				var errorValue = new Error();
				errorValue.status = "NOT FOUND";
				errorValue.stack = "아이디가 존재하지 않습니다.";
				res.render('error', {error:errorValue});
			}else{
				if(req.password == result.password){
//					res.render('main');
				}else{
					var errorValue = new Error();
					errorValue.status = "Different PASSWORD";
					errorValue.stack = "패스워드가 다름.";
					res.render('error', {error:errorValue});
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
				var insert = ["name,password,bit_cer_key,bit_api_key",name+","+pw+","+bit_cert+","+bit_api];
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
