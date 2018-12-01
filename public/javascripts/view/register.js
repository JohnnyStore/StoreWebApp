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

  function checkIsNewCellphoneNumber(cellphone) {
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
          layer.msg('该手机号码已存在');
          newCellphoneNumber = false;
        }else{
          newCellphoneNumber = true;
        }
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/register/cellphone');
        newCellphoneNumber = false;
      }
    });

    return newCellphoneNumber;
  }

  function checkIsNewEmail(email) {
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
          layer.msg('The email address has existed.');
          newEmail = false;
        }else {
          newEmail = true;
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

    if(!checkIsNewCellphoneNumber(cellphone)){
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

    if(!checkIsNewEmail(email)){
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

  function checkData4Password() {
    let password = $('#form-field-password').val();
    if(!checkNotEmpty(password)){
      let msg = lan === 'cn'? '请输入密码' : 'The enter a password.';
      layer.msg(msg);
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

  function checkDataBeforeRegister(){
    if(!checkData4Cellphone()) {
      return false;
    }

    if(!checkData4Email()) {
      return false;
    }

    if(!checkData4ValidCode()){
      return false;
    }

    if(!checkData4Password()){
      return false;
    }

    return true;
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

      $('.btn-valid').removeClass('hidden');
      countdown = waitSeconds;
      return false;
    } else {
      $('.btn-valid').addClass('hidden');
      $('.verfcode p').removeClass('hidden');
      $('.verfcode p i').text('重新发送(' + countdown + ')');
      countdown--;
    }
  }

  function register(){
    $.ajax({
      url: '/register',
      type: 'post',
      dataType: 'json',
      data:{
        cellphone: $.trim($('#form-field-cellphone').val()),
        email: $.trim($('#form-field-email').val()),
        password: $.trim($('#form-field-password').val()),
        customerType: $('input[name="role"]:checked').val(),
        loginUser: $.trim($('#form-field-cellphone').val())
      },
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        layer.alert('注册成功，去登陆。', {
          skin: 'layui-layer-molv' //样式类名
          ,closeBtn: 0
        }, function(){
          location.href = '/login';
        });
      },
      error: function (XMLHttpRequest, textStatus) {
        alertRequestError('/register');
      }
    });
  }

  $('.btn-valid').click(function () {
    if(!checkDataBeforeSendCode()){
      return false;
    }
    sendValidCode();
  });

  $('.btn-register').click(function () {
    if(!checkDataBeforeRegister()){
      return false;
    }
    register();
  });

  initPage();
});