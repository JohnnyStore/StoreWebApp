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

  // var lan = req.cookies['lan'];
  // if(lan === undefined){
  //   res.cookie("lan", 'en', {maxAge: 60000});
  //   lan = 'en'
  // }
  // lan === 'cn' ? navData.index.title = '主页' : 'HOME';
  // lan === 'cn' ? navData.brand.title = '品牌商品' : 'BRANDS';
  // lan === 'cn' ? navData.pet.title = '宠物商品' : 'PETS';
  // lan === 'cn' ? navData.news.title = '新闻动态' : 'NEWS';
  // lan === 'cn' ? navData.introduction.title = '企业简介' : 'INTRODUCTION';
};