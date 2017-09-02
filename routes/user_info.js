var dbManager = require('./db_controller');

exports.setData = function(req, res){
	var name = req.body.name;

	var query = "SELECT * FROM test WHERE name='" + name + "'";
	dbManager.selectQuery(query, function(err, result){
		if(err != null){
			return res.send('select error : '+err);
		}else{
			if(result == ''){
				dbManager.insertQuery('test', "name='"+name+"'", function(err, result){
					if(err){
						return res.send('insert error : ' + err);
					}else{
						return res.send('insert : ' + JSON.stringify(result));
					}
				});
			}else{
				return res.send('select 중복 : ' + JSON.stringify(result));
			}
		}
	});
	
}
