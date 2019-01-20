$(document).ready(function () {
  var loginCustomer = getLoginCustomer();
  $('.btn-ok').click(function () {
    layer.confirm('确认已支付完成？', {
      btn: ['确认','取消'] //按钮
    }, function(){
      //1. 发送通知短信
      $.ajax({
        url: '/apply/sendNoticeSms',
        type: 'post',
        dataType: 'json',
        data:{
          customerTel: loginCustomer.cellphone,
          orderAmount: $('#hidden-order-id').val()
        },
        success: function (res) {
          if(res.err){
            // alertResponseError(res.code, res.msg);
            // return false;
          }
        },
        error: function (XMLHttpRequest, textStatus) {
          //alertReqestError('/register');
        }
      });

      //2. 更新订单状态
      $.ajax({
        url: '/myOrder/changeOrderStatus',
        type: 'put',
        dataType: 'json',
        data:{
          orderID: $('#hidden-order-id').val(),
          orderStatus: 'P',
          loginUser: loginCustomer.account
        },
        success: function (res) {
          if(res.err){
            alertResponseError(res.code, res.msg);
            return false;
          }
          location.href = '/applySuccess?orderNumber=' + $('#hidden-order-id').val();
        },
        error: function (XMLHttpRequest, textStatus) {
          alertRequestError('/myOrder/changeOrderStatus');
        }
      });

    }, function(){
      //layer.msg('关闭对话框');
    });
  });
});