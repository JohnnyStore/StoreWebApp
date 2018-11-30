$(document).ready(function () {
  setDefaultLanguage();
});

function getLoginCustomer() {
  var loginCookie = getCookie('loginCustomer');
  if(loginCookie === null){
    return null;
  }
  return JSON.parse(loginCookie);
}

function setCookie(name,value, save) {
  var days = 30;
  if(save !== undefined && save === false){
    days = 0.5;
  }

  var exp = new Date();
  exp.setTime(exp.getTime() + days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function saveLanguageSetting(lan) {
  localStorage.setItem("siteLanguage", lan);
}

function getLanguageSetting() {
  return localStorage.getItem("siteLanguage")
}
function setDefaultLanguage() {
  var lan = localStorage.getItem("siteLanguage");
  if(lan === null){
    localStorage.setItem("siteLanguage",'cn');
  }
}

function setPageLanguage() {
  var lan = localStorage.getItem("siteLanguage");
  if(lan === 'cn'){
    $('.lan-en').addClass('hidden');
    $('.lan-cn').removeClass('hidden');
  }else{
    $('.lan-cn').addClass('hidden');
    $('.lan-en').removeClass('hidden');
  }
}

function alertRequestError(reqUrl) {
  var lan = localStorage.getItem("siteLanguage");
  if(lan === 'cn'){
    layer.msg('发送请求' + reqUrl + '失败，请检查网络设置。');
  }else{
    layer.msg('Send request' + reqUrl + 'failed, please check network settings.');
  }
}

function alertResponseError(errorCode, errorMsg) {
  layer.msg(errorCode + ': ' + errorMsg);
}