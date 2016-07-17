import './addAddress.html'
import './addAddress.less'

$(function(){
  // 省市区
  $("#city-picker").cityPicker({
      toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">确定</button>\
      <h1 class="title">选择收货地址</h1>\
      </header>'
    });
});
