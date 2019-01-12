$(document).ready(function () {
  let lan = localStorage.getItem('siteLanguage');
  let loginCustomer = getLoginCustomer();
  let option = $('#hidden-option').val();
  let shippingID = $('#hidden-shippingID').val();

  function initPage(){
    setDefaultOptions();
    setCountryOptions();
    setProvinceOptions($('#shipping-country option:selected').attr('value'));
    setCityOptions($('#shipping-country option:selected').attr('value'), $('#shipping-province option:selected').attr('value'));
    setPageOption();
    setEditData();
    $('input').lc_switch();
  }

  function setEditData() {
    if(option === 'E' && shippingID.length > 0){
      $.ajax({
        url: '/addShippingAddress/detail?shippingID=' + shippingID,
        type: 'get',
        success: function (res) {
          if(res.err){
            alertResponseError(res.code, res.msg);
            return false;
          }
          if(res.data === null){
            layer.msg(lan === 'cn'? '未查到对应配送信息。' : 'No shipping data.');
            return false;
          }
          $('#hidden-shippingID').val(res.data.shippingID);
          $('#shipping-country option[value="' + res.data.shippingCountryID + '"]').attr('selected', 'selected');
          //根据当前国家加载对应的省份列表
          setProvinceOptions(res.data.shippingCountryID);
          $('#shipping-province option[value="' + res.data.shippingProvinceID + '"]').attr('selected', 'selected');
          //根据当前省份加载对应的城市列表
          setCityOptions(res.data.shippingCountryID, res.data.shippingProvinceID);
          $('#shipping-city option[value="' + res.data.shippingCityID + '"]').attr('selected', 'selected');
          $('#shipping-address').val(res.data.shippingStreet);
          $('#addressee').val(res.data.consignee);
          $('#cellphone').val(res.data.cellphone);
          $('#isDefault').prop('checked', res.data.defaultAddress);
          if(res.data.defaultAddress){
            $('.lcs_checkbox_switch').removeClass('lcs_off');
            $('.lcs_checkbox_switch').addClass('lcs_on');
          }
        },
        error: function(XMLHttpRequest, textStatus){
          layer.msg(lan === 'cn'? 'Service异常，请稍后再试。' : 'Service error, please try again later.');
        }
      });
    }
  }

  function setDefaultOptions() {
    let countryPlaceholder = lan === 'cn'? '选择国家' : 'Choose Shipping Country';
    $('#shipping-country').append('<option value="-1">' + countryPlaceholder + '</option>');

    let provincePlaceholder = lan === 'cn'? '选择省份' : 'Choose Shipping Province';
    $('#shipping-province').append('<option value="-1">' + provincePlaceholder + '</option>');

    let cityPlaceholder = lan === 'cn'? '选择城市' : 'Choose Shipping City';
    $('#shipping-city').append('<option value="-1">' + cityPlaceholder + '</option>');

  }

  function setPageOption() {
    if(option === 'E'){
      $('.option').removeClass('hidden');
    }
  }

  function setCountryOptions(){
    $.ajax({
      url: '/common/country',
      async: false,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        $.each(res.countryList, function (index , country) {
          var countryID = country.countryID;
          var countryName = lan === 'cn'? country.countryNameCN : country.countryNameEN;
          $('#shipping-country').append('<option value="' + countryID + '">' + countryName + '</option>');
        });
        if(res.countryList.length > 0){
          if(lan === 'cn'){
            $.each($("#shipping-country option"), function (index, obj) {
              if($(obj).text() === '中国'){
                $("#shipping-country option").eq(index).attr("selected",true);
              }
            });

          }else if(lan === 'en'){
            $.each($("#shipping-country option"), function (index, obj) {
              if($(obj).text() === '中国'){
                $("#shipping-country option").eq(index).attr("selected",true);
              }
            });
          }else {
            $("#shipping-country").find("option:first").attr("selected",true);
          }
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg(lan === 'cn'? '网络连接异常，请检查网络设置。' : 'Network connection exception, please check network settings.');
      }
    });
  }

  function setProvinceOptions(countryID){
    $('#shipping-province option:not(:first)').remove();
    $('#shipping-city option:not(:first)').remove();
    $.ajax({
      url: '/common/province?countryID=' + countryID,
      async: false,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        if(res.provinceList === null || res.provinceList.length === 0){
          layer.msg(lan === 'cn'? '该国家下没有省份的信息。' : 'No province in this country.');
          return false;
        }
        $.each(res.provinceList, function (index , province) {
          var provinceID = province.provinceID;
          var provinceName = lan === 'cn'? province.provinceNameCN : province.provinceNameCN;
          $('#shipping-province').append('<option value="' + provinceID + '">' + provinceName + '</option>');
        });
        if(res.provinceList.length > 0){
          $('#shipping-province option:eq(1)').attr("selected",true);
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg(lan === 'cn'? '网络连接异常，请检查网络设置。' : 'Network connection exception, please check network settings.');
      }
    });
  }

  function setCityOptions(countryID, provinceID){
    $('#shipping-city option:not(:first)').remove();
    $.ajax({
      url: '/common/city?countryID=' + countryID + '&provinceID=' + provinceID,
      async: false,
      type: 'get',
      success: function (res) {
        if(res.err){
          alertResponseError(res.code, res.msg);
          return false;
        }
        if(res.cityList === null || res.cityList.length === 0){
          layer.msg(lan === 'cn'? '该省份下没有城市的信息。' : 'No city in this province.');
          return false;
        }
        $.each(res.cityList, function (index , city) {
          var cityID = city.cityID;
          var cityName = lan === 'cn'? city.cityNameCN : city.cityNameEN;
          $('#shipping-city').append('<option value="' + cityID + '">' + cityName + '</option>');
        });

        if(res.cityList.length > 0){
          $('#shipping-city option:eq(1)').attr("selected",true);
        }
      },
      error: function(XMLHttpRequest, textStatus){
        layer.msg(lan === 'cn'? 'Service异常，请稍后再试。' : 'Service error, please try again later.');
      }
    });
  }

  function checkData(){
    if(loginCustomer === null || loginCustomer.length === 0){
      layer.msg('请先登陆');
      return false;
    }

    if($('#shipping-country option:selected').val() === '-1'){
      layer.msg('请选择配送国家');
      return false;
    }
    if($('#shipping-province option:selected').val() === '-1'){
      layer.msg('请选择配送省份');
      return false;
    }
    if($('#shipping-city option:selected').val() === '-1'){
      layer.msg('请选择配送城市');
      return false;
    }
    if($('#shipping-address').val().length === 0){
      layer.msg('请输入详细地址');
      return false;
    }
    if($('#addressee').val().length === 0){
      layer.msg('请输入联系人');
      return false;
    }
    if($('#cellphone').val().length === 0){
      layer.msg('请输入联系人电话');
      return false;
    }
    return true;
  }

  function changeData() {
    $.ajax({
      url: '/addShippingAddress',
      type: 'put',
      dataType: 'json',
      data:{
        customerID: loginCustomer.customerID,
        shippingID: $('#hidden-shippingID').val(),
        shippingCountryID: $('#shipping-country option:selected').val(),
        shippingProvinceID: $('#shipping-province option:selected').val(),
        shippingCityID: $('#shipping-city option:selected').val(),
        shippingStreet: $('#shipping-address').val(),
        consignee: $('#addressee').val(),
        cellphone: $('#cellphone').val(),
        defaultAddress: $('#isDefault').prop('checked'),
        loginUser: loginCustomer.account
      },
      success: function (res) {
        if(res.error){
          let msg = lan === 'cn'? 'Service处理异常，请稍后再试。' : 'Service exception, please try again.';
          layer.msg(msg);
          return false;
        }
        location.href = '/shippingAddress';
      },
      error: function (XMLHttpRequest, textStatus) {
        let msg = lan === 'cn'? '无法连接网络，请检查网络设置' : 'Network connection exception, please check network settings.';
        layer.msg(msg);
      }
    });
  }

  function addData(){
    $.ajax({
      url: '/addShippingAddress',
      type: 'post',
      dataType: 'json',
      data:{
        customerID: loginCustomer.customerID,
        shippingCountryID: $('#shipping-country option:selected').val(),
        shippingProvinceID: $('#shipping-province option:selected').val(),
        shippingCityID: $('#shipping-city option:selected').val(),
        shippingStreet: $('#shipping-address').val(),
        consignee: $('#addressee').val(),
        cellphone: $('#cellphone').val(),
        defaultAddress: $('#isDefault').prop('checked'),
        loginUser: loginCustomer.account
      },
      success: function (res) {
        if(res.error){
          let msg = lan === 'cn'? 'Service处理异常，请稍后再试。' : 'Service exception, please try again.';
          layer.msg(msg);
          return false;
        }
        location.href = '/shippingAddress';
      },
      error: function (XMLHttpRequest, textStatus) {
        let msg = lan === 'cn'? '无法连接网络，请检查网络设置' : 'Network connection exception, please check network settings.';
        layer.msg(msg);
      }
    });
  }

  function deleteData(){
    $.ajax({
      url: '/addShippingAddress?shippingID=' + $('#hidden-shippingID').val(),
      type: 'delete',
      success: function (res) {
        if(res.error){
          let msg = lan === 'cn'? 'Service处理异常，请稍后再试。' : 'Service exception, please try again.';
          layer.msg(msg);
          return false;
        }
        location.href = '/shippingAddress';
      },
      error: function (XMLHttpRequest, textStatus) {
        let msg = lan === 'cn'? '无法连接网络，请检查网络设置' : 'Network connection exception, please check network settings.';
        layer.msg(msg);
      }
    });
  }

  $('#shipping-country').change(function () {
    var countryID = $(this).find('option:selected').attr('value');
    setProvinceOptions(countryID);
  });

  $('#shipping-province').change(function () {
    var countryID = $('#shipping-country option:selected').attr('value');
    var provinceID = $(this).find('option:selected').attr('value');
    setCityOptions(countryID, provinceID);
  });

  $('#btn-save').click(function () {
    if(!checkData()){
      return false;
    }
    if(option === 'E'){
      changeData();
    }else{
      addData();
    }
  });
  
  $('#btn-delete').click(function () {
    let confirmMsg = lan === 'cn'? '确认删除改地址？' : 'Do you confirm delete the address?';
    let okMsg = lan === 'cn'? '删除？' : 'Delete';
    let cancelMsg = lan === 'cn'? '取消' : 'Cancel';
    layer.confirm(confirmMsg, {
      btn: [okMsg,cancelMsg]
    }, function(index){
      deleteData();
    }, function(){
    });
  });
  
  initPage();
});