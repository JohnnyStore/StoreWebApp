var express = require('express');
var commonService = require('../service/commonService');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('itemReview', {title: '商品评论', itemID: req.query.itemID});
});

router.post('/', function (req, res, next) {
  var service = new commonService.commonInvoke('addItemReview');
  var data = {
    customerID: req.body.customerID,
    itemID: req.body.itemID,
    starNum: req.body.starNum,
    reviewLevel: req.body.reviewLevel,
    reviewText: req.body.reviewText,
    reviewStatus: req.body.reviewStatus,
    loginUser: req.body.loginUser
  };

  service.add(data, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        code: result.content.responseCode,
        msg: result.content.responseMessage,
        data: result.content
      });
    }
  });
});

module.exports = router;
