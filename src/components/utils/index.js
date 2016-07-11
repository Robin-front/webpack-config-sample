
export const tip = function(_info,_style,_hideTime){ //_style的值有'tip_gray'、'tip_green',默认值为'tip_default'
    var randomClass = "tip"+Math.round(Math.random()*1000000000);
    var sty = _style?_style:"tip_default"
    var tiphtml = '<div class="tip_box '+sty+' '+randomClass+'">'+_info+'</div>';
    $("body").append(tiphtml);
    setTimeout(function(){
        $("."+randomClass).fadeOut(600,function(){
            $("."+randomClass).remove();
        });
    },_hideTime?_hideTime:2000)
}


export const countdown = function(_maxNum,_loopFun,_endFun){ //倒计时
    var _num = _maxNum;
    var timer_countdown = setInterval(function(){
        _loopFun  && _loopFun((--_num<10) ? "0"+_num : _num);
        if(_num < 1){
            clearInterval(timer_countdown);
            _endFun && _endFun();
        }
    },1000);
}
