import './FQA.less'
import './FQA.html'


$(function(){
  // 展开问题
  $(document).on('click', '.J_fqa_item', function(){
    $(this).toggleClass('open');
  });
})
