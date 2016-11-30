import './my.html'
import './my.less'
// import './framework7.ios.min.css'
import '../../vendors/swiperout.js'
$(function(){
  $(".picker-age").calendar({});

  $('.save-age').on('click', function(){
    var value = $('.picker-age').val();

    // $.ajax({
    //   url: '/',
    //   type: 'post',
    //   data: {
    //     date: value
    //   },
    //   success: function(data){
    //     if (data.success == 1) {
          var age = new Date().getFullYear() - value.split('-')[0];
          $('.picker-age-val').text(age);
          $.closeModal('.popup-age');
    //     }
    //   }
    // })
  });

  $('.picker-gender').picker({
    toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">请选择性别</h1>\
    </header>',
    cols: [
      {
        textAlign: 'center',
        values: ['先生', '小姐']
      }
    ]
  });

  new Framework7().initSwipeout();

  $(document).on('click', '.swipeout-delete', function(e){
    var $this = $(this);
    var $li = $this.closest('li');
    $li.remove();
    console.log('点击了删除按钮', $this);
    console.log('list-Dom', $li);
  });
})
