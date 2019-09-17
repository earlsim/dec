import $ from 'jquery';
// window.$ = $;

$(document).ready(function () {

  var $headerBaloon = $('.js-header-cart-baloon');
  var $wishCount = $('.js-wish-count');

  $('body').on('click', '.js-item-tocart', function () {
    var $this = $(this);
    var $item = $this.closest('.js-item');
    var qty = $item.find('.js-item-qty-input').val();
    var id = parseInt($item.attr('data-id'));
    $.post('/cart/add/', { html: 1, product_id: id, quantity: qty }, function (response) {
      if (response.status == 'fail') {
        $item.find('.js-item-msg').html(response.errors).addClass('is-active');
      } else {
        console.log(response);
        $headerBaloon.fadeToggle();
        $headerBaloon.fadeToggle();
      }
    }, "json");
    // animateToCart($this);

    return false;
  });

});