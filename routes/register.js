var express = require('express');
var commonService = require('../service/commonService');
var commonUtils = require('../common/commonUtils');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('register', { title: '用户注册' });
});

router.get('/cellphone', function(req, res, next) {
  var cellphone = req.query.data;
  var service = new commonService.commonInvoke('checkCellphone');
  service.get(cellphone, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        exist: result.content.totalCount > 0
      });
    }
  });
});

router.get('/email', function(req, res, next) {
  var email = req.query.data + '.';
  var service = new commonService.commonInvoke('checkEmail');
  service.get(email, function (result) {
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
        exist: result.content.totalCount > 0
      });
    }
  });
});

router.get('/validCode', function(req, res, next) {
  var cellphone = req.query.cellphone;
  var email = req.query.email;
  var validCode = req.query.validCode;
  if(cellphone === undefined || cellphone.length === 0){
    cellphone = null;
  }
  if(email === undefined || email.length === 0){
    email = null;
  }
  var parameter = '/' + cellphone + '/' + email + '/' + validCode;
  var service = new commonService.commonInvoke('verificationCode');
  service.get(parameter, function (result) {
    if(result.err){
      res.json({
        err: true,
        code: result.code,
        msg: result.msg
      });
    }else{
      if(result.content.totalCount === 0){
        res.json({
          err: !result.content.result,
          code: result.content.responseCode,
          msg: result.content.responseMessage,
          exist: false
        });
        return false;
      }

      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        exist: result.content.totalCount > 0,
        expired: result.content.responseData.expired
      });
    }
  });
});

router.post('/', function(req, res, next) {
  var service = new commonService.commonInvoke('customer');
  var data = {
    account: req.body.cellphone,
    password: req.body.password,
    customerType: req.body.customerType,
    cellphone:  req.body.cellphone,
    email:  req.body.email,
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
        msg: result.content.responseMessage
      });
    }
  });
});

router.post('/sendValidCode', function(req, res, next) {
  var cellphone = req.body.cellphone;
  var email = req.body.email;
  var randomNum = '';
  var service = new commonService.commonInvoke('thirdPartyAPI');

  //随机验证码
  for(var i=0;i<6;i++) {
    randomNum += Math.floor(Math.random()*10);
  }

  //发送验证码
  if(cellphone !== undefined && cellphone.length > 0){
    commonUtils.sendVerificationCodeToCellphone(cellphone, randomNum, function (isSend, reqContent, resContent, reqText) {
      var data = {
        thirdParty: 'aliSms',
        requestContent: reqContent,
        responseContent: resContent,
        requestResult: isSend ? 'T' : 'F',
        responseText: reqText,
        cellphone: cellphone,
        email: email,
        verificationCode: randomNum,
        loginUser: cellphone
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
            err: !isSend,
            code: result.content.responseCode,
            msg: result.content.responseMessage,
            data: result.content
          });
        }
      });
    });
  } else if(email !== undefined && email.length > 0){
    commonUtils.sendVerificationCodeToEmail(email, randomNum, function () {
      var data = {
        thirdParty: '',
        requestContent: '',
        responseContent: '',
        requestResult: false,
        responseText: '',
        loginUser: email
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
            err: isSend,
            code: result.content.responseCode,
            msg: result.content.responseMessage,
            data: result.content
          });
        }
      });
    });
  } else{
    res.json({
      err: true,
      msg: '非法的请求。'
    });
  }
});

module.exports = router;
