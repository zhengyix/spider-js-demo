var express = require('express');
var router = express.Router();
/*var ak ='your ak';
var sk = 'your sk';
var ocr = require('baidu-ocr-api').create(ak,sk);*/

/* GET home page. */
router.get('/', function(req, res, next) {
  /* ocr.scan({
   	url:'http://7pun4e.com1.z0.glb.clouddn.com/test.jpg',
   	type:'text',
   }).then(function(result){
   	return console.log(result)
   }).catch(function(err){
   	console.log("err",err);
   })*/
  res.render('index', { title: '' });
});

module.exports = router;
