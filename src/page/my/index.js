import './my.html'
import './my.less'

$(function(){
  $(".picker-age").calendar({});

  $('.save-age').on('click', function(){
    var value = $('.picker-age').val();

    $.ajax({
      url: '/',
      type: 'post',
      data: {
        date: value
      },
      success: function(data){
        if (data.success == 1) {
          var age = new Date().getFullYear() - value.split('-')[0];
          $('.picker-age-val').text(age);
          $.closeModal('.popup-age');
        }
      }
    })
  });
})
