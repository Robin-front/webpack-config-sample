import style from './index.css'
import dialog from 'components/dialog'
import $ from 'components/jquery'

const robin = () => {
  alert('hey reiki~,this is index');
  // 增加事件
  $('.btn').click(function() {
		dialog();
  });
}

robin()
