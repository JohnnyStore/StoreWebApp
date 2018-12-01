$(document).ready(function () {
  const waitSeconds = 60;
  let countdown = waitSeconds;
  let intervalObj;
  let lan = localStorage.getItem('siteLanguage');
  let newCellphoneNumber = false;
  let newEmail = false;
  let validCode = false;
  let errMsg = '';

  function initPage() {
    setPageLanguage();
    if(lan === 'cn'){
      $('#form-field-newPassword').attr('placeholder', '新密码');
      $('#form-field-confirmPassword').attr('placeholder', '确认密码');
    }else{
      $('#form-field-newPassword').attr('placeholder', 'New Password');
      $('#form-field-confirmPassword').attr('placeholder', 'Confirm Password');
    }
  }

  function checkIsCellphone(data) {
    var myReg=/^[1][3,4,5,7,8][0-9]{9}$/;
    return myReg.test(data);
  }

  function checkIsEmail(data) {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");;
    return reg.test(data);
  }

  function checkNotEmpty(v) {
    return $.trim(v).length !== 0;
  }

  function checkValidCode() {
    let cellphone = $.trim($('#form-field-cellphone').val());
    let email = $.trim($('#form-field-email').val());
    let validCode = $.trim($('#form-field-validCode').val());

    if(lan === 'cn' && (!checkNotEmpty(cellphone) || !checkNotEmpty(validCode))){
      return false;
    }

    if(lan === 'en' && (!checkNotEmpty(email) || !checkNotEmpty(validCode))){
      return false;
    }

    $.ajax({
      url: '/register/validCode?cellphone=' + cellphone + '&email=' + email + '&validCode=' + validCode,
      async:false,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          validCode = false;
          return false;
        }
        if(!res.exist){
          lan === 'cn' ? errMsg = '验证码不正确。' : errMsg = 'The verification code is invalid.';
          layer.msg(errMsg);
          validCode = false;
          return false;
        }
        if(res.expired){
          lan === 'cn' ? errMsg = '验证码已过期。' : errMsg = 'The verification code has expired.';
          layer.msg(errMsg);
          validCode = false;
          return false;
        }
        validCode = true;
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/register/validCode');
        validCode = false;
      }
    });
    return validCode;
  }

  function checkCellphoneNumberExist(cellphone) {
    if(!checkNotEmpty(cellphone)){
      layer.msg('请输入手机号码。');
      newCellphoneNumber = false;
    }

    if(!checkIsCellphone(cellphone)){
      layer.msg('您输入的不是一个手机号码。');
      newCellphoneNumber = false;
    }

    $.ajax({
      url: '/register/cellphone?data=' + cellphone,
      async:false,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          newCellphoneNumber = false;
        }
        if(res.exist){
          newCellphoneNumber = true;
        }else{
          layer.msg('该手机号码不存在');
          newCellphoneNumber = false;
        }
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/register/cellphone');
        newCellphoneNumber = false;
      }
    });

    return newCellphoneNumber;
  }

  function checkEmailExist(email) {
    if(!checkNotEmpty(email)){
      layer.msg('Please enter you email address.');
      newEmail = false;
    }

    if(!checkIsEmail(email)){
      layer.msg('Your input is not a email address.');
      newEmail = false;
    }

    $.ajax({
      url: '/register/email?data=' + email,
      async:false,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          newEmail = false;
        }
        if(res.exist){
          newEmail = true;
        }else {
          layer.msg('The email address does not exist.');
          newEmail = false;
        }
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/register/email');
        newEmail = false;
      }
    });
    return newEmail;
  }

  function checkData4Cellphone() {
    if(lan !== 'cn'){
      return true;
    }

    let cellphone = $('#form-field-cellphone').val();
    if(lan === 'cn' && !checkNotEmpty(cellphone)){
      layer.msg('请输入手机号码。');
      return false;
    }

    if(!checkIsCellphone(cellphone)){
      layer.msg('您输入的不是正确的手机号码。');
      return false;
    }

    if(!checkCellphoneNumberExist(cellphone)){
      return false;
    }

    return true;
  }

  function checkData4Email() {
    if(lan !== 'en'){
      return true;
    }

    let email = $('#form-field-email').val();

    if(lan === 'en' && !checkNotEmpty(email)){
      layer.msg('Please enter your email。');
      return false;
    }

    if(!checkIsEmail(email)){
      layer.msg('The email address is not correct。');
      return false;
    }

    if(!checkEmailExist(email)){
      return false;
    }

    return true;
  }

  function checkData4ValidCode() {
    let validCode = $('#form-field-validCode').val();
    if(!checkNotEmpty(validCode)){
      let msg = lan === 'cn'? '请输入验证码' : 'Check valid code.';
      layer.msg(msg);
      return false;
    }

    if(!checkValidCode()){
      return false;
    }
    return true;
  }

  function checkDataBeforeSendCode(){
    let lan = getLanguageSetting();
    if(lan === 'cn' && !checkData4Cellphone()){
      return false;
    }
    if(lan === 'en' && !checkData4Email()){
      return false;
    }
    return true;
  }

  function checkDataBeforeNext(){
    if(!checkData4Cellphone()) {
      return false;
    }

    if(!checkData4Email()) {
      return false;
    }

    if(!checkData4ValidCode()){
      return false;
    }

    return true;
  }

  function checkDataBeforeReset() {
    let password = $.trim($('#form-field-newPassword').val());
    let confirmPassword = $.trim($('#form-field-confirmPassword').val());

    if(!checkNotEmpty(password)){
      let msg = lan === 'cn'? '请输入新密码' : 'Please enter new password.';
      layer.msg(msg);
      return false;
    }

    if(!checkNotEmpty(confirmPassword)){
      let msg = lan === 'cn'? '请输入确认密码' : 'Please enter confirm password.';
      layer.msg(msg);
      return false;
    }

    if(password !== confirmPassword){
      let msg = lan === 'cn'? '新密码和确认密码不一致' : 'The new password does not same as confirm password.';
      layer.msg(msg);
      return false;
    }
    return true;
  }

  function resetPassword() {
    let cellphone = $.trim($('#form-field-cellphone').val());
    let email = $.trim($('#form-field-email').val());
    let password = $.trim($('#form-field-newPassword').val());

    $.ajax({
      url: '/forgetPassword',
      type: 'post',
      dataType: 'json',
      data:{
        cellphone: cellphone,
        email: email,
        password: password
      },
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        complete();
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/forgetPassword');
      }
    });
  }

  function complete() {
    $('.form-reset').addClass('hidden');
    $('.form-complete').removeClass('hidden');

  }

  function sendValidCode(){
    var lan = getLanguageSetting();
    $.ajax({
      url: '/register/sendValidCode',
      type: 'post',
      dataType: 'json',
      data:{
        cellphone: $.trim($('#form-field-cellphone').val()),
        email: $.trim($('#form-field-email').val())
      },
      success: function (res) {
        if(res.err){
          if(lan === 'cn'){
            layer.msg('短信验证码发送失败，请稍后再试。');
          }else{
            layer.msg('The verification code send failed.');
          }
          return false;
        }
        if(lan === 'cn'){
          layer.msg('验证码已发送到您的手机。');
        }else{
          layer.msg('The verification code send your email address.');
        }

        intervalObj = setInterval(function() {
          setTime();
        },1000);
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/register/sendValidCode');
      }
    });
  }

  function setTime(){
    if (countdown === 0) {
      window.clearInterval(intervalObj);
      $('.verfcode p').addClass('hidden');

      $('.btn-validCode').removeClass('hidden');
      countdown = waitSeconds;
      return false;
    } else {
      $('.btn-validCode').addClass('hidden');
      $('.verfcode p').removeClass('hidden');
      $('.verfcode p i').text('重新发送(' + countdown + ')');
      countdown--;
    }
  }

  function next(){
    $('.form-valid').addClass('hidden');
    $('.form-reset').removeClass('hidden');
  }

  $('.btn-validCode').click(function () {
    if(!checkDataBeforeSendCode()){
      return false;
    }
    sendValidCode();
  });

  $('.btn-Next').click(function () {
    if(!checkDataBeforeNext()){
      return false;
    }
    next();
  });

  $('.btn-Reset').click(function () {
    if(!checkDataBeforeReset()){
      return false;
    }
    resetPassword();
  });

  initPage();
});