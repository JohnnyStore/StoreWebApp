$(document).ready(function () {
  let loginCustomer = getLoginCustomer();
  let lan = localStorage.getItem('siteLanguage');

  function initPage() {
    let leaveMsg = lan === 'cn'? '给卖家留言' : 'leave message to seller.';
    $('#leave-message').attr('placeholder', leaveMsg);
    setPageLanguage();
    loadShippingAddress();
  }

  function loadShippingAddress() {
    let shippingID = $('#hidden-shippingId').val();
    if(shippingID.length > 0){
      loadShippingAddressById();
    }else{
      loadDefaultShippingAddress();
    }
  }

  function loadShippingAddressById() {
    $.ajax({
      url: '/addShippingAddress/detail?shippingID=' + $('#hidden-shippingId').val(),
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        if(res.data === null){
          $('.order_address').append('<div class="order-name">请添加配送地址</div>');
          return false;
        }

        let countryName;
        let provinceName;
        let cityName;
        let address;
        let defaultText = lan === 'cn' ? '默认' : 'Default';

        countryName = lan === 'cn'? res.data.countryVO.countryNameCN : res.data.countryVO.countryNameEN;
        provinceName = lan === 'cn'? res.data.provinceVO.provinceNameCN : res.data.provinceVO.provinceNameEN;
        cityName = lan === 'cn'? res.data.cityVO.cityNameCN : res.data.cityVO.cityNameEN;
        address = countryName + provinceName + cityName + res.data.shippingStreet;

        if(res.data.defaultAddress){
          $('.order_address').append(
              '<div class="order_name">\n' +
              '  <p>\n' +
              '    <em>' + res.data.consignee + '</em>\n' +
              '    <em>' + res.data.cellphone + '</em>\n' +
              '  </p>\n' +
              '  <p>\n' +
              '    <small>' + defaultText + '</small>\n' +
              '    <span>' + address + '</span>\n' +
              '  </p>\n' +
              '</div>'
          );
        }else{
          $('.order_address').append(
              '<div class="order_name">\n' +
              '  <p>\n' +
              '    <em>' + res.data.consignee + '</em>\n' +
              '    <em>' + res.data.cellphone + '</em>\n' +
              '  </p>\n' +
              '  <p>\n' +
              '    <span>' + address + '</span>\n' +
              '  </p>\n' +
              '</div>'
          );
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg(lan === 'cn'? '网络连接异常，请检查网络设置。' : 'Network connection exception, please check network settings.');
      }
    });
  }

  function loadDefaultShippingAddress(){
    $.ajax({
      url: '/common/shippingAddress?customerID=' + loginCustomer.customerID + '&C',
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        if(res.shippingAddressList.length === 0){
          $('.order_address').append('<div class="order-name">请添加配送地址</div>');
          return false;
        }

        let countryName = '';
        let provinceName = '';
        let cityName = '';
        let address = '';
        let defaultText = lan === 'cn' ? '默认' : 'Default';

        $.each(res.shippingAddressList, function (index, shippingAddress) {

          if(shippingAddress.defaultAddress){
            $('#hidden-shippingId').val(shippingAddress.shippingID);
            countryName = lan === 'cn'? shippingAddress.countryVO.countryNameCN : shippingAddress.countryVO.countryNameEN;
            provinceName = lan === 'cn'? shippingAddress.provinceVO.provinceNameCN : shippingAddress.provinceVO.provinceNameEN;
            cityName = lan === 'cn'? shippingAddress.cityVO.cityNameCN : shippingAddress.cityVO.cityNameEN;
            address = countryName + provinceName + cityName + shippingAddress.shippingStreet;

            $('.order_address').append(
                '<div class="order_name">\n' +
                '  <p>\n' +
                '    <em>' + shippingAddress.consignee + '</em>\n' +
                '    <em>' + shippingAddress.cellphone + '</em>\n' +
                '  </p>\n' +
                '  <p>\n' +
                '    <small>' + defaultText + '</small>\n' +
                '    <span>' + address + '</span>\n' +
                '  </p>\n' +
                '</div>'
            );
          }
        });
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg(lan === 'cn'? '网络连接异常，请检查网络设置。' : 'Network connection exception, please check network settings.');
      }
    });
  }

  $('#btn-preUrl').click(function(){
    location.href = '/shoppingCart';
  });

  $('.order_address a').click(function () {
    location.href = '/shippingAddress';
  });

  $('#btn-submit').click(function () {
    var order = {
      customerID: 0,
      orderAmount: 0,
      shippingAddressID: 0,
      orderItems: '',
      memo: '',
      loginUser: ''
    };
    if($('#hidden-shippingId').val() === ''){
      var msg = lan === 'cn' ? '请选择配送地址。' : 'Please choose shipping address.';
      layer.msg(msg);
      return false;
    }

    if($('.commodity_list_term li').length === 0){
      var msg = lan === 'cn' ? '没有需要提交的商品。' : 'No item to submit.';
      layer.msg(msg);
      return false;
    }

    order.customerID = loginCustomer.customerID;
    order.orderAmount = lan === 'cn' ? $('#totalAmount4RMB').text(): $('#totalAmount4USD').text();
    order.currencyType = lan === 'cn'? 'CNY' : 'USD';
    order.shippingAddressID = $('#hidden-shippingId').val();
    order.memo = $('#leave-message').val();
    order.loginUser = loginCustomer.account;

    var orderItems = [];
    var shoppingIdArray = [];
    $.each($('.commodity_list_term li'), function (index, item) {
      shoppingIdArray.push($(item).attr('data-shopping-id'));
      orderItems.push({
        itemID: $(item).attr('data-item-id'),
        itemCount: $.trim($(item).find('.div_right').text()).substr(1),
        itemAmount : lan === 'cn'? $.trim($(item).find('.div_center p.lan-cn b').text()) : $.trim($(item).find('.div_center p.lan-en b').text()),
        currencyType : lan === 'cn'? 'CNY' : 'USD',
        loginUser: loginCustomer.account
      });
    });

    order.shoppingCartIdList = shoppingIdArray.join(',');
    order.orderItems = JSON.stringify(orderItems);

    $.ajax({
      url: '/order',
      type: 'post',
      dataType: 'json',
      data: order,
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        location.href = '/apply?orderNumber=' + res.data;
      },
      error: function (XMLHttpRequest, textStatus) {
        msg = lan === 'cn'? '无法连接网络，请检查网络设置' : 'Network connection exception, please check network settings.';
        layer.msg(msg);
      }
    });
  });

  initPage();
});