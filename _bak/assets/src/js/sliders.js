import $ from 'jquery';
import Swiper from 'swiper';
import magnificPopup from 'magnific-popup';
// import cookie from 'jquery.cookie';

$(document).ready(function() {

  // Главный слайдер
  let mainSlider = new Swiper('#main-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    spaceBetween: 60,
    slideActiveClass: 'is-active',
    navigation: {
      prevEl: '#main-slider-prev',
      nextEl: '#main-slider-next',
    },
    pagination: {
      el: '#main-slider-pagination',
      type: 'bullets',
      clickable: true,
    }
  });

  // Топ товаров
  let hTopProducts = new Swiper('#h-top-products', {
    speed: 600,
    loop: false,
    autoplay: {
      delay: 5000,
    },
    spaceBetween: 0,
    slidesPerView: 4,
    mousewheel: true,
    slideActiveClass: 'is-active',
    navigation: {
      prevEl: '#main-slider-prev',
      nextEl: '#main-slider-next',
    },
    scrollbar: {
      el: '#top-products-srollbar',
      dragEl: '#top-products-srollbar-btn',
      draggable: true,
      dragSize: 40,
      snapOnRelease: false,
    },
    breakpoints: {
      1023: {
        slidesPerView: 3,
      }
    }
  });

  // Похожие товаровы
  let hSimilarProducts = new Swiper('#similar-products-slider', {
    speed: 600,
    loop: false,
    autoplay: {
      delay: 5000,
    },
    spaceBetween: 0,
    slidesPerView: 4,
    mousewheel: true,
    slideActiveClass: 'is-active',
    navigation: {
      prevEl: '#similar-products-slider-prev',
      nextEl: '#similar-products-slider-next',
    },
    breakpoints: {
      1023: {
        slidesPerView: 3,
      }
    }
  });

  // Новости на главной
  let hNewsSlider = new Swiper('#h-news-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 7000,
    },
    spaceBetween: 20,
    slidesPerView: 2,
    slideActiveClass: 'is-active',
    navigation: {
      prevEl: '#h-news-slider-prev',
      nextEl: '#h-news-slider-next',
    },
    breakpoints: {
      767: {
        slidesPerView: 1,
        spaceBetween: 15,
        slideActiveClass: 'is-active',
      },
      1023: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
    }
  });

  // Инсталента на главной
  let hInstagram = new Swiper('#instagram-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 4000,
    },
    spaceBetween: 0,
    mousewheel: true,
    slidesPerView: 6,
    slideActiveClass: 'is-active',
    slideVisibleClass: 'is-visible',
    watchSlidesVisibility: true,
    navigation: {
      prevEl: '#instagram-slider-prev',
      nextEl: '#instagram-slider-next',
    },
    breakpoints: {
      767: {
        slidesPerView: 2,
      },
      1023: {
        slidesPerView: 3,
      },
    }
  });

});