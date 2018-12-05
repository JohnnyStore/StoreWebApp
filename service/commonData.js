var commonService = require('../service/commonService');

exports.getCommonData = function (req, res, callback) {
  var navigateService = new commonService.commonInvoke('navigate');
  //取得品牌信息
  navigateService.get('', function (result) {
    if(result.err){ //调用API异常
      return callback({
        err: true,
        code: result.code,
        msg: result.msg + result.detail
      });
    }else{
      if(!result.content.result){ //调用API成功，但API处理异常
        return callback({
          err: true,
          code: result.content.responseCode,
          msg: result.content.responseMessage
        });
      }
      return callback({
        err: false,
        navigate: result.content.responseData
      });
    }
  });
};