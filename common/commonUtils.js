var sysConfig = require('../config/sysConfig');
var apiConfig = require('../config/apiConfig');
// var SMSClient = require('@alicloud/sms-sdk');

exports.getPaginationArray = function(pageNumber, totalCount){
  var paginationArray = []; //返回的页码内容
  var pageSize = sysConfig.pageSize; //一页显示多少条数据
  var paginationSize = sysConfig.paginationSize; //最多显示多少个页码
  var maxPageNum = Math.ceil(totalCount / pageSize); //根据数据总数及每页显示的数据条数，计算理论上有多少页码

  var startPageNumber = 1;
  if(maxPageNum > paginationSize){
    //如果理论上应该显示的页码总数大于设置的最大页码总数，则只显示最大的页码总数
    if(pageNumber > 6){
      startPageNumber = pageNumber - 5;
    }
    for(var i = 1; i <= paginationSize; i++){
      paginationArray.push(startPageNumber);
      startPageNumber++;
    }
  }else{
    for(var i = 1; i <= maxPageNum; i++){
      paginationArray.push(i);
    }
  }

  return paginationArray;
};

exports.getPrePaginationNum = function (pageNumber) {
  var prePageNum = 0;
  if(parseInt(pageNumber)  > 0){
    prePageNum = pageNumber - 1;
  }
  return prePageNum;
};

exports.getNextPaginationNum = function (pageNumber, totalCount) {
  var nextPageNum = -1;
  var pageSize = sysConfig.pageSize; //一页显示多少条数据
  var maxPageNum = Math.ceil(totalCount / pageSize); //根据数据总数及每页显示的数据条数，计算理论上有多少页码
  if(parseInt(pageNumber) < maxPageNum){
    nextPageNum = parseInt(pageNumber) + 1;
  }
  return nextPageNum;
};

exports.bulidPagination = function (pageNumber, paginationArray, prePageNumber, nextPageNumber, brandID, categoryID, subCategoryID) {
  var paginationHtml = [];
  var urlParameter = '';
  if(paginationArray.length === 0){
    return paginationHtml;
  }
  if(brandID !== 0){
    urlParameter = '&brandID=' + brandID;
  }
  if(categoryID !== 0){
    urlParameter = '&categoryID=' + categoryID;
  }
  if(subCategoryID !== 0){
    urlParameter = '&subCategoryID=' + subCategoryID;
  }
  if(prePageNumber !== 0){
    paginationHtml.push('<li class="prev"><a href="/itemList?pageNumber=' + prePageNumber + urlParameter + '"><i class="fa fa-angle-double-left"></i></a></li>');
  }else{
    paginationHtml.push('<li class="prev"><span><i class="fa fa-angle-double-left"></i></span></li>');
  }
  paginationArray.forEach(function (value) {
    if(value !== pageNumber){
      paginationHtml.push('<li class="page-num"><a href="/itemList?pageNumber=' + value + urlParameter + '">' + value + '</a></li>');
    }else{
      paginationHtml.push('<li class="page-num"><span>' + value + '</span></li>');
    }
  });
  if(nextPageNumber !== -1){
    paginationHtml.push('<li class="next"><a href="/itemList?pageNumber=' + nextPageNumber + urlParameter + '"><i class="fa fa-angle-double-right"></i></a></li>');
  }else{
    paginationHtml.push('<li class="next"><span><i class="fa fa-angle-double-right"></i></span></li>');
  }

  return paginationHtml;
};

