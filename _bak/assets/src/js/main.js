import $ from 'jquery';
import Swiper from 'swiper';
import magnificPopup from 'magnific-popup';
import Vivus from 'vivus';
import cookie from 'jquery.cookie';
import mask from 'jquery-mask-plugin';

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

  // Всплывашки
  var $popup = $('.js-mfp').magnificPopup({
    type: 'inline',
    closeBtnInside: true,
    focus: '#popup-name',
    preloader: false,
    removalDelay: 300,
    mainClass: 'mfp-fade'
  });

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
    }
    );
  });

  //EGG
  var eggI = 0;
  new Image().src = 'http://stepanchenko.me/egg/egg.png';
  new Audio().src = 'http://stepanchenko.me/egg/egg.mp3';
  $('.js-notify').click(function() {
    eggI++;
    if (eggI == 17) {
      var eggDiv = document.createElement('div');
      var $eggDiv = $(eggDiv);
      var $eggSound = new Audio;
      $eggSound.src = 'http://stepanchenko.me/egg/egg.mp3';
      $eggSound.play();
      eggDiv.className = 'js-egg-elem';
      $eggDiv.offset({
      }).css({
        'position': 'fixed',
        'right': '-205px',
        'bottom': '0',
        'background-image': 'url(http://stepanchenko.me/egg/egg.png)',
        'background-size': 'cover',
        'background-position': 'center center',
        'height': '205px',
        'width': '200px',
        'min-width': '0',
        'padding': '1px 9px',
        'z-index': '100',
        'pointer-events': 'none',
        'transition': 'none',
      }).animate({
        'right': '0',
      }, 200).appendTo($('body'))
        ;

      var eggInterval = setInterval(hideEgg, 800);
      var removeInterval = setTimeout(function () {
        clearInterval(eggInterval);
        clearTimeout(removeInterval);
      }, 800);

      function hideEgg() {
        $eggDiv.animate({
          'right': '-205px',
        }, 200);
      }

      var eggRemInterval = setInterval(removeEgg, 1000);
      var removeInterval = setTimeout(function () {
        clearInterval(eggRemInterval);
        clearTimeout(removeInterval);
      }, 1000);

      function removeEgg() {
        $eggDiv.remove();
      }
    }
  });

  // Валидатор телефона
  $(".js-phone").keypress(function(e) {
    phoneValid(e);
  });

  function phoneValid(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }
  $(".js-phone").mask("+7 (999) 999-99-99");

  // Плашка куков
  if (!$.cookie('wasAccept')) {
    $('.js-cookies-bar').fadeToggle();
    $('.js-cookies-btn').click(function() {

      $.cookie('wasAccept', true, {
        expires: 365,
        path: '/'
      });

      $('.js-cookies-bar').fadeToggle();

    });
  }

  // Отправщик форм
  $('body').on('submit', '.js-form', function (e) {
    e.preventDefault();
    $('.js-wait-wrapper').addClass('is-active');
    var $form = $(this);
    $.post($form.attr('action'), $form.serialize(), function (response) {
      if (response.status == 'fail' || response.status == null) {
        $('.js-wait-wrapper').removeClass('is-active');
        $.each(response.errors, function (key, val) {
          $form.find('[name="' + key + '"]')
            .closest('.js-field-wrap')
            .addClass('has-error')
            .find('.js-field-msg')
            .addClass('is-active')
            .text(val);
        });

        if ($form.find('.has-error').lenght) {
          $('html, body').animate({
            scrollTop: $form.find('.has-error').offset().top
          }, 1000);
        }

      } else if (response.status == 'ok') {
          $('.js-wait-wrapper').removeClass('is-active');
          $.magnificPopup.open({
          items: {
            src: '<div class="popup popup--transparent"><div class="popup__wrap">' + response.data.html + "</div></div>"
          },
          type: "inline",
          closeBtnInside: true,
          preloader: false,
          removalDelay: 300,
          mainClass: "mfp-fade"
        });
        $form[0].reset();
      }
    }, "json");
  });

});