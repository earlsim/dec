import $ from 'jquery';
import Swiper from 'swiper';
import magnificPopup from 'magnific-popup';
// import cookie from 'jquery.cookie';

$(document).ready(function() {

    //Выпадающая панель поиска
    $('.js-search-btn').click(function() {
        $('.js-search-wrap').toggleClass('is-active');
    });

    //Мобильное меню и обрабочик wrapper
    $(window).resize(function() {
        if ($(this).width() >= 992) {
          $('.js-m-menu-btn').removeClass('is-active');
          $('.js-m-menu').hide();
          $('.js-wrapper').removeClass('is-hidden');
        }
      });
    
      $('.js-m-menu-btn').click(function() {
        $('.js-wrapper').toggleClass('is-hidden');
      });
    
    //Мобильное (deep) глубокое меню
    $('.js-m-deep-btn').click(function() {
        $(this).closest('.js-m-deep-wrap').find('.js-m-deep').toggleClass('is-active');
    });
    
    //Мобильный (drop) каталог
    $('.js-m-catalog-btn').click(function() {
        $(this).closest('.js-m-catalog-item').toggleClass('is-active');
    });

    //Переход по ссылке из <SELECT>
    $('.js-select-control-url').change(function() {
      window.location.href=this.options[this.selectedIndex].value;
    });

});