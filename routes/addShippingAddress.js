let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('addShippingAddress', {
    title: '添加收获地址',
    option: req.query.option,
    shippingID: req.query.shippingID });
});

router.get('/detail', function(req, res, next) {
  var service = new commonService.commonInvoke('shippingAddress');
  service.get(req.query.shippingID, function (result) {
    if(result.err || !result.content.result){
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
        data: result.content.responseData
      });
    }
  });
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('shippingAddress');
  let data = {
    customerID: req.body.customerID,
    shippingCountryID: req.body.shippingCountryID,
    shippingProvinceID: req.body.shippingProvinceID,
    shippingCityID: req.body.shippingCityID,
    shippingStreet: req.body.shippingStreet,
    consignee: req.body.consignee,
    cellphone: req.body.cellphone,
    defaultAddress: req.body.defaultAddress,
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

router.put('/', function (req, res, next) {
  let service = new commonService.commonInvoke('changeShippingAddress');
  let data = {
    shippingID: req.body.shippingID,
    customerID: req.body.customerID,
    shippingCountryID: req.body.shippingCountryID,
    shippingProvinceID: req.body.shippingProvinceID,
    shippingCityID: req.body.shippingCityID,
    shippingStreet: req.body.shippingStreet,
    consignee: req.body.consignee,
    cellphone: req.body.cellphone,
    defaultAddress: req.body.defaultAddress,
    loginUser: req.body.loginUser
  };

  service.change(data, function (result) {
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

router.delete('/', function (req, res, next) {
  let service = new commonService.commonInvoke('shippingAddress');

  service.delete(req.query.shippingID, function (result) {
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
