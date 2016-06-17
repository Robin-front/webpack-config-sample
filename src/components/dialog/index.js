import $ from 'components/jquery'
//加载模块css
require('./dialog.css');
//加载模板
import html from './dialog.handlebars'
import image from './images/1.png'

export default function() {
	var $dialog = $(html({image})).clone();
	$dialog.find('.close').on('click', function() {
		$dialog.fadeOut(function() {
			$(this).remove();
		});
	});
	$('body').append($dialog);
	$dialog.fadeIn();
}
