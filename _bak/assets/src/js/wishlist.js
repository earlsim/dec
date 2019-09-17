import $ from 'jquery';
// window.$ = $;

$(document).ready(function () {

  var $headCount = $('.js-header-wish-count');
  var $wishCount = $('.js-wish-count');

  $('body').on('click', '.js-item-wish', function () {
    var $this = $(this);
    var $item = $this.closest('.js-item');
    var $wishItem = $this.closest('.js-wishlist-item');
    var id = parseInt($item.attr('data-id'));
    $('.js-wait-wrapper').addClass('is-active');
    $.post('/wishlist/toggle/', {html: 1, product_id: id}, function (response) {
        if (response.status == 'fail') {
          $('.js-wait-wrapper').removeClass('is-active');
        } else {
          $this.toggleClass('is-active');
          var $span = $this.find('.js-item-wish-span');
          var caption = $span.attr('data-text');
          var oldCaption = $span.text();
          $span.attr('data-text', oldCaption);
          $span.text(caption);
          $('.js-wait-wrapper').removeClass('is-active');

          if (response.data.wish.length) {
            $headCount.addClass('is-active');
          } else {
            $headCount.removeClass('is-active');
          }
          if (response.data.wish.length) {
            $wishCount.text(response.data.wish.length);
            $wishItem.animate({opacity: 0}, 200);
            $wishItem.remove();

            if ($('.js-wishes').length && !$('.js-wishlist-item').length) {
              location.reload();
            }
            
          } else {
            $wishCount.parent().hide();
            // $headCount.text('0');
            $('.js-wishes').html('<div class="page__msg">Нет товаров в избранном.</div>');
          }
        }
    }, "json");
    return false;
  });

  $('body').on('click', '.js-item-delete', function () {
    var $this = $(this);
    var $item = $this.closest('.js-cart-item');
    var id = parseInt($item.attr('data-id'));
    $('.js-wait-wrapper').addClass('is-active');
    $.post('delete/', { html: 1, id: id }, function (response) {
      if (response.data.count > 0) {
        $cartCount.html(response.data.count);
        $headerCount.html(response.data.count);
        $('.js-wait-wrapper').removeClass('is-active');
      } else {
        $cartCount.parent().hide();
        $headerCount.html('0');
        $('.js-wait-wrapper').removeClass('is-active');
      }
      $cartTotal.html(response.data.total);
      if (response.data.count == 0) {
        $('.js-cart').html('<div class="cart__h2">Ваша корзина пуста</div>');
      }
      $item.remove();
    }, "json");
    return false;
  });

});