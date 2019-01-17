$(document).ready(function () {
  let lan = localStorage.getItem('siteLanguage');
  let loginCustomer = getLoginCustomer();

  function loadShippingAddressList() {
    $.ajax({
      url: '/common/shippingAddress?customerID=' + loginCustomer.customerID,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        if(res.shippingAddressList.length === 0){
          $('.container').append('<section style="text-align: center; padding-top: 15px">请添加配送地址</section>');
          return false;
        }

        var countryName = '';
        var provinceName = '';
        var cityName = '';
        var address = '';
        var defaultText = lan === 'cn' ? '默认' : 'Default';
        var editText = lan === 'cn' ? '编辑' : 'Edit';

        $.each(res.shippingAddressList, function (index, shippingAddress) {
          countryName = lan === 'cn'? shippingAddress.countryVO.countryNameCN : shippingAddress.countryVO.countryNameEN;
          provinceName = lan === 'cn'? shippingAddress.provinceVO.provinceNameCN : shippingAddress.provinceVO.provinceNameEN;
          cityName = lan === 'cn'? shippingAddress.cityVO.cityNameCN : shippingAddress.cityVO.cityNameEN;
          address = countryName + provinceName + cityName + shippingAddress.shippingStreet;
          if(shippingAddress.defaultAddress){
            $('.container').append(
                '<section class="order_address" data-id="' + shippingAddress.shippingID + '">\n' +
                '  <div class="order_name address-detail">\n' +
                '    <p>\n' +
                '      <em>' + shippingAddress.consignee + '</em>\n' +
                '      <em>' + shippingAddress.cellphone + '</em>\n' +
                '    </p>\n' +
                '    <p class="text-ellipsis">\n' +
                '      <small>' + defaultText + '</small>\n' +
                '      <span>' + address + '</span>\n' +
                '    </p>\n' +
                '  </div>\n' +
                '  <div class="address-edit">\n' +
                '    <a href="/addShippingAddress?option=E&shippingID=' + shippingAddress.shippingID + '">' + editText + '</a>\n' +
                '  </div>\n' +
                '</section>\n' +
                '<hr class="space">'
            );
          }else{
            $('.container').append(
                '<section class="order_address" data-id="' + shippingAddress.shippingID + '">\n' +
                '  <div class="order_name address-detail">\n' +
                '    <p>\n' +
                '      <em>' + shippingAddress.consignee + '</em>\n' +
                '      <em>' + shippingAddress.cellphone + '</em>\n' +
                '    </p>\n' +
                '    <p class="text-ellipsis">\n' +
                '      <span>' + address + '</span>\n' +
                '    </p>\n' +
                '  </div>\n' +
                '  <div class="address-edit">\n' +
                '    <a href="/addShippingAddress?option=E&shippingID=' + shippingAddress.shippingID + '">' + editText + '</a>\n' +
                '  </div>\n' +
                '</section>\n' +
                '<hr class="space">'
            );
          }
        });
        $('.order_address .address-detail').click(function () {
          let shippingID = $(this).parent().attr('data-id');
          location.href = 'order?' + 'shippingID=' + shippingID;
        });
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg(lan === 'cn'? '网络连接异常，请检查网络设置。' : 'Network connection exception, please check network settings.');
      }
    });
  }

  $('#btn-back').click(function () {
    location.href = 'order';
  });

  $('#btn-add').click(function () {
    location.href = '/addShippingAddress?option=N';
  });


  loadShippingAddressList();
});