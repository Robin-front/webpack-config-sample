import './index.less'
import './index.html'
import swiper from 'vendors/swiper.min'

const index = () => {
  // 增加事件
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true
  });
}

index()
