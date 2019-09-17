import $ from 'jquery';
import Swiper from 'swiper';
import magnificPopup from 'magnific-popup';
import Vivus from 'vivus';
// import cookie from 'jquery.cookie';

$(document).ready(function() {

  // $(".js-phone").keypress(function(e) {
  //   phoneValid(e);
  // });

  // function phoneValid(evt) {
  //   var theEvent = evt || window.event;
  //   var key = theEvent.keyCode || theEvent.which;
  //   key = String.fromCharCode( key );
  //   var regex = /[0-9]|\./;
  //   if( !regex.test(key) ) {
  //     theEvent.returnValue = false;
  //     if(theEvent.preventDefault) theEvent.preventDefault();
  //   }
  // }
  // $(".js-phone").mask("+7 (999) 999-99-99");

  // Обработчик формы с ошибкой
  $('.js-select-btn').on('click', function() {
    $(this).closest('.js-select').find('.js-select-control').trigger('liszt:open');
    console.log($(this).closest('.js-select').find('.js-select-control'));
  });

  // Обработчик формы с ошибкой
  $('form').on('focus', '.has-error [type="text"], .has-error [type="email"], .has-error [type="checkbox"], .has-error [type="password"], .has-error textarea', function () {
    $(this).closest('.has-error').removeClass('has-error');
  });

  // Анимация waiterа
  var waiter = new Vivus('i-waiter', {duration: 140, file: '/wa-content/img/i-waiter.svg'});
  // function replayWaiter() {, replayWaiter
  //   waiter.stop();
  //   waiter.reset();
  //   waiter.play();
  // }

  // Показать ещё
  $('body').on('click', '.js-showmore-btn', function(e) {
    e.preventDefault();
    var $this = $(this);
    var type = $('.js-page-content').attr('data-type');
    var paging = $('.js-pagination').find('.js-pagination-items');
    var currentPage = paging.find('.js-pagination-item-active').text();
    var lastPage = paging.find('.js-pagination-item:last-child').text();
    var list = '.js-product-list';

    if (type == 'wishlist') {
      list = '.js-wishlist-list';
    }
    $('.js-wait-wrapper').addClass('is-active');   

    if (!currentPage.length) {
      return;
    }

    var nextPage = parseInt(currentPage)+1;
    var $form = $('.js-filter-form');

    $.get(location.pathname, $form.serialize() + '&page=' + nextPage, function (response) {
        var tmp = $('<div></div>').html(response);
        $(list).append(tmp.find(list).children());
        paging.html(tmp.find('.js-pagination-items').children());
        currentPage++;

        if (currentPage == lastPage) {
          $('.js-showmore').hide();
        }
      $('.js-wait-wrapper').removeClass('is-active');
    });
  });

});