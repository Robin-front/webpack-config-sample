import style from './index.less'
import swiper from 'vendors/swiper.min'

const robin = () => {
  // 增加事件
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true
  });
}

robin()
