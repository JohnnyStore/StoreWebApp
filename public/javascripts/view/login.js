$(document).ready(function () {
  function initPage() {
    var lan = getLanguageSetting();
    switchLanguage(lan);
  }

  function switchLanguage(lan) {
    switch (lan){
      case 'cn':
        $('#switch-lan').find('option[value="cn"]').attr('selected',true);
        $('#form-filed-userName').attr('placeholder', '手机号');
        $('#form-filed-password').attr('placeholder', '密码');
        $('#btn-login').text('登录');
        $('#link-register').text('新用户注册');
        $('#link-forgetpasword').text('忘记密码？');
        $('#form-filed-userName').val('');
        $('#form-filed-password').val('');
        break;
      case 'en':
        $('#switch-lan').find('option[value="en"]').attr('selected',true);
        $('#form-filed-userName').attr('placeholder', 'Email');
        $('#form-filed-password').attr('placeholder', 'Password');
        $('#btn-login').text('Sign in');
        $('#link-register').text('Register');
        $('#link-forgetpasword').text('Forget Password？');
        $('#form-filed-userName').val('');
        $('#form-filed-password').val('');
        break;
    }
  }

  function checkData(){
    var lan = $('#switch-lan').find('option:selected').val();
    var userName = $.trim($('#form-filed-userName').val());
    var password = $.trim($('#form-filed-password').val());
    var alertMsgOfUserName = lan === 'cn' ? '请输入登录账号或手机号码。' : 'Please enter account or email.';
    var alertMsgOfPassword = lan === 'cn' ? '请输入密码。' : 'Please enter password.';
    if(userName.length === 0){
      layer.msg(alertMsgOfUserName);
      return false;
    }
    if(password.length === 0){
      layer.msg(alertMsgOfPassword);
      return false;
    }
    return true;
  }

  function login(){
    var lan = getLanguageSetting();
    var userName = $.trim($('#form-filed-userName').val());
    var password = $.trim($('#form-filed-password').val());
    var target = $('#hidden-target').val();
    var msg = '';
    $.ajax({
      url: '/login/userInfo?userName=' + userName + '&password=' + password,
      type: 'get',
      success: function (res) {
        if(res.error){
          msg = lan === 'cn' ? '服务器异常，暂时无法登陆，请稍后再试。' : 'Service error, please try again later.';
          layer.msg(msg);
          return false;
        }
        if(res.data === null || res.data.length === 0){
          msg = lan === 'cn' ? '用户名或者密码不存在。' : 'Account or password invalid.';
          layer.msg(msg);
          $('#form-filed-userName').focus();
          return false;
        }
        if(res.data.frozen){
          msg = lan === 'cn' ? '您的账户已冻结，请联系客服。' : 'Your account has been frozen.';
          layer.msg(msg);
          return false;
        }
        var loginCustomer = JSON.stringify(res.data);
        setCookie('loginCustomer', loginCustomer, true);
        setCookie('loginCustomerID', res.data.customerID, true);
        location.href = target;
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg('无法连接网络，请检查网络设置。');
      }
    });
  }

  $('#switch-lan').change(function () {
    var lan = $(this).find('option:selected').val();
    switchLanguage(lan);
    saveLanguageSetting(lan);
  });

  $('#btn-login').click(function () {
    if(!checkData()){
      return false;
    }
    login();
  });

  initPage();
});