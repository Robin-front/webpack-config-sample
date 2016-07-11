import './register.less'
import './register.html'

import { countdown } from 'components/utils'

$(function(){

  // 获取验证码倒计时
  $(document).on('click', '.J_get_code', function(){
    var _maxNum = 60; //倒计时数字
    var _this = $(this);
    if(!_this.hasClass("disable")){
        _this.addClass("disable");
        _this.html("剩余 "+_maxNum+" s");
        countdown(_maxNum, function(_num){
            _this.html("剩余 "+_num+" s");
        },function(){
            _this.html("重新获取");
            _this.removeClass("disable");
        });
    }
  });
  
});
