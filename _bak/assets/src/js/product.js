import $ from 'jquery';
import Swiper from 'swiper';
import PhotoSwipeMounter from 'jquery.photoswipe';
PhotoSwipeMounter($);

$(document).ready(function () {

  // Слайдер фотографии
  let productSlider = new Swiper('#product-photo-slider', {
    speed: 600,
    loop: true,
    // autoplay: {
    //   delay: 7000,
    // },
    spaceBetween: 20,
    slidesPerView: 2,
    slideActiveClass: 'is-active',
    pagination: {
      el: '#product-photo-slider-dots',
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      prevEl: '#product-photo-slider-prev',
      nextEl: '#product-photo-slider-next',
    },
    breakpoints: {
      767: {
        slidesPerView: 1,
        spaceBetween: 15,
        slideActiveClass: 'is-active',
      },
      1279: {
        slidesPerView: 1,
        spaceBetween: 15,
      },
    }
  });

  // Photoswiper для карточек
  var slideSelector = 'img',
    options = {
      bgOpacity: 0.8,
      closeEl: true,
      fullscreenEl: true,
      zoomEl: true,
      captionEl: false,
      counterEl: true,
      arrowEl: true,
      preloaderEl: true,
      closeOnScroll: true,
      tapToClose: true,
    },
    events = {
      close: function () {
      }
    };

  $('#product-photo-slider').photoSwipe(slideSelector, options, events);
  $('.js-zoom-btn').click(function() {
      $('.js-product-pic.is-active').find('img').click();
  });
});