exports.bulidPagination4OrderHistory = function (pageNumber, paginationArray, prePageNumber, nextPageNumber, recentMonth) {
  var paginationHtml = [];
  var urlParameter = '&recentMonth=' + recentMonth;
  if(paginationArray.length === 0){
    return paginationHtml;
  }

  if(prePageNumber !== 0){
    paginationHtml.push('<li class="prev"><a href="/myOrder?pageNumber=' + prePageNumber + urlParameter + '"><i class="fa fa-angle-double-left"></i></a></li>');
  }else{
    paginationHtml.push('<li class="prev"><span><i class="fa fa-angle-double-left"></i></span></li>');
  }
  paginationArray.forEach(function (value) {
    if(value !== pageNumber){
      paginationHtml.push('<li class="page-num"><a href="/myOrder?pageNumber=' + value + urlParameter + '">' + value + '</a></li>');
    }else{
      paginationHtml.push('<li class="page-num"><span>' + value + '</span></li>');
    }
  });
  if(nextPageNumber !== -1){
    paginationHtml.push('<li class="next"><a href="/myOrder?pageNumber=' + nextPageNumber + urlParameter + '"><i class="fa fa-angle-double-right"></i></a></li>');
  }else{
    paginationHtml.push('<li class="next"><span><i class="fa fa-angle-double-right"></i></span></li>');
  }

  return paginationHtml;
};

exports.buildBreadcrumb = function (data, brandID, categoryID, subCategoryID) {
  var brandCN = '';
  var brandEN = '';
  var categoryCN = '';
  var categoryEN = '';
  var subCategoryCN = '';
  var subCategoryEN = '';
  var breadcrumb = [];
  if(parseInt(brandID) === 0){
    brandCN = '全部品牌';
    brandEN = 'All Brands';
  }else{
    data.navigate.brandList.forEach(function (value) {
      if(value.brandID === parseInt(brandID)){
        brandCN = value.brandCN;
        brandEN = value.brandEN;
        return false;
      }
    });
  }

  if(parseInt(categoryID) === 0){
    categoryCN = '所有分类';
    categoryEN = 'All Category';
  }else{
    data.navigate.navigateCategoryList.forEach(function (value) {
      if(value.categoryVO.categoryID === parseInt(categoryID)){
        categoryCN = value.categoryVO.categoryCN;
        categoryEN = value.categoryVO.categoryEN;
      }
      value.subCategoryVOList.forEach(function (value2) {
        if(value2.subCategoryID === parseInt(subCategoryID)){
          subCategoryCN = value2.subCategoryCN;
          subCategoryEN = value2.subCategoryEN;
        }
      });
    });
  }

  if(parseInt(subCategoryID) === 0){
    subCategoryCN = '所有商品';
    subCategoryEN = 'All Items';
  }

  breadcrumb.push({
    url: '/itemList?brandID=' + brandID,
    nameCN: brandCN,
    nameEN: brandEN
  });
  breadcrumb.push({
    url: '/itemList?categoryID=' + categoryID,
    nameCN: categoryCN,
    nameEN: categoryEN
  });
  breadcrumb.push({
    url: '/itemList?categoryID=' + categoryID + '&subCategoryID' + subCategoryID,
    nameCN: subCategoryCN,
    nameEN: subCategoryCN
  });

  return breadcrumb;
};

// exports.sendVerificationCodeToCellphone = function (cellphone, code, callback) {
//   var smsClient = new SMSClient({
//     accessKeyId: apiConfig.aliSms.accessKeyId,
//     secretAccessKey: apiConfig.aliSms.secretAccessKey
//   });
//   var smsParameter = '{"code":"' + code + '"}';
//   var req = {
//     PhoneNumbers: cellphone,
//     SignName: apiConfig.aliSms.signName,
//     TemplateCode: apiConfig.aliSms.templateCode,
//     TemplateParam: smsParameter
//   };
//   smsClient.sendSMS(req).then(function (res) {
//     var resText = getAliSmdResponseText(res.Code);
//     return callback(res.Code === 'OK', JSON.stringify(req), JSON.stringify(res), resText);
//   }, function (err) {
//     return callback(false, JSON.stringify(req), JSON.stringify(err), err.data.Message);
//   })
// };

exports.sendVerificationCodeToEmail = function (email, code, callback) {
  //TODO 将验证码以邮件的方式发给客户
  return callback();
};

function getAliSmdResponseText(code) {
  var resMapping = apiConfig.aliSms.resMapping;
  for(var key in resMapping){
    if(key === code){
      return resMapping[key];
    }
  }

}