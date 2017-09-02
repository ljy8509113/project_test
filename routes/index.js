var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user_info',function(req,res){
	var result = require('./user_info').setData(req,res);
});

module.exports = router;
