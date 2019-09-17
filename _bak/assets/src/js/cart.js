import $ from 'jquery';
// window.$ = $;

$(document).ready(function () {
  
  //+ используется нативный файл cart.js (WebAsyst)

  //Добавление товара в корзину
  var $headerBaloon = $('.js-header-cart-baloon');
  var $cartCount = $('.js-cart-count');

  $('body').on('click', '.js-item-tocart', function () {
    var $this = $(this);
    var $item = $this.closest('.js-item');
    var qty = $item.find('.js-item-qty-input').val();
    var id = parseInt($item.attr('data-id'));
    $.post('/cart/add/', { html: 1, product_id: id, quantity: qty }, function (response) {
      if (response.status == 'fail') {
        $item.find('.js-item-msg').html(response.errors).addClass('is-active');
      } else {
        $headerBaloon.fadeToggle();
        $headerBaloon.fadeToggle();
      }
    }, "json");
    // animateToCart($this);

    return false;
  });

  //Прилипание боковой панели в корзине и чекауте
  if (($('.js-page-content').attr('data-type') == 'cart' && $(window).width() > 1023) || ($('.js-page-content').attr('data-type') == 'checkout' && $(window).width() > 1023)) {

    (function(){
      var a = document.querySelector('.js-cart-sidebar'), b = null, P = 0;  // если ноль заменить на число, то блок будет прилипать до того, как верхний край окна браузера дойдёт до верхнего края элемента. Может быть отрицательным числом
      window.addEventListener('scroll', Ascroll, false);
      document.body.addEventListener('scroll', Ascroll, false);
      function Ascroll() {
        if (b == null) {
          var Sa = getComputedStyle(a, ''), s = '';
          for (var i = 0; i < Sa.length; i++) {
            if (Sa[i].indexOf('overflow') == 0 || Sa[i].indexOf('padding') == 0 || Sa[i].indexOf('border') == 0 || Sa[i].indexOf('outline') == 0 || Sa[i].indexOf('box-shadow') == 0 || Sa[i].indexOf('background') == 0) {
              s += Sa[i] + ': ' +Sa.getPropertyValue(Sa[i]) + '; '
            }
          }
          b = document.createElement('div');
          b.style.cssText = s + ' box-sizing: border-box; width: ' + a.offsetWidth + 'px;';
          a.insertBefore(b, a.firstChild);
          var l = a.childNodes.length;
          for (var i = 1; i < l; i++) {
            b.appendChild(a.childNodes[1]);
          }
          a.style.height = b.getBoundingClientRect().height + 'px';
          a.style.padding = '0';
          a.style.border = '0';
        }
        var Ra = a.getBoundingClientRect(),
            R = Math.round(Ra.top + b.getBoundingClientRect().height - document.querySelector('footer').getBoundingClientRect().top + 0);  // селектор блока, при достижении верхнего края которого нужно открепить прилипающий элемент;  Math.round() только для IE; если ноль заменить на число, то блок будет прилипать до того, как нижний край элемента дойдёт до футера
        if ((Ra.top - P) <= 0) {
          if ((Ra.top - P) <= R+41) {
            b.className = 'is-stop';
            b.style.top = - R-41 +'px';
          } else {
            b.className = 'is-sticky';
            b.style.top = P + 'px';
          }
        } else {
          b.className = '';
          b.style.top = '';
        }
        window.addEventListener('resize', function() {
          a.children[0].style.width = getComputedStyle(a, '').width
        }, false);
      }
      })()

  }


  $('.js-cart-scroll-btn').click(function () {
    var destination = $('.js-cart-sidebar').offset().top;
    // if ($(".js-header").addClass('is-fixed')) {
    //   destination = destination-100;
    // }
    $('html, body').animate({ scrollTop: destination }, 1000);
  });
  

});