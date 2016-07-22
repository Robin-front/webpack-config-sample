import './gasQuantity.less'
import './gasQuantity.html'
import Chart from './Chart.bundle.min.js'

$(function(){
  //表盘使用案例
  var _deg = 129; //【41deg ~ 229deg】
  setTimeout(function(){
      $(".used_point").css({"-webkit-transform": "rotateZ("+_deg+"deg)","transform": "rotateZ("+_deg+"deg)"});
  },800);

  var randomColor = function (_alpha){ //随机颜色
      var r = Math.floor(Math.random()*256);
      var g = Math.floor(Math.random()*256);
      var b = Math.floor(Math.random()*256);
      return "rgba("+r+","+g+","+b+","+_alpha+")";
  }
  var randomColorArr = function(_length){ //随机颜色数组
      var _arrs = new Array();
      for(var i= 0,len=_length; i<len; i++){
          _arrs.push(randomColor(.5));
      }
      return _arrs;
  }
  var ctx = document.getElementById("myChart");
  var colorArrs = randomColorArr(11);
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          datasets: [{
              label: '用量 m³/月',
              data: [12, 8, 3, 5, 2, 3, 6, 8, 3, 5, 2, 3],
              backgroundColor: colorArrs,
              borderColor: [ 'rgba(222, 219, 216, 1)' ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
});
