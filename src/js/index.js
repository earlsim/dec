// Подключение глобальных модулей
import $ from 'jquery';
import Swiper from 'swiper';
import Vivus from 'vivus';
import flatpickr from "flatpickr";
import { Russian } from "../../node_modules/flatpickr/dist/l10n/ru.js"

// Подключение локальных модулей
import Range from './modules/Range';
import Select from './modules/Select';
import VModal from './modules/modal.js';

/* Глобальны е переменные - начало */

// Индикатор загрузки контента
window.contentHasLoaded = false;
// Индикатор прорисовки прелоадера
window.loaderHasDrawn = false;
/* Глобальны е переменные - конец */

// Страница загружена
window.addEventListener('load', function () {
  'use strict';
  if (window.preLoaderElement) {
    window.contentHasLoaded = true;
    showContent();
  }
  $('[data-color-count = 1]').trigger('click');
  $('.length-toggle').first().trigger('click');
});

// Дерево DOM построено и главные ресурсы загружены
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Date time
  // flatpickr("#", {
  //   // "locale": Russian,
  //   "locale": "ru",
  //   enableTime: true,
  //   time_24hr: true,
  //   dateFormat: "d-m-Y H:i",
  //   minDate: "today",
  //   maxDate: new Date().fp_incr(14),
  // });

  // Pre loader
  let preLoaderElement = window.preLoaderElement = document.querySelector('.js-pre-loader') || false;
  if (preLoaderElement) {
    let svgPreLoader = window.svgPreLoader = new Vivus('svg-pre-loader', {
        type: 'scenario',
    });
    svgPreLoader.reset().play(4, function () {
      window.loaderHasDrawn = true;
      preLoaderElement.querySelector('.pre-loader__inner').classList.add('animate');
      showContent();
    });
    document.querySelector("#svg-pre-loader").style.display = "block";
  }

  // Select города на странице оформления заказа
  // new Select(".js-field-select");

  // Range цены в каталоге
  new Range("field-range");

  // Конфигурация модальных окон
  VModal.init({
    disableScroll: true
  });

  // Head slider element
  let headSliderNode = document.querySelector('#head-slider') || false;

  // Header
  let header = window.header = document.querySelector('header.header') || false;

  // Header Slider
  // Слайдер в шапке на главной
  new Swiper('.js-head-slider', {
    speed: 1000,
    effect: 'fade',
    pagination: {
      el: '.js-head-slider-pagination',
      clickable: true,
      modifierClass: "head-slider__",
      bulletClass: "head-slider__bullet",
      bulletActiveClass: "head-slider__bullet--active",
    },
    navigation: {
      nextEl: '.js-head-slider-next',
      prevEl: '.js-head-slider-prev',
    },
  });
  // Слайдер быстрого заказа
  // new Swiper('.quick-order-slider', {
  //   speed: 1000,
  //   effect: 'fade',
  //   autoplay: {
  //     delay: 3000,
  //   },
  // });

  // Instagram Slider
  // Инстаграм слайдер на главной
  new Swiper('.js-inst-slider', {
    speed: 400,
    spaceBetween: 24,
    slidesPerView: 4,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 12,
      },
      425: {
        slidesPerView: 1
      }
    }
  });

  // Если страница при загрузке прокручена (показывает не верх страницы)
  // то скрываем слайдер, что бы его показать при прокрутке до верха страницы
  if (window.pageYOffset > 0 && headSliderNode) {
    headSliderNode.classList.add('head-slider--hidden');
    header.classList.remove('header--absolute');
    header.classList.remove('header--light');
    document.querySelector('.main').classList.remove('main--hidden');
  }

  // При скроле страницы смотрим докрутили ли мы до верха и если это так то показываем слайдер
  // с задержкой что бы не было глюков и рывков
  window.addEventListener('scroll', function (e) {
    if (window.pageYOffset === 0 && headSliderNode) {
      setTimeout(function (e) {
        if (window.pageYOffset === 0) {
          document.body.style.overflow = "hidden";
          document.querySelector('#head-slider').classList.remove('head-slider--hidden');
          document.querySelector('.header').classList.add('header--absolute');
          document.querySelector('.header').classList.add('header--light');
          document.querySelector('.main').classList.add('main--hidden');
        }
      }, 200);
    }
  });

  // Слайдер на главной странице, если он есть то мы его обрабатываем
  if (headSliderNode) {
    if (window.pageYOffset === 0) {
      document.body.style.overflow = "hidden";
    }
    document.querySelector('#head-slider').addEventListener('wheel', function (e) {
      if (e.deltaY > 0) {
        let func = function () {
          document.body.style.overflow = "visible";
          document.querySelector('.main').removeEventListener('transitionend', func);
        };
        document.querySelector('.main').addEventListener('transitionend', func);
        document.querySelector('.main').classList.remove('main--hidden');
        document.querySelector('#head-slider').classList.add('head-slider--hidden');
        document.querySelector('.header').classList.remove('header--absolute');
        document.querySelector('.header').classList.remove('header--light');
      }
    });
    /* Свайп вверх на телефоне (первый экран на главной странице) - начало */
    let initialPoint;
    let finalPoint;
    document.querySelector('#head-slider').addEventListener('touchstart', e => {
      e.preventDefault();
      e.stopPropagation();
      initialPoint = e.changedTouches[0];
    });
    document.querySelector('#head-slider').addEventListener('touchend', e => {
      e.preventDefault();
      e.stopPropagation();
      finalPoint = e.changedTouches[0];
      let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
      let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
      if (xAbs > 20 || yAbs > 20) {
        if (xAbs > yAbs) {
          if (finalPoint.pageX < initialPoint.pageX){
            /*СВАЙП ВЛЕВО*/
          } else {
            /*СВАЙП ВПРАВО*/
          }
        } else {
          if (finalPoint.pageY < initialPoint.pageY){
            /*СВАЙП ВВЕРХ*/
            let func = function () {
              document.body.style.overflow = "visible";
              document.querySelector('.main').removeEventListener('transitionend', func);
            };
            document.querySelector('.main').addEventListener('transitionend', func);
            document.querySelector('.main').classList.remove('main--hidden');
            document.querySelector('#head-slider').classList.add('head-slider--hidden');
            document.querySelector('.header').classList.remove('header--absolute');
            document.querySelector('.header').classList.remove('header--light');
          } else{
            /*СВАЙП ВНИЗ*/
          }
        }
      }
    });
    /* Свайп вверх на телефоне (первый экран на главной странице) - конец */
  }

  // Форма отправки быстрого заказа
  formQuickOrderSend();
  // Форма отправки обратной связи
  formFeedBackSend();
  formOrderSend();
  formWeddingSend();
  formQuestionSend();

  checkoutStepFirst();
  checkoutStepSecond();
  checkoutStepFourth();
  // checkoutFormSend();
  //
  deleteProductFromCart();

  // Header menu btn click
  // Кнопка меню в хедере при клике
  let menuBtn = window.menuBtn = document.querySelector('.js-menu-btn') || false;
  let menuContainer = window.menuContainer = document.querySelector('.js-menu-container') || false;
  if (menuBtn && menuContainer) {
    menuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      menuToggle();
    });
  }

  // Закрытие блока цветов в хедере (срабатывает при разрешении экрана меньше 1200px)
  let headerFlowersCloseBtn = document.querySelector('.js-header-flowers-close') || false;
  if (headerFlowersCloseBtn) {
    headerFlowersCloseBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (document.body.clientWidth < 1200) {
        document.querySelector('.js-header-menu-flowers-btn').parentNode.parentNode.classList.remove('is-opened');
        let headerFlowersContainer = this.parentNode.parentNode;
        if (window.header.classList.contains('header--absolute')) {
          window.header.classList.toggle('header--light')
        }
        let func = function () {
          headerFlowersContainer.style.display = 'none';
          headerFlowersContainer.removeEventListener('transitionend', func);
        };
        headerFlowersContainer.addEventListener('transitionend', func);
        headerFlowersContainer.classList.remove('is-active');
      }
    });
  }

  // Переключение табов букетов на главной странице
  [].slice.call(document.querySelectorAll('.js-tab-btn')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let id = parseInt(this.getAttribute('data-id'));
      [].slice.call(document.querySelectorAll('[data-tab-bouquets].is-active')).forEach(item => {
        item.classList.remove('is-active');
      });
      if (id > 0) {
        [].slice.call(document.querySelectorAll(`[data-tab-bouquets="${id}"]`)).forEach(item => {
          item.classList.add('is-active');
        });
      } else {
        [].slice.call(document.querySelectorAll(`[data-tab-bouquets]`)).forEach((item, id) => {
          if (id < 6) {
            item.classList.add('is-active');
          }
        });
      }
      [].slice.call(document.querySelectorAll('.js-tab-btn.is-active')).forEach(item => {
        item.classList.remove('is-active');
      });
      this.classList.add('is-active');
    }, false);
  });

  // Применение фильтров
  [].slice.call(document.querySelectorAll('.js-filter-apply')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      filters ();
    }, false);
  });


  //Подгрузка товаров на главной странице
  $('.js-showmore').click(function() {
    var $this = $(this);
    var paging = $('.js-pagination').find('.js-pagination-items');
    var currentPage = paging.find('.is-active').text();
    var lastPage = paging.find(".pagination__item").length - 2;

    if (!currentPage.length) {
      return;
    }

    var nextPage = parseInt(currentPage)+1;
    var $form = $('.js-filter-form');

    $.get(location.pathname, $form.serialize() + '&page=' + nextPage, function (response) {
      var tmp = $('<div></div>').html(response);
      $('.js-product-items').append(tmp.find('.js-product-items').children());
      paging.html(tmp.find('.js-pagination-items'));
      currentPage++;
      if (currentPage == lastPage) {
        $this.addClass('is-hidden');
      }
    });
  });
  // Button add in product card
  // var iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
  // var event = "click";
  // if(iOS != null) {event = "click"};
   $('body').on("click", '.js-product-add',function () {
     var cardToggle = $(this).closest('.js-toggle');
     cardToggle.toggleClass('is-active');
   });
  //   var productArray = $('.js-product-items').find(".js-item");
  //   [].slice.call(productArray.find(".js-product-add")).forEach(item => {
  //   "use strict";
  //   item.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     console.log(item);
  //     this.parentNode.parentNode.parentNode.classList.toggle('is-active');
  //   }, false);
  // });



  // Добавление товара в корзину со страницы товара
 // [].slice.call(document.querySelectorAll('.js-product-to-cart')).forEach(item => {
 //   "use strict";
 //   item.addEventListener('click', function (e) {
 //     e.preventDefault();
 //     let productInfoBlock = this.parentNode.parentNode;
 //     let productBlock = productInfoBlock.parentNode;
 //     let id = parseInt(productBlock.getAttribute('data-id'));
 //     let qnt = parseInt(productBlock.querySelector('.js-product-qnt [type=text]').value);
 //     fetch('/cart/add/', {method: 'POST', body: JSON.stringify({
 //        html: 1,
 //        product_id: id,
 //        quantity: qnt
 //        }),headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
 //       .then(
 //         function(response) {
 //           if (response.status !== 200) {
 //             console.log('Looks like there was a problem. Status Code: ' + response.status);
 //             return;
 //           }
 //
 //           // Examine the text in the response
 //           response.json().then(function(data) {
 //
 //             let messageElement = document.createElement('div');
 //             messageElement.classList.add('product__message');
 //             messageElement.classList.add('btn');
 //             messageElement.innerHTML = data.message;
 //             if (!data.success) {
 //               messageElement.style.backgroundColor = "red";
 //             }
 //             productInfoBlock.append(messageElement);
 //             setTimeout(function () {
 //               messageElement.remove();
 //             }, 2000);
 //
 //             if (data.data) {
 //               cartSetQuantity(data.data.quantity);
 //               cartSetSum(data.data.sum);
 //               document.querySelector('.header-cart').classList.remove('header-cart--empty');
 //             }
 //
 //           });
 //         }
 //       )
 //       .catch(function(err) {
 //         console.log('Fetch Error :-S', err);
 //       });
 //
 //   }, false);
 // });

 //  Has ajax request
 //  Button buy in product card
 // [].slice.call(document.querySelectorAll('.js-product-buy')).forEach(item => {
 //   "use strict";
 //   item.addEventListener('click', function (e) {
 //     e.preventDefault();
 //     let productCardElement = this.parentNode;
 //     let id = productCardElement.getAttribute('data-id');
 //     let qnt = parseInt(productCardElement.querySelector('.js-product-qnt [type=text]').value);
 //
 //     $.ajax({
 //       //url: `/response.php?test=cart-add`,
//         url: `/cart/add/${id}/${qnt}`,
//        success: function (res) {
//           console.log(res);
//          res = JSON.parse(res);
//          let messageElement = document.createElement('div');
//          messageElement.classList.add('product-card__message');
//          messageElement.classList.add('btn');
//          messageElement.innerHTML = res.message;
//          if (!res.success) {
//            messageElement.style.backgroundColor = "red";
//          }
//          productCardElement.append(messageElement);
//          productCardElement.classList.toggle('is-bought');
//          setTimeout(function () {
//            messageElement.remove();
//          }, 2000);
//
//          if (res.data) {
//            updateCartHeader(id, qnt);
//            cartSetQuantity(res.data.quantity);
//            cartSetSum(res.data.sum);
//            console.log(res.data);
//            document.querySelector('.header-cart').classList.remove('header-cart--empty');
//          }
//        }
//      });
//
      /*
      fetch(`/cart/add/${id}/${qnt}`)
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }

            response.json().then(function(data) {

              let messageElement = document.createElement('div');
              messageElement.classList.add('product-card__message');
              messageElement.classList.add('btn');
              messageElement.innerHTML = data.message;
              if (!data.success) {
                messageElement.style.backgroundColor = "red";
              }
              productCardElement.append(messageElement);
              productCardElement.classList.toggle('is-bought');
              setTimeout(function () {
                messageElement.remove();
              }, 2000);

              if (data.data) {
                cartSetQuantity(data.data.quantity);
                cartSetSum(data.data.sum);
                document.querySelector('.header-cart').classList.remove('header-cart--empty');
              }

            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
        */
//    }, false);
//  });
//
  // Button continue/close in product card
  // Продолжить/закрыть в карточке товара
  $(document).on('click', ".js-product-close",function (e) {
    e.preventDefault();
    var cardToggle = $(this).closest('.js-toggle');
    var item = $(this).closest('.js-item');
    cardToggle.toggleClass('is-active');
    if(this.hasAttribute('data-construct')) {}
    else { item.toggleClass('is-bought');}
  });

  // [].slice.call(document.querySelectorAll('.js-product-close')).forEach(item => {
  //   "use strict";
  //   item.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     this.parentNode.parentNode.parentNode.classList.remove('is-active');
  //     this.parentNode.classList.remove('is-bought');
  //   }, false);
  // });
  // Button (min & max) qnt in product card
  $(document).on('click', '.js-product-qnt [data-action]',function (e) {
    e.preventDefault();
    let inputElement = this.parentNode.querySelector('input[type=text]');
    let val = parseInt(inputElement.value);
    let actualPrice = parseInt(this.parentNode.parentNode.parentNode.dataset.price);
    if (!actualPrice) {actualPrice = parseInt(this.parentNode.parentNode.parentNode.parentNode.dataset.price)}
    let length = parseInt($('div[data-length-active]').attr('data-price'));
    if (isNaN(length)) {length = 0}
    let color = parseInt($('div[data-color-active]').attr('data-price'));
    if (isNaN(color)) {color = 0}
    if (!actualPrice) {actualPrice = parseInt($('.js-result-price').attr('data-new-price')) +  color + length;
    };

    let priceElem = this.parentNode.parentNode.querySelector('.product-card__price__value');
    if (priceElem === null) {
      priceElem = this.parentNode.parentNode.parentNode.querySelector('.js-product-price');
      if (priceElem == null) {
        priceElem = document.querySelector('.result-info__price');
      }
    }
    let sum = parseInt((priceElem).innerHTML);
    if (this.getAttribute('data-action') === 'min') {
      if (val <= 1) return;
      val = val - 1;
      if ( document.querySelector('.js-product-qnt').hasAttribute('data-construct') ) {
        wordForms(val);
        var colorCount = $('.js-color-toggle[data-color-active]').attr('data-color-count');

        if (!colorCount) {
          colorCount = $('.js-color-toggle').attr('data-color-count');
        }

        if (val == 20) {
          var currentImg = document.querySelector('.result-pic__img');
          var nextImg = currentImg.getAttribute('data-color-' + colorCount + '-first-src');
          currentImg.setAttribute('src', nextImg);
        } else if (val == 50) {
          var currentImg = document.querySelector('.result-pic__img');
          var nextImg = currentImg.getAttribute('data-color-' + colorCount + '-second-src');
          currentImg.setAttribute('src', nextImg);
        } else if (val == 100) {
          var currentImg = document.querySelector('.result-pic__img');
          var nextImg = currentImg.getAttribute('data-color-' + colorCount + '-third-src');
          currentImg.setAttribute('src', nextImg);
        }
      }

      sum = sum - actualPrice;
      $('.js-constr-qty').html(parseInt(val,10));
      animateConstructorNum(val);
      $('.js-span-qnt').html(parseInt(val,10));
    } else if (this.getAttribute('data-action') === 'max') {
      val = val + 1;
        if ( document.querySelector('.js-product-qnt').hasAttribute('data-construct') ) {
        wordForms(val);
        var colorCount = $('.js-color-toggle[data-color-active]').attr('data-color-count');
        if (!colorCount) {
          colorCount = $('.js-color-toggle').attr('data-color-count');
        }

          if (val == 21) {
            let currentImg = document.querySelector('.result-pic__img');
            let nextImg = currentImg.getAttribute('data-color-'+colorCount+'-second-src');
            currentImg.setAttribute('src', nextImg);
          }
          else if (val == 51) {
            let currentImg = document.querySelector('.result-pic__img');
            let nextImg = currentImg.getAttribute('data-color-'+colorCount+'-third-src');
            currentImg.setAttribute('src', nextImg);
          }
          else if (val == 101) {
            let currentImg = document.querySelector('.result-pic__img');
            let nextImg = currentImg.getAttribute('data-color-'+colorCount+'-fourth-src');
            currentImg.setAttribute('src', nextImg);
          }
        }
      sum = sum + actualPrice;
    } else {
      console.info('Undefined [data-action].');
      return;
    }
    if (val % 10 && val < 10) { val = `0${val}`; }
    inputElement.value = val;
    $('.js-constr-qty').html(parseInt(val,10));
    animateConstructorNum(val);
    priceElem.innerHTML = sum;
    colorNameChange();
  });

  // [].slice.call(document.querySelectorAll('.js-product-qnt [data-action]')).forEach(item => {
  //   "use strict";
  //   item.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     let inputElement = this.parentNode.querySelector('input[type=text]');
  //     let val = parseInt(inputElement.value);
  //     if (this.getAttribute('data-action') === 'min') {
  //       if (val <= 1) return;
  //       val = val - 1;
  //     } else if (this.getAttribute('data-action') === 'max') {
  //       val = val + 1;
  //     } else {
  //       console.info('Undefined [data-action].');
  //       return;
  //     }
  //     if (val % 10 && val < 10) { val = `0${val}`; }
  //     inputElement.value = val;
  //   }, false);
  // });

  // Has ajax request
  // Button (min & max) qnt in product cart
  [].slice.call(document.querySelectorAll('.js-product-cart-qnt [data-action]')).forEach(item => {
    "use strict";

    let timer;
    let timeout = 600;

    item.addEventListener('click', function (e) {
      e.preventDefault();
      let $this = $(this);
      let inputElement = this.parentNode.querySelector('input[type=text]');
      let val = parseInt(inputElement.value);
      let price = parseInt($(this).closest('.js-product-cart-item').find('.js-price-val').html().replace(/\s/g, ''));
      var sumPrice = parseInt(val * price);
      if (this.getAttribute('data-action') === 'min') {
        if (val <= 1) return;
        val = val - 1;
        $(this).closest('.js-product-cart-item').find('.js-qnt-val').html(val);
      } else if (this.getAttribute('data-action') === 'max') {
        val = val + 1;
        $(this).closest('.js-product-cart-item').find('.js-qnt-val').html(val);
      } else {
        console.info('Undefined [data-action].');
        return;
      }
      if (val % 10 && val < 10) { val = `0${val}`; }
      $(inputElement).val(val);
      let id = parseInt(this.parentNode.parentNode.getAttribute("data-cart-prod"));

      if (timer !== undefined) {
        clearTimeout(timer);
      }

      var actQty = $(inputElement).val();
      var cartQty = $('.js-header-cart-count');

      timer = setTimeout(() => {
        $.post('/cart/save/', {html: 1, id: id, quantity: actQty}, function (response) {
          if (response.status == 'ok') {
            cartSetQuantity(response.data.count);
            cartQty.html(response.data.count);
            cartSetSum(response.data.total.replace(' ₽', ''));
            var itemSum = response.data.item_total.replace(' ₽', '');
            $this.closest('.js-product-cart-item').find('.js-sum-val').html(itemSum);
            // that.val(response.data.q);
          }
          if (response.status == 'error') {
              alert(response.data.error);
          } else {
              // that.removeClass('error');
          }
        });

        // $.ajax({
        //   // url: `/response.php?test=cart-add`,
        //   url: `/cart/save/${id}/${val}`,
        //   success: function (res) {
        //     // console.log(res);
        //     // res = JSON.parse(res);
        //     cartSetQuantity(res.data.quantity);
        //     cartSetSum(res.data.sum);
        //   },
        //   error: function (err) {
        //     console.log(err);
        //   }
        // });
      }, timeout);

    }, false);
  });

  // Удаление товара из корзин
  $(".js-cart-product-delete").click(function () {
      var row = $(this).closest('.js-product-cart-item');
      var id = row.attr('data-cart-prod');
      var cartQty = $('.js-header-cart-count');

      $.post('/cart/delete/', {html: 1, id: id}, function (response) {
        cartSetQuantity(response.data.count);
        cartQty.html(response.data.count);
          if (response.data.count == 0) {
              location.reload();
          }
          row.remove();

          cartSetSum(response.data.total.replace(' ₽', ''));
      }, "json");
      return false;
  });
  // Input qnt in product card
  // [].slice.call(document.querySelectorAll('.js-product-qnt [type=text]')).forEach(item => {
  //   "use strict";
  //   item.addEventListener('input', function (e) {
  //     e.preventDefault();
  //     let inputElement = this;
  //     let actualPrice = parseInt(this.parentNode.parentNode.parentNode.dataset.price);
  //     if (!actualPrice) {actualPrice = parseInt(this.parentNode.parentNode.parentNode.parentNode.dataset.price)}
  //     let priceElem = this.parentNode.parentNode.querySelector('.product-card__price__value');
  //     if (priceElem === null) {
  //       priceElem = this.parentNode.parentNode.parentNode.querySelector('.js-product-price');
  //     }
  //     let val = parseInt(inputElement.value);
  //     let sum = val*actualPrice;
  //     if (Number.isNaN(val)) val = 0;
  //     if (val < 0) return;
  //     if (val % 10 && val < 10) {val = `0${val}`;}
  //     inputElement.value = val;
  //     if (isNaN(sum)) {
  //       priceElem.innerHTML = '0';
  //     } else {
  //       priceElem.innerHTML = sum;
  //     }
  //   }, false);
  // });

  $(document).on('input', '.js-product-qnt [type=text]', function(e) {
    e.preventDefault();
    let inputElement = this;
    let actualPrice = parseInt(this.parentNode.parentNode.parentNode.dataset.price);
    let length = parseInt($('div[data-length-active]').attr('data-price'));
    if (isNaN(length)) {length = 0}
    let color = parseInt($('div[data-color-active]').attr('data-price'));
    if (isNaN(color)) {color = 0}
    if (!actualPrice) {actualPrice = parseInt(this.parentNode.parentNode.parentNode.parentNode.dataset.price)}
    if (!actualPrice) {actualPrice = parseInt(document.querySelector('.js-result-price').dataset.price) + length + color}
    let priceElem = this.parentNode.parentNode.querySelector('.product-card__price__value');
    if (priceElem === null) {
      priceElem = this.parentNode.parentNode.parentNode.querySelector('.js-product-price');
    }
    if (priceElem === null) {
      priceElem = document.querySelector('.js-price');
    }
    let val = parseInt(inputElement.value);
    let sum = val*actualPrice;
    if (Number.isNaN(val)) val = 0;
    if (val < 0) return;
    if (val % 10 && val < 10) {val = `0${val}`;}
    inputElement.value = val;
    if (isNaN(sum)) {
      priceElem.innerHTML = '0';
    } else {
      priceElem.innerHTML = sum;
    }
    if ( document.querySelector('.js-product-qnt').hasAttribute('data-construct') ) {
      let inputElement = document.querySelector('.js-product-qnt [type=text]');
      let colorCount = $('.js-color-toggle[data-color-active]').attr('data-color-count');
      if (!colorCount) {colorCount = $('.js-color-toggle').attr('data-color-count');}
      let val = parseInt(inputElement.value);
      if (Number.isNaN(val)) val = 0;
      if (val < 0) return;
      if (val % 10 && val < 10) {val = `0${val}`;}
      inputElement.value = parseInt(val,10);
      if (isNaN(sum)) {
        priceElem.innerHTML = '0';
      } else {
        priceElem.innerHTML = sum;
        $('.js-constr-qty').html(parseInt(val,10));
        $('.js-span-qnt').html(parseInt(val,10));
      }

      wordForms(val);
      colorNameChange();

      if (val >= 0 && val < 21) {
        var currentImg = document.querySelector('.result-pic__img');
        var nextImg = currentImg.getAttribute('data-color-' + colorCount + '-first-src');
        currentImg.setAttribute('src', nextImg);
      }
      else if (val >= 21 && val < 51) {
        let currentImg = document.querySelector('.result-pic__img');
        let nextImg = currentImg.getAttribute('data-color-' + colorCount + '-second-src');
        currentImg.setAttribute('src', nextImg);
      }
      else if (val >= 51 && val < 101) {
        let currentImg = document.querySelector('.result-pic__img');
        let nextImg = currentImg.getAttribute('data-color-' + colorCount + '-third-src');
        currentImg.setAttribute('src', nextImg);
      }
      else if (val  >= 101) {
        let currentImg = document.querySelector('.result-pic__img');
        let nextImg = currentImg.getAttribute('data-color-' + colorCount + '-fourth-src');
        currentImg.setAttribute('src', nextImg);
      }
    }
  });

  // Кнопка отображения списка цветов в хедере
  let headerMenuFlowersBtn = document.querySelector('.js-header-menu-flowers-btn') || false;
  if (headerMenuFlowersBtn) {
    headerMenuFlowersBtn.addEventListener('click', function (e) {
      e.preventDefault();
      let headerFlowersContainer = document.querySelector('.header-flowers-container');
      if (headerFlowersContainer.classList.contains('is-active')) {
        headerFlowersContainer.classList.remove('is-active');
        let func = function () {
          headerFlowersContainer.style.display = 'none';
          headerFlowersContainer.removeEventListener('transitionend', func);
        };
        headerFlowersContainer.addEventListener('transitionend', func);
      } else {
        headerFlowersContainer.style.display = 'block';
        setTimeout(() => {
          headerFlowersContainer.classList.add('is-active');
        }, 0);
        if (document.body.clientWidth < 1200) {
          menuToggle();
        }
      }
      if (document.querySelector('.header').classList.contains('header--absolute')) {
        document.querySelector('.header').classList.toggle('header--light')
      }
      this.parentNode.parentNode.classList.toggle('is-opened');
    }, false);
  }
  //  Отправка письма обратной связи
    $("#contact-email").on("click", function() {

      var name = $("#name").val();
      var email = $("#email").val();
      var message = $("#message").val();
      var policy = $("#policy").val();

      $.ajax({

        url: "/contact-form.php",
        type: "post",

        data: {
          "name": name,
          "email": email,
          "message": message,
          "policy" : policy
        },

        success: function(data) {

          $(".contact-result").html(data);

        }

      });

    });



  // Кнопка выподающего списка меню в хедере
  [].slice.call(document.querySelectorAll('.js-header-menu-icon')).forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      console.log(this);
    }, false);
  });

  // Кнопка переключения блока фильтра show/hide
  let filterBtnList = document.querySelectorAll('.js-filter-btn');
  [].slice.call(filterBtnList).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      [].slice.call(filterBtnList).forEach(item => {
        if (item !== this && item.parentNode.classList.contains('is-active')) {
          hideFilterBlock(item.parentNode);
        }
      });
      if (this.parentNode.classList.contains('is-active')) {
        hideFilterBlock(this.parentNode);
      } else {
        showFilterBlock(this.parentNode);
      }
    }, false);
  });

  // Кнопка сброса фильтра
  let filterBtnResetList = document.querySelectorAll('.js-filter-reset');
  [].slice.call(filterBtnResetList).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let id = parseInt(this.getAttribute('data-id'));
      console.log(id);
      if (id === 1) {
        filtersWithoutFlowers();
      } else if (id === 2) {
        filtersWithoutColors();
      } else if (id === 3) {
        filtersWithoutPrice();
      } else if (id === 4) {
        filtersWithoutBoxes();
      }
    }, false);
  });

  // Переключение шагов на странице заказа при клике на него
  let checkoutToggleList = document.querySelectorAll('.js-checkout-toggle');
  [].slice.call(checkoutToggleList).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      if (!e.currentTarget.parentNode.classList.contains('is-success')) {
        return;
      }
      let id = Number(e.currentTarget.querySelector('.checkout-step__title').getAttribute('data-id'));
      // console.log(id);
      // console.log(e.target.querySelector('.checkout-step__title').getAttribute('data-id'));
      [].slice.call(checkoutToggleList).forEach(item => {
        if (item !== this) {
          if (Number(item.querySelector('.checkout-step__title').getAttribute('data-id')) >= id) {
            item.parentNode.classList.remove('is-success');
          }
          item.parentNode.classList.remove('is-active');
        }
      });
      if (!this.parentNode.classList.contains('is-active')) {
        item.parentNode.classList.toggle('is-active');
      }
    }, false);
  });

  // Has ajax request
  // Переключение шагов на странице заказа при клике на кнопку "Далее"
  let checkoutBtnList = document.querySelectorAll('.js-checkout-btn');
  [].slice.call(checkoutBtnList).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let id = parseInt(this.getAttribute('data-checkout-step'));
      let fields = document.querySelectorAll(`[data-validate-step="${id}"]`);
      let form = new FormData(document.getElementById('checkout'));

      /*
      fetch('response.php', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: form
      })
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }

            // Examine the text in the response
            response.json().then(function(data) {

              let messageElement = document.createElement('div');
              messageElement.classList.add('product__message');
              messageElement.classList.add('btn');
              messageElement.innerHTML = data.message;
              if (!data.success) {
                messageElement.style.backgroundColor = "red";
              }
              productInfoBlock.append(messageElement);
              setTimeout(function () {
                messageElement.remove();
              }, 2000);

            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
      */

      // Сбрасываем предыдущие ошибки полей перед запросом
      [].slice.call(document.querySelectorAll('#checkout .has-error')).forEach(function (item) {
        item.classList.remove('has-error');
      });

      $.ajax({
        url: `/response.php?test=step-${id}`,
        // url: `/checkout/step/${id}`,
        method: "POST",
        data: $(document.getElementById('checkout')).serialize(),
        success: function (res) {
          // console.log(res);
          res = JSON.parse(res);
          let stepNext = document.querySelector(`[data-id="0${(id + 1)}"]`) || false;
          if (stepNext) {
            document.querySelector(`[data-id="0${id}"]`).parentNode.parentNode.classList.remove('is-active');
            document.querySelector(`[data-id="0${id}"]`).parentNode.parentNode.classList.add('is-success');
            setTimeout(function () {
              stepNext.parentNode.parentNode.classList.add('is-active');
              requestAnimationFrame(() => {
                smoothScrollTo(stepNext.parentNode.parentNode);
              });
            }, 600);
            if (res.hasOwnProperty('auth') && res.auth) {
              window.location.reload();
              return false;
              /*
              document.querySelector(`form input[name="_token"]`).value = res.token;
              document.querySelector(`form input[name="first_name"]`).value = res.user.first_name;
              document.querySelector(`form input[name="last_name"]`).value = res.user.last_name;
              document.querySelector(`form input[name="phone"]`).value = res.user.phone;
              document.querySelector(`form input[name="email"]`).value = res.user.email;
              */
            }
          }
        },
        errors: function (err) { console.log(err); },
        statusCode: {
          422: function (res) {
            // console.log(res);
            res = res.responseJSON;
            // res = JSON.parse(res);
            for (let name in res.errors) {
              if (res.errors.hasOwnProperty(name)) {
                // console.log(`input[name="${name}"]`);
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });

      /*
      return true;
      let stepNext = document.querySelector(`[data-id="0${(id + 1)}"]`) || false;
      if (stepNext) {
        document.querySelector(`[data-id="0${id}"]`).parentNode.parentNode.classList.remove('is-active');
        document.querySelector(`[data-id="0${id}"]`).parentNode.parentNode.classList.add('is-success');
        setTimeout(function () {
          stepNext.parentNode.parentNode.classList.add('is-active');
          requestAnimationFrame(() => {
            smoothScrollTo(stepNext.parentNode.parentNode);
          });
        }, 600);
      }
       */
    }, false);
  });

  // Modals
  let modalFeedbackBtns = document.querySelectorAll('.js-modal-feedback-btn') || false;
  if (modalFeedbackBtns.length > 0) {
    [].slice.call(modalFeedbackBtns).forEach(item => {
      "use strict";
      item.addEventListener('click', function (e) {
        e.preventDefault();
        VModal.show('modal-feedback');
      });
    })
  }
  let modalWeddingBtns = document.querySelectorAll('.js-modal-wedding-btn') || false;
  if (modalWeddingBtns.length > 0) {
    [].slice.call(modalWeddingBtns).forEach(item => {
      "use strict";
      item.addEventListener('click', function (e) {
        e.preventDefault();
        VModal.show('modal-wedding');
      });
    })
  }

  // Modals
  let modalOrderBtn = document.querySelectorAll('.js-modal-order-btn') || false;
  if (modalOrderBtn.length > 0) {
    modalOrderBtn.addEventListener('click', function (e) {
      e.preventDefault();
      // VModal.show('modal-order');
    });
  }

  // Header shopping cart
  let headerCartBtn = document.querySelector('.js-header-cart') || false;
  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.js-header-cart-container').classList.toggle('is-opened');
    });
  }

  // Наведение на название цветка в хедере
  let headerFlowersLink = document.querySelectorAll('.js-header-flowers-link');
  [].slice.call(headerFlowersLink).forEach(item => {
    "use strict";
    item.addEventListener('mouseenter', function (e) {
      e.preventDefault();
      [].slice.call(headerFlowersLink).forEach(item => {
        "use strict";
        if (item.classList.contains('is-active')) {
          item.classList.remove('is-active');
        }
      });
      document.querySelector('#header-flowers-pic .header-flowers__img').remove();
      this.classList.toggle('is-active');
      let img = document.createElement('img');
      img.src = this.getAttribute('data-img');
      img.classList.add('header-flowers__img');
      document.querySelector('#header-flowers-pic').appendChild(img);
    }, false);
  });

  //
  let filtersBtn = document.querySelector('.js-filters-btn') || false;
  if (filtersBtn) {
    filtersBtn.addEventListener('click', e => {
      e.preventDefault();
      e.currentTarget.parentNode.classList.toggle('is-active');
    });
  }

  /* Избранное - начало */
  // Добавление в избранное из карточки товара
  // Has ajax request
  // js-favorites-add-card
  $(document).on('click', ".js-product-to-favorites", function (e) {
    e.preventDefault();
    let productCardElement = this.parentNode;
    var productId = productCardElement.getAttribute('data-id');

    $.post("/wishlist/toggle/", {html: 1, product_id: productId}, function (res) {
      // url: `/favorites/add/${id}`,
      let messageElement = document.createElement('div');
      messageElement.classList.add('product-card__message');
      messageElement.classList.add('btn');
      messageElement.innerHTML = res.data.message;
      if (res.status != 'ok') {
        messageElement.innerHTML = res.errors.message;
        messageElement.style.backgroundColor = "red";
      }
      productCardElement.append(messageElement);
      productCardElement.classList.toggle('is-bought');
      productCardElement.classList.toggle('is-infav');
      setTimeout(function () {
        messageElement.remove();
      }, 2000);
    });
  });
  // [].slice.call(document.querySelectorAll('.js-product-to-favorites')).forEach(item => {
  //   "use strict";
  //   item.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     let productCardElement = this.parentNode;
  //     var productId = productCardElement.getAttribute('data-id');
  //
  //     $.post("/wishlist/toggle/", {html: 1, product_id: productId}, function (res) {
  //       // url: `/favorites/add/${id}`,
  //         let messageElement = document.createElement('div');
  //         messageElement.classList.add('product-card__message');
  //         messageElement.classList.add('btn');
  //         messageElement.innerHTML = res.data.message;
  //         if (res.status != 'ok') {
  //           messageElement.innerHTML = res.errors.message;
  //           messageElement.style.backgroundColor = "red";
  //         }
  //         productCardElement.append(messageElement);
  //         productCardElement.classList.toggle('is-bought');
  //         productCardElement.classList.toggle('is-infav');
  //         setTimeout(function () {
  //           messageElement.remove();
  //         }, 2000);
  //     });
  //   }, false);
  // });
  // Добавление товара в избранное со страницы товара
  // Has ajax request
  // js-favorites-add
  [].slice.call(document.querySelectorAll('.js-product-like')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let productCardElement = this.parentNode;
      var productId = productCardElement.getAttribute('data-id');

      $.post("/wishlist/toggle/", {html: 1, product_id: productId}, function (res) {
        // url: `/favorites/add/${id}`,
        let messageElement = document.createElement('div');
        messageElement.classList.add('product-card__message');
        messageElement.classList.add('btn');
        messageElement.innerHTML = res.data.message;
        if (res.status != 'ok') {
          messageElement.innerHTML = res.errors.message;
          messageElement.style.backgroundColor = "red";
        }
        productCardElement.childNodes[3].append(messageElement);
        productCardElement.classList.toggle('is-bought');
        productCardElement.classList.toggle('is-infav');
        setTimeout(function () {
          messageElement.remove();
        }, 2000);
      });
      // let id = parseInt(this.parentNode.getAttribute('data-id'));

      /*
      fetch(`/favorites/add/${id}`)
        .then(
          function(response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return;
            }

            response.json().then(function(data) {

              console.log(data);

            });
          }
        )
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
        */

      // $.ajax({
      //   url: "/response.php?test=favorites-add",
      //   // url: `/favorites/add/${id}`,
      //   success: function (res) {
      //     // console.log(res);
      //     res = JSON.parse(res);
      //     if (res.success) {
      //       console.log(res);
      //     }
      //   }
      // });

    }, false);
  });


  [].slice.call(document.querySelectorAll('.js-favorites-delete')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let productCardElement = this.parentNode;
      var productId = productCardElement.getAttribute('data-id');
      // console.log(favoritesCount);
      $.post("/wishlist/toggle/", {html: 1, product_id: productId}, function (res) {
        // url: `/favorites/delete/${id}/`,
          // console.log(res);
          if (res.status == 'ok') {
            productCardElement.parentNode.parentNode.parentNode.remove();
            let count = res.data.count;
            // favoritesSetQuantity(res.data.quantity);
            $('.page__title--data').attr('data-content', count);
            // favoritesCount.val(res.data.count);
            if (res.data.count === 0) {
              let favoritesPage = document.querySelector("#favorites-page") || false;
              if (favoritesPage) {
                favoritesPage.querySelector(".catalog__body").remove();
                let div = document.createElement('div');
                div.classList.add('page__empty');
                div.innerText = "Нет товаров в избранном.";
                favoritesPage.append(div);
              }
              location.reload();
            }
          }

      });
    }, false);
  });
  /* Избранное - конец */

  /*
  // Удаление товара из корзины в хедере
  let headerCartProductClose = document.querySelectorAll('.js-header-cart-product-close');
  [].slice.call(headerCartProductClose).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let id = this.getAttribute('data-id') || 0;
      let productElement = this.parentNode.parentNode;

      $.ajax({
        // url: `/response.php`,
        url: `/cart/delete/${id}`,
        success: function (res) {
          // res = JSON.parse(res);
          console.log(res);
          productElement.remove();
          let productCartElement = document.querySelector(`[data-cart-product-id="${id}"]`) || false;
          if (productCartElement) {
            productCartElement.remove();
          }
          cartSetQuantity(res.data.quantity);
          cartSetSum(res.data.sum);
          if (res.data.quantity === 0) {
            createBlockCartEmpty();
            document.querySelector('.header-cart').classList.add('header-cart--empty');
            let shoppingCartPage = document.querySelector("#shopping-cart-page") || false;
            if (shoppingCartPage) {
              shoppingCartPage.querySelector(".page__content").remove();
              let div = document.createElement('div');
              div.classList.add('page__empty');
              div.innerText = "Ваша корзина пуста";
              shoppingCartPage.append(div);
            }
          }
        },
        error: function (err) {
        }
      });
      // this.parentNode.parentNode.remove();
    }, false);
  });

  // Удаление товара из корзины в хедере
  let cartProductClose = document.querySelectorAll('.js-cart-product-close');
  [].slice.call(cartProductClose).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let id = this.getAttribute('data-id') || 0;
      let productElement = this.parentNode;

      $.ajax({
        // url: `/response.php`,
        url: `/cart/delete/${id}`,
        success: function (res) {
          // res = JSON.parse(res);
          console.log(productElement);
          productElement.remove();
          let productCartElement = document.querySelector(`[data-cart-product-id="${id}"]`) || false;
          if (productCartElement) {
            productCartElement.remove();
          }
          cartSetQuantity(res.data.quantity);
          cartSetSum(res.data.sum);
          if (res.data.quantity === 0) {
            createBlockCartEmpty();
            document.querySelector('.header-cart').classList.add('header-cart--empty');
            let shoppingCartPage = document.querySelector("#shopping-cart-page") || false;
            if (shoppingCartPage) {
              shoppingCartPage.querySelector(".page__content").remove();
              let div = document.createElement('div');
              div.classList.add('page__empty');
              div.innerText = "Ваша корзина пуста";
              shoppingCartPage.append(div);
            }
          }
        },
        error: function (err) {}
      });
      // this.parentNode.parentNode.remove();
    }, false);
  });
  */

  /*
  let rangeInputList = document.querySelectorAll('.js-field-range input');
  [].slice.call(rangeInputList).forEach(item => {
    "use strict";
    item.addEventListener('input', function (e) {
      e.preventDefault();
      [].slice.call(rangeInputList).forEach(item => {
        if (this.name === 'field-range-upper') {
          document.querySelector('input[name="price-max"]').value = this.value;
        } else if (this.name === 'field-range-lower') {
          document.querySelector('input[name="price-min"]').value = this.value;
        }
      });
    }, false);
  });
  */

}, false);

// Загрузка лоадера и контента отображение контента после лоадера
function showContent () {
  setTimeout(function () {
    if (window.loaderHasDrawn && window.contentHasLoaded) {
      let f = event => {
        event.target.removeEventListener('transitionend', f);
        event.target.style.display = "none";
      };
      window.preLoaderElement.addEventListener('transitionend', f);
      requestAnimationFrame(function () {
        window.svgPreLoader.play(-4, function () {
          // console.log('111');
          window.preLoaderElement.querySelector('.pre-loader__inner').classList.remove('animate');
          window.preLoaderElement.classList.add('is-hidden');
        });
      });
    }
  }, 1000);
}

// Отображение блока фильтров в каталоге
function showFilterBlock (elem) {
  elem.querySelector('.filter__body').style.display = 'block';
  setTimeout(() => {
    elem.classList.add('is-active');
  }, 0);
}

// Скрытие блока фильтров в каталоге
function hideFilterBlock (elem) {
  let func = function () {
    elem.querySelector('.filter__body').style.display = 'none';
    elem.removeEventListener('transitionend', func);
  };
  elem.addEventListener('transitionend', func);
  elem.classList.remove('is-active');
}

/* Функции для фильтров в каталоге - начало */
function filters () {
  let params = [];
  let flowers = document.querySelectorAll('[data-filter-flower] input[type=checkbox]:checked');
  let colors = document.querySelectorAll('[data-filter-color] input[type=checkbox]:checked');
  let priceMin = parseInt(document.querySelector('[data-filter-price-min] input[type=text]').value);
  let priceMax = parseInt(document.querySelector('[data-filter-price-max] input[type=text]').value);
  let boxes = document.querySelectorAll('[data-filter-box] input[type=checkbox]:checked');
  if (flowers.length > 0) {
    params[params.length] = [];
    [].slice.call(flowers).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `flowers=` + params[params.length - 1].join(',');
  }
  if (colors.length > 0) {
    params[params.length] = [];
    [].slice.call(colors).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `colors=` + params[params.length - 1].join(',');
  }
  if (boxes.length > 0) {
    params[params.length] = [];
    [].slice.call(boxes).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `boxes=` + params[params.length - 1].join(',');
  }
  if (priceMin > 0) {
    params[params.length] = `price_min=${priceMin}`;
  }
  params[params.length] = `price_max=${priceMax}`;
  window.location.search = `?` + params.join('&');
}

function filtersWithoutFlowers () {
  let params = [];
  // let flowers = document.querySelectorAll('[data-filter-flower] input[type=checkbox]:checked');
  let colors = document.querySelectorAll('[data-filter-color] input[type=checkbox]:checked');
  let priceMin = parseInt(document.querySelector('[data-filter-price-min] input[type=text]').value);
  let priceMax = parseInt(document.querySelector('[data-filter-price-max] input[type=text]').value);
  let boxes = document.querySelectorAll('[data-filter-box] input[type=checkbox]:checked');
  /*
  if (flowers.length > 0) {
    params[params.length] = [];
    [].slice.call(flowers).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `flowers=` + params[params.length - 1].join(',');
  }
   */
  if (colors.length > 0) {
    params[params.length] = [];
    [].slice.call(colors).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `colors=` + params[params.length - 1].join(',');
  }
  if (boxes.length > 0) {
    params[params.length] = [];
    [].slice.call(boxes).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `boxes=` + params[params.length - 1].join(',');
  }
  if (priceMin > 0) {
    params[params.length] = `min=${priceMin}`;
  }
  params[params.length] = `max=${priceMax}`;
  window.location.search = `?` + params.join('&');
}

function filtersWithoutColors () {
  let params = [];
  let flowers = document.querySelectorAll('[data-filter-flower] input[type=checkbox]:checked');
  // let colors = document.querySelectorAll('[data-filter-color] input[type=checkbox]:checked');
  let priceMin = parseInt(document.querySelector('[data-filter-price-min] input[type=text]').value);
  let priceMax = parseInt(document.querySelector('[data-filter-price-max] input[type=text]').value);
  let boxes = document.querySelectorAll('[data-filter-box] input[type=checkbox]:checked');
  if (flowers.length > 0) {
    params[params.length] = [];
    [].slice.call(flowers).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `flowers=` + params[params.length - 1].join(',');
  }
  /*
  if (colors.length > 0) {
    params[params.length] = [];
    [].slice.call(colors).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `colors=` + params[params.length - 1].join(',');
  }
   */
  if (boxes.length > 0) {
    params[params.length] = [];
    [].slice.call(boxes).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `boxes=` + params[params.length - 1].join(',');
  }
  if (priceMin > 0) {
    params[params.length] = `min=${priceMin}`;
  }
  params[params.length] = `max=${priceMax}`;
  window.location.search = `?` + params.join('&');
}

function filtersWithoutPrice () {
  let params = [];
  let flowers = document.querySelectorAll('[data-filter-flower] input[type=checkbox]:checked');
  let colors = document.querySelectorAll('[data-filter-color] input[type=checkbox]:checked');
  // let priceMin = parseInt(document.querySelector('[data-filter-price-min] input[type=text]').value);
  // let priceMax = parseInt(document.querySelector('[data-filter-price-max] input[type=text]').value);
  let boxes = document.querySelectorAll('[data-filter-box] input[type=checkbox]:checked');
  if (flowers.length > 0) {
    params[params.length] = [];
    [].slice.call(flowers).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `flowers=` + params[params.length - 1].join(',');
  }
  if (colors.length > 0) {
    params[params.length] = [];
    [].slice.call(colors).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `colors=` + params[params.length - 1].join(',');
  }
  if (boxes.length > 0) {
    params[params.length] = [];
    [].slice.call(boxes).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `boxes=` + params[params.length - 1].join(',');
  }
  /*
  if (priceMin > 0) {
    params[params.length] = `min=${priceMin}`;
  }
  params[params.length] = `max=${priceMax}`;
   */
  window.location.search = `?` + params.join('&');
}

function filtersWithoutBoxes () {
  let params = [];
  let flowers = document.querySelectorAll('[data-filter-flower] input[type=checkbox]:checked');
  let colors = document.querySelectorAll('[data-filter-color] input[type=checkbox]:checked');
  let priceMin = parseInt(document.querySelector('[data-filter-price-min] input[type=text]').value);
  let priceMax = parseInt(document.querySelector('[data-filter-price-max] input[type=text]').value);
  // let boxes = document.querySelectorAll('[data-filter-box] input[type=checkbox]:checked');
  if (flowers.length > 0) {
    params[params.length] = [];
    [].slice.call(flowers).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `flowers=` + params[params.length - 1].join(',');
  }
  /*
  if (boxes.length > 0) {
    params[params.length] = [];
    [].slice.call(boxes).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `boxes=` + params[params.length - 1].join(',');
  }
   */
  if (colors.length > 0) {
    params[params.length] = [];
    [].slice.call(colors).forEach(item => {
      "use strict";
      params[params.length - 1].push(item.value);
    });
    params[params.length - 1] = `colors=` + params[params.length - 1].join(',');
  }
  if (priceMin > 0) {
    params[params.length] = `min=${priceMin}`;
  }
  params[params.length] = `max=${priceMax}`;
  window.location.search = `?` + params.join('&');
}
/* Функции для фильтров в каталоге - конец */
// Show/hide in orders

$(".js-info-show").click(function () {
  var info = $(this);
  info.closest('.js-order-header').toggleClass('is-active');
  info.closest(".my-orders__item").find('.item-body').toggleClass('is-active');
  info.siblings('.info__date').toggleClass('is-active');
  info.closest('.item-header__info').find('.info__id').toggleClass('is-active');
  info.toggleClass('is-active');
});
// Якорь кнопки слайдера
$(".js-scroll-to-form").click(function (e) {
  e.preventDefault();
  document.querySelector('.main').classList.remove('main--hidden');
  document.querySelector('#head-slider').classList.add('head-slider--hidden');
  document.querySelector('.header').classList.remove('header--absolute');
  document.querySelector('.header').classList.remove('header--light');
  document.body.style.overflow = "visible";
    var sliderHeight = document.querySelector('#head-slider').offsetHeight;
    var id = $(this).attr("href"),
      top = $(id).offset().top-sliderHeight;
    $('body,html').animate({scrollTop:top},1000);
});

// Login & Registration

$('body').on('submit', '.js-login-form', function(e) {
  e.preventDefault();
  var $form = $(this);
  $.post('/login/', $form.serialize(), function (response) {

    if (response.status == 'fail') {
      if (response.errors.login) {
        $form.find('.js-field-wrap')
          .addClass('is-unconfirmed')
          .find('.js-field-msg')
          .html(response.errors.login.confirm_email);
      } else {
        $form.find('.js-field-wrap')
          .addClass('has-error')
          .find('.js-field-msg')
          .addClass('is-active')
          .html(response.errors.auth)
        ;
      }

    } else {
      location.reload();
    }
  }, "json");

});

$('body').on('submit', '.js-signup-form', function(e) {
  e.preventDefault();
  var $form = $(this);
  $.post('/signup/', $form.serialize(), function (response) {
    $form.find('.js-field-msg-pass').empty();
    $form.find('.js-field-msg').empty();
    if (response.status == 'fail') {
      $.each(response.errors, function (key, val) {
        if (response.errors.signup) {
        $form.find('.js-field-msg-pass').html(response.errors.signup);
        }
        else if (response.errors.password) {
        $form.find('.js-field-msg-pass').html(response.errors.password_confirm.not_match);
        }
        // else if (response.errors.email) {
        // $form.find('.js-field-msg-pass')
        //   .closest('.js-field-wrap')
        //   .addClass('has-error')
        //   .find('.js-field-msg')
        //   .addClass('is-active')
        //   .html(response.errors.email.invalid);
        // }
        else if (response.errors.email.exists){
            $form.find('.js-field-msg')
            .html(response.errors.email.exists);
        }
      });
      $('html, body').animate({
        scrollTop: $form.find('.js-field-wrap').offset().top
      }, 1000);
    } else {
      $form.find('.js-field-msg').html(response.data.generated_password_sent_message);
    }
  }, "json");

});

// Переключение меню
function menuToggle () {
  window.menuBtn.classList.toggle('is-active');
  window.menuContainer.classList.toggle('is-active');
  if (window.menuBtn.classList.contains('is-active')) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "visible";
  }
  if (window.header.classList.contains('header--absolute')) {
    window.header.classList.toggle('header--light')
  }
}

function checkoutStepFirst () {
  [].slice.call(document.querySelectorAll('input[name="user"]')).forEach(function (item) {
    item.addEventListener('click', function (e) {
      let value = this.getAttribute('value');
      [].slice.call(document.querySelectorAll(`[data-user]`)).forEach(function (item) {
        if (item.getAttribute('data-user') === value) {
          // item.style.display = "block";
          item.classList.remove('b-hidden');
        } else {
          // item.style.display = "none";
          item.classList.add('b-hidden');
        }
        if (value === "old") {
          document.querySelector('.js-checkout-btn[data-checkout-step="1"').innerText = "Войти";
        } else {
          document.querySelector('.js-checkout-btn[data-checkout-step="1"').innerText = "Далее";
        }
      });
      document.querySelector('input[name="register_me"').checked = false;
    });
  });

  let fieldRegisterMe = document.querySelector('input[name="register_me"]') || false;
  if (fieldRegisterMe) {
    document.querySelector('input[name="register_me"]').addEventListener('click', function (e) {
      if (this.checked) {
        // document.querySelector('[data-user="old"]').style.display = "block";
        document.querySelector('[data-user="old"]').classList.remove('b-hidden');
        document.querySelector('.js-checkout-btn[data-checkout-step="1"').innerText = "Зарегестрироваться";
      } else {
        // document.querySelector('[data-user="old"]').style.display = "none";
        document.querySelector('[data-user="old"]').classList.add('b-hidden');
        document.querySelector('.js-checkout-btn[data-checkout-step="1"').innerText = "Далее";
      }
    });
  }
}

function checkoutStepSecond () {
  let items = document.querySelectorAll('input[name="street"], input[name="building"], input[name="flat"], input[name="date"]');
  let message = "";
  [].slice.call(items).forEach(item => {
    item.addEventListener('change', e => {
      message = `Доставка по адресу: [г. Пятигорск], ул. ${items[0].value}, д. ${items[1].value}, кв. ${items[2].value}, ${items[3].value}`;
      document.querySelector('#checkout-result-delivery').innerText = message;
    });
  });
}

function checkoutStepFourth () {
  let fieldRecipient = document.querySelector('input[name="recipient"]') || false;
  if (fieldRecipient) {
    fieldRecipient.addEventListener('change', function () {
      document.querySelector('#checkout-result-recipient').innerText = this.value;
    });
  }
  let fieldMessage = document.querySelector('input[name="message"]') || false;
  if (fieldMessage) {
    fieldMessage.addEventListener('change', function () {
      document.querySelector('#checkout-result-message').innerText = this.value;
    });
  }
}
// Has ajax request
// Отправка формы оформление заказа
//function checkoutFormSend () {
//  let checkoutForm = document.querySelector('.checkout-form') || false;
//  if (checkoutForm) {
//    checkoutForm.addEventListener('submit', function (e) {
//      e.preventDefault();
//      $.ajax({
//        url: this.action,
//        method: "POST",
//        data: $(document.getElementById('checkout')).serialize(),
//        success: function (res) {
//           console.log(res);
//          // res = JSON.parse(res);
//          if (res.success) {
//            document.querySelector('#modal-message-text').innerText = res.message;
//            VModal.show('modal-message');
//          }
//        },
//        statusCode: {
//          422: function (res) {
//            res = res.responseJSON;
//            for (let name in res.errors) {
//              if (res.errors.hasOwnProperty(name)) {
//                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
//              }
//            }
//          }
//        }
//      });
//    });
//  }
//}

// Устанавливает новое количество товаров в избранном по селектору .js-favorites-qnt
function favoritesSetQuantity (quantity) {
  [].slice.call(document.querySelectorAll('.js-favorites-qnt')).forEach(function (item) {
    if (item.hasAttribute('data-content')) {
      item.setAttribute('data-content', quantity);
    } else {
      item.innerText = quantity;
    }
  });
}

// Устанавливает новое количество товаров в коризе по селектору .js-cart-qnt
function cartSetQuantity (quantity) {
  /*
  [].slice.call(document.querySelectorAll('.js-cart-qnt')).forEach(function (item) {
    if (item.hasAttribute('data-content')) {
      item.setAttribute('data-content', quantity);
    } else {
      item.innerText = quantity;
    }
  });
   */
  [].slice.call(document.querySelectorAll('[data-cart-qnt]')).forEach(function (item) {
    if (item.hasAttribute('data-content')) {
      item.setAttribute('data-content', quantity);
    } else {
      item.innerText = quantity;
    }
  });
}

// Устанавливает новое количество товаров в коризе по селектору .js-cart-qnt
function cartSetSum (sum) {
  /*
  [].slice.call(document.querySelectorAll('.js-cart-sum')).forEach(function (item) {
    item.innerText = sum;
  });
   */
  [].slice.call(document.querySelectorAll('[data-cart-sum]')).forEach(function (item) {
    item.innerText = sum;
  });
}

/*
function createBlockCartEmpty () {
  let div = document.createElement('div');
  div.classList.add('header-cart-container__empty');
  div.innerText = "Корзина пуста";
  let container = document.querySelector('js-header-cart-container');
  container.innerHTML = "";
  container.append(div);
}
*/

function createBlockCartEmptyHeader () {
  let div = document.createElement('div');
  div.classList.add('header-cart-container__empty');
  div.innerText = "Корзина пуста";
  let container = document.querySelector('js-header-cart-container');
  container.innerHTML = "";
  container.append(div);
}

function createBlockCartEmptyPage () {
  let shoppingCartPage = document.querySelector("#shopping-cart-page") || false;
  if (shoppingCartPage) {
    shoppingCartPage.querySelector(".page__content").remove();
    let div = document.createElement('div');
    div.classList.add('page__empty');
    div.innerText = "Ваша корзина пуста";
    shoppingCartPage.append(div);
  }
}

function createBlockCheckoutEmptyPage () {
  let checkoutPage = document.querySelector("#checkout-page") || false;
  if (checkoutPage) {
    window.location.reload();
  }
}

// Has ajax request
// Отправка формы обратной связи
function formFeedBackSend () {
  let feedBack = document.querySelector('#feedback') || false;
  if (feedBack) {
    feedBack.addEventListener('submit', function (e) {
      e.preventDefault();

      // Сбрасываем предыдущие ошибки полей перед запросом
      [].slice.call(feedBack.querySelectorAll('.has-error')).forEach(function (item) {
        item.classList.remove('has-error');
      });

      /*
      let data = {
        feedback_name: feedBack.querySelector('input[name="feedback_name"]').value,
        feedback_phone: feedBack.querySelector('input[name="feedback_phone"]').value,
        feedback_policy: feedBack.querySelector('input[name="feedback_policy"]').checked
      };

      console.log(data);

      axios({
        url: "/response.php",
        method: "post",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: data
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        */

      $.ajax({
        url: this.action,
        method: "POST",
        data: $(this).serialize(),
        success: function (res) {
          // console.log(res);
          // res = JSON.parse(res);
          if (res.status=='ok') {

            VModal.close('modal-feedback');
            document.querySelector('#modal-message-text').innerText = res.data.html;
            VModal.show('modal-message');
          }
        },
        statusCode: {
          422: function (err) {
            err = err.responseJSON;
            for (let name in err.errors) {
              if (err.errors.hasOwnProperty(name)) {
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });
    });
  }
}
function formWeddingSend () {
  let wedding = document.querySelector('#wedding') || false;
  if (wedding) {
    wedding.addEventListener('submit', function (e) {
      e.preventDefault();

      // Сбрасываем предыдущие ошибки полей перед запросом
      [].slice.call(wedding.querySelectorAll('.has-error')).forEach(function (item) {
        item.classList.remove('has-error');
      });

      /*
      let data = {
        feedback_name: feedBack.querySelector('input[name="feedback_name"]').value,
        feedback_phone: feedBack.querySelector('input[name="feedback_phone"]').value,
        feedback_policy: feedBack.querySelector('input[name="feedback_policy"]').checked
      };

      console.log(data);

      axios({
        url: "/response.php",
        method: "post",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: data
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        */

      $.ajax({
        url: this.action,
        method: "POST",
        data: $(this).serialize(),
        success: function (res) {
          // console.log(res);
          // res = JSON.parse(res);
          if (res.status=='ok') {

            VModal.close('modal-wedding');
            document.querySelector('#modal-message-text').innerText = res.data.html;
            VModal.show('modal-message');
          }
        },
        statusCode: {
          422: function (err) {
            err = err.responseJSON;
            for (let name in err.errors) {
              if (err.errors.hasOwnProperty(name)) {
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });
    });
  }
}
function formOrderSend () {
  let feedBack = document.querySelector('#orderForm') || false;
  if (feedBack) {
    feedBack.addEventListener('submit', function (e) {
      e.preventDefault();

      // Сбрасываем предыдущие ошибки полей перед запросом
      [].slice.call(feedBack.querySelectorAll('.has-error')).forEach(function (item) {
        item.classList.remove('has-error');
      });

      $.ajax({
        url: this.action,
        method: "POST",
        data: $(this).serialize(),
        success: function (res) {

          if (res.status=='ok') {
            document.querySelector('#modal-message-text').innerText = res.data.html;
            VModal.show('modal-message');
          }
        },
        statusCode: {
          422: function (err) {
            err = err.responseJSON;
            for (let name in err.errors) {
              if (err.errors.hasOwnProperty(name)) {
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });
    });
  }
}
function formQuestionSend () {
  let question = document.querySelector('#questionForm') || false;
  if (question) {
    question.addEventListener('submit', function (e) {
      e.preventDefault();

      // Сбрасываем предыдущие ошибки полей перед запросом
      [].slice.call(question.querySelectorAll('.has-error')).forEach(function (item) {
        item.classList.remove('has-error');
      });

      $.ajax({
        url: this.action,
        method: "POST",
        data: $(this).serialize(),
        success: function (res) {

          if (res.status=='ok') {
            document.querySelector('#modal-message-text').innerText = res.data.html;
            VModal.show('modal-message');
          }
        },
        statusCode: {
          422: function (err) {
            err = err.responseJSON;
            for (let name in err.errors) {
              if (err.errors.hasOwnProperty(name)) {
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });
    });
  }
}
// Has ajax request
function formQuickOrderSend () {
  let form = document.querySelector('#order-quick') || false;
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Сбрасываем предыдущие ошибки полей перед запросом
      [].slice.call(form.querySelectorAll('.has-error')).forEach(function (item) {
        item.classList.remove('has-error');
      });

      $.ajax({
        url: this.action,
        method: "POST",
        data: $(this).serialize(),
        success: function (res) {
          // res = JSON.parse(res);
          // console.log(res);
          if (res.success) {
            VModal.close('modal-order');
            document.querySelector('#modal-message-text').innerText = res.message;
            VModal.show('modal-message');
          }
        },
        statusCode: {
          422: function (err) {
            err = err.responseJSON;
            for (let name in err.errors) {
              if (err.errors.hasOwnProperty(name)) {
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });
    });
  }
}

// Has ajax request
// Удаление продукта из корзины
function deleteProductFromCart () {
  [].slice.call(document.querySelectorAll('[data-cart-prod-delete]')).forEach(item => {
    item.addEventListener('click', dPFC);
  });
}

function dPFC (e) {
  let productNode = e.currentTarget.closest('[data-cart-prod]');
  let productId = Number(productNode.getAttribute('data-cart-prod'));
  // Запрос к серверу
  $.ajax({
    url: `/response.php?test=cart-remove`,
    // url: `/cart/delete/${productId}`,
    success: function (res) {
      res = JSON.parse(res);
      // console.log(res);
      // Удаляем
      productNode.remove();
      // Удаляем этот же товар с других мест страницы
      [].slice.call(document.querySelectorAll(`[data-cart-prod="${productId}"]`)).forEach(item => {
        item.remove();
      });
      // Если корзина пуста
      if (res.data.quantity === 0) {
        document.querySelector('.header-cart').classList.add('header-cart--empty');
        createBlockCartEmptyHeader();
        createBlockCartEmptyPage();
        createBlockCheckoutEmptyPage();
      }
      cartSetQuantity(res.data.quantity);
      cartSetSum(res.data.sum);
    }
  });
}

/*
function createBlockCartProduct () {
  let headerCartProduct = document.createElement('div');
  headerCartProduct.classList.add('header-cart-product');

  // Pic
  let pic = document.createElement('div');
  pic.classList.add('header-cart-product__pic');
  let img = document.createElement('img');
  img.classList.add('header-cart-product__img');
  img.src = "";
  img.alt = "";

  // Close
  let content = document.createElement('div');
  content.classList.add('header-cart-product__content');
  let code = document.createElement('small');
  code.classList.add('header-cart-product__code');
  let name = document.createElement('h4');
  name.classList.add('header-cart-product__name');
  name.innerHtml = "";

  // Close
  let close = document.createElement('div');
  close.classList.add('header-cart-product__close');
  close.classList.add('js-header-cart-product-close');
}
*/

// Object.assign polyfill
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      let to = Object(target);
      for (let i = 1; i < arguments.length; i++) {
        let nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        let keysArray = Object.keys(Object(nextSource));
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          let nextKey = keysArray[nextIndex];
          let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

// Плавный скрол на чистом js
function smoothScrollTo (target, speed = 1) {
  let w = window.pageYOffset,
    t = target.getBoundingClientRect().top - 20,
    start = null;
  requestAnimationFrame(step);
  function step(time) {
    if (start === null) start = time;
    let progress = time - start,
      r = (t < 0 ? Math.max(w - progress/speed, w + t) : Math.min(w + progress/speed, w + t));
    window.scrollTo(0, r);
    if (r !== w + t) {
      requestAnimationFrame(step);
    } else {
      // window.location.hash = hash;
    }
  }
}

// Добавление товара в корзину из каталога (Shop Script)
$("body").on('submit', 'form.js-item', function () {
  var f = $(this),
      cart = $('.js-header-cart-container'),
      cartList = $('.js-header-cart-items'),
      cartTotal = $(".js-header-cart-total"),
      fSku = $(this).data('sku'),
      fName = $(this).data('name'),
      fQty = $(this).find('input[name="quantity"]').val(),
      fPrice = $(this).data('price'),
      fPic = $(this).data('smallpic');


  $.post(f.attr('action') + '?html=1', f.serialize(), function (response) {

      if (response.status == 'ok') {
          var pList = $('.js-header-cart-product'),
              pId = parseInt(response.data.item_id),
              pIsNew;
        var elems = cartList.children().length;

        if (elems !== 0) {
          var check;
          $.each(pList, function(i, v)  {if ($(v).data('id') == pId) {check = false}
          });
          check == false ? pIsNew = false : pIsNew = true}

        else if (elems == 0)  {pIsNew = true}

          f.find('.js-product-card-back').addClass('is-bought');
          var messageElement = document.createElement('div');
          messageElement.classList.add('product-card__message');
          messageElement.classList.add('btn');
          messageElement.innerHTML = 'Товар добавлен в корзину';
          if (response.status != 'ok') {
            messageElement.style.backgroundColor = "red";
          }
          f.find('.js-product-card-back').append(messageElement);
          setTimeout(function () {
            messageElement.remove();
          }, 2000);
          $('.js-header-cart-result').show();
          $('.js-header-cart-bottom-btn').show();
          $('.js-header-cart-count').html(response.data.count);
          $('.js-header-cart-balloon').show();
          $('.header-cart-container__empty').hide();
          $('.header-cart-container__bottom').removeClass('.header-cart-container__bottom--p0');
          $('.js-header-cart-result').removeClass('header-cart-container__result--is-hidden');
          $('.js-header-cart-message').hide();
          cart.addClass('is-opened');


          if (pIsNew == true) {
            cartList.find('.js-header-cart-message').remove();
            $('.header-cart-container__bottom').removeClass('header-cart-container__bottom--p0');
            $('.js-header-cart-bottom').show();
            $('.js-header-cart-bottom-btn').show();

            cartList.append('<div data-id="' + pId + '" class="header-cart-container__item js-header-cart-product"><div class="header-cart-product"><div class="header-cart-product__pic"><img src="'+fPic+'" alt="'+fName+'" class="header-cart-product__img"></div><div class="header-cart-product__content"><small class="header-cart-product__code">'+fSku+'</small><h4 class="header-cart-product__name">'+fName+'</h4><div class="header-cart-product__qnt">Количество: <span class="js-header-cart-product-qty">'+parseInt(fQty)+'</span></div><div class="header-cart-product__price"><span class="js-header-cart-product-price">'+(parseInt(fQty)*parseInt(fPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")+' </span> <span>₽</span></div></div><div class="header-cart-product__close js-header-cart-product-delete"><div class="header-cart-product__close-inner"></div></div></div></div>');
          } else if (pIsNew == false) {
            var curQty = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
                // curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
                curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html().replace(/\s/g, '')),
                newQty = curQty + parseInt(fQty);
            $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html(curQty + parseInt(fQty));
            $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html((curPrice + (parseInt(fQty)*parseInt(fPrice))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
          }

          cart.addClass('is-opened');
          var totalResult = response.data.total.replace(/[^-0-9]/gim,'');
          cartTotal.html(totalResult);

      } else if (response.status == 'fail') {
          alert(response.errors);
      }

  }, "json");
  return false;
});
//Добавление  с главной|| тест

  $(document).on('click', ".js-product-buy", function (e) {
    e.preventDefault();
    var $this = $(this);
    var f = $this.closest('.js-item');
    var qty = f.find('.qnt-toggle__val').val();
    var id = f.attr('data-id');
    var sku = f.attr("data-sku");
    var name = f.attr('data-name');
    var price = f.attr('data-price');
    var pic = f.attr('data-smallpic');
    var cart = $('.js-header-cart-container');
    var cartList = $('.js-header-cart-items');
    var cartTotal = $(".js-header-cart-total");

    $.post('/cart/add/', { html: 1, product_id: id, quantity: qty }, function (response) {
      if (response.status == 'ok') {

        var pList = $(cartList).children('.js-header-cart-product');
        var pId = parseInt(response.data.item_id);
        var pIsNew;
        var elems = cartList.children().length;

         if (elems !== 0) {
           var check;
           $.each(pList, function(i, v)  {if ($(v).data('id') == pId) {check = false}
           });
           check == false ? pIsNew = false : pIsNew = true}

        else if (elems == 0)  {pIsNew = true}

        f.addClass('is-bought');

        var messageElement = document.createElement('div');
        messageElement.classList.add('product-card__message');
        messageElement.classList.add('btn');
        messageElement.innerHTML = 'Товар добавлен в корзину';
        f.append(messageElement);
        setTimeout(function () {
          messageElement.remove();
        }, 2000);

        $('.js-header-cart-result').show();
        $('.js-header-cart-bottom-btn').show();
        $('.js-header-cart-count').html(response.data.count);
        $('.js-header-cart-balloon').show();
        $('.header-cart-container__empty').hide();
        $('.header-cart-container__bottom').removeClass('.header-cart-container__bottom--p0');
        $('.js-header-cart-result').removeClass('header-cart-container__result--is-hidden');
        $('.js-header-cart-message').hide();
        cart.addClass('is-opened');

        if (pIsNew == true) {
          cartList.find('.js-header-cart-message').remove();
          $('.header-cart-container__bottom').removeClass('header-cart-container__bottom--p0');

          $('.js-header-cart-result').show();
          $('.js-header-cart-bottom-btn').show();

          cartList.append('<div data-id="' + pId + '" class="header-cart-container__item js-header-cart-product"><div class="header-cart-product"><div class="header-cart-product__pic"><img src="'+pic+'" alt="'+name+'" class="header-cart-product__img"></div><div class="header-cart-product__content"><small class="header-cart-product__code">'+sku+'</small><h4 class="header-cart-product__name">'+name+'</h4><div class="header-cart-product__qnt">Количество: <span class="js-header-cart-product-qty">'+parseInt(qty)+'</span></div><div class="header-cart-product__price"><span class="js-header-cart-product-price">'+(parseInt(qty)*parseInt(price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")+' </span> <span>₽</span></div></div><div class="header-cart-product__close js-header-cart-product-delete"><div class="header-cart-product__close-inner"></div></div></div></div>');
        } else if (pIsNew == false) {
          var curQty = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
            //curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
            curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html().replace(/\s/g, '')),
            newQty = curQty + parseInt(qty);
          $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html(curQty + parseInt(qty));
          $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html((curPrice + (parseInt(qty)*parseInt(price))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
        }

        cart.addClass('is-opened');
        var totalResult = response.data.total.replace(/[^-0-9]/gim,'');
        cartTotal.html(totalResult);

      }
      if (response.status != 'ok') {
        messageElement.style.backgroundColor = "red";
      }
      else if (response.status == 'fail') {

      }
    }, "json");

    return false;
  });
// Constructor flower change
$(document).on('change', "#flower-select", function (e) {
  let val = $(e.target).val();
  if (val != "constructor") {
    $('.js-construct-length').hide();
    $('.js-number-color').html('02');
    $('.js-number-pack').html('03');
  } else {
    $('.js-construct-length').show();
    $('.js-number-color').html('03');
    $('.js-number-pack').html('04');
  }
  $('.qnt-toggle__val').value = '01';
  $.get('/'+val, { html: 1}, function (response) {

      var tmp = $('<div></div>').html(response);
      $('.result-card__pic').replaceWith(tmp.find('.result-card__pic'));
      $('.result-card__info').replaceWith(tmp.find('.result-card__info'));
      $('.js-constr-qnt').replaceWith(tmp.find('.js-constr-qnt'));
      $('.js-color').replaceWith(tmp.find('.js-color'));
      $('.js-length').replaceWith(tmp.find('.js-length'));
      $('.js-packing').replaceWith(tmp.find('.js-packing'));
      $('.js-span-qnt').replaceWith(tmp.find('.js-span-qnt'));

      $('.length-toggle').first().trigger('click');
      $('[data-color-count = 1]').trigger('click');

  });
  return false;
});

// Recalculate constructor price by length/color/packing select
function recalculate () {
  let itemPriceElem = $('.js-result-price');
  let length = parseInt($('div[data-length-active]').attr('data-price'));
  if (isNaN(length)) {length = 0}
  let color = parseInt($('div[data-color-active]').attr('data-price'));
  if (isNaN(color)) {color = 0}
  let packing = parseInt($('div[data-packing-active]').attr('data-price'));
  if (isNaN(packing)) {packing = 0}
  let itemPrice = parseInt(itemPriceElem.attr('data-price'));
  let qty = $('.qnt-toggle__val').val();
  let newBouqetPrice = (itemPrice + color + length)* qty + packing;
  $('.js-price').html(newBouqetPrice);
};
//Flower name change

function wordForms(val) {
  var idFlowerSelect = $('#flower-select').val();

  if (idFlowerSelect == 'constructor') {
    var firstCase = 'голландская роза';
    var secondCase = 'голландские розы';
    var thirdCase = 'голландских роз';
  } else if (idFlowerSelect == 'pion') {
    var firstCase = 'пион';
    var secondCase = 'пиона';
    var thirdCase = 'пионов';
  } else if (idFlowerSelect == 'giperikum') {
    var firstCase = 'гиперикум';
    var secondCase = 'гиперикума';
    var thirdCase = 'гиперикумов';
  } else if (idFlowerSelect == 'mestnye-rozy') {
    var firstCase = 'местная роза';
    var secondCase = 'местные розы';
    var thirdCase = 'местных роз';
  } else if (idFlowerSelect == 'eustoma') {
    var firstCase = 'эустома';
    var secondCase = 'эустомы';
    var thirdCase = 'эустомы';
  } else if (idFlowerSelect == 'gortensia') {
    var firstCase = 'гортензия';
    var secondCase = 'гортензии';
    var thirdCase = 'гортензии';
  } else if (idFlowerSelect == 'statitsa') {
    var firstCase = 'статица';
    var secondCase = 'статицы';
    var thirdCase = 'статицы';
  } else if (idFlowerSelect == 'gvozdika') {
    var firstCase = 'гвоздика';
    var secondCase = 'гвоздики';
    var thirdCase = 'гвоздик';
  }

  var wordForm = function wordForm(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
  };

  var count = parseInt(val, 10);
  var result = wordForm(count, [firstCase, secondCase, thirdCase]);
  $('.result-info__name').html(result);
};

// Color name change

function colorNameChange() {
  var ColorSelect = $('.js-color-toggle[data-color-active]').attr('data-color');
  var idFlowerSelect = $('#flower-select').val();

  if (ColorSelect == 'white') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'белая';
      var secondCase = 'белые';
      var thirdCase = 'белых';
    } else {
      var firstCase = 'белый';
      var secondCase = 'белых';
      var thirdCase = 'белых';
    }
  }

  if (ColorSelect == 'red') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'красная';
      var secondCase = 'красные';
      var thirdCase = 'красных';
    } else {
      var firstCase = 'красный';
      var secondCase = 'красных';
      var thirdCase = 'красных';
    }
  }

  if (ColorSelect == 'green') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'зеленая';
      var secondCase = 'зеленые';
      var thirdCase = 'зеленых';
    } else {
      var firstCase = 'зеленый';
      var secondCase = 'зеленых';
      var thirdCase = 'зеленых';
    }
  }

  if (ColorSelect == 'peach') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'персиковая';
      var secondCase = 'персиковые';
      var thirdCase = 'персиковых';
    } else {
      var firstCase = 'персиковый';
      var secondCase = 'персиковых';
      var thirdCase = 'персиковых';
    }
  }

  if (ColorSelect == 'purple') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'сиреневая';
      var secondCase = 'сиреневые';
      var thirdCase = 'сиреневых';
    } else {
      var firstCase = 'сиреневый';
      var secondCase = 'сиреневых';
      var thirdCase = 'сиреневых';
    }
  }

  if (ColorSelect == 'crimson') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'малиновая';
      var secondCase = 'малиновые';
      var thirdCase = 'малиновых';
    } else {
      var firstCase = 'малиновый';
      var secondCase = 'малиновых';
      var thirdCase = 'малиновых';
    }
  }

  if (ColorSelect == 'yellow') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'желтая';
      var secondCase = 'желтые';
      var thirdCase = 'желтых';
    } else {
      var firstCase = 'желтый';
      var secondCase = 'желтых';
      var thirdCase = 'желтых';
    }
  }

  if (ColorSelect == 'vinous') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'бордовая темная';
      var secondCase = 'бордовые темные';
      var thirdCase = 'бордовых темных';
    } else {
      var firstCase = 'бордовый темный';
      var secondCase = 'бордовых темных';
      var thirdCase = 'бордовых темных';
    }
  }

  if (ColorSelect == 'violet') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'фиолетовая';
      var secondCase = 'фиолетовые';
      var thirdCase = 'фиолетовых';
    } else {
      var firstCase = 'фиолетовый';
      var secondCase = 'фиолетовых';
      var thirdCase = 'фиолетовых';
    }
  }

  if (ColorSelect == 'pink') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'розовая';
      var secondCase = 'розовые';
      var thirdCase = 'розовых';
    } else {
      var firstCase = 'розовый';
      var secondCase = 'розовых';
      var thirdCase = 'розовых';
    }
  }

  if (ColorSelect == 'light-blue') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'голубая';
      var secondCase = 'голубые';
      var thirdCase = 'голубых';
    } else {
      var firstCase = 'голубой';
      var secondCase = 'голубых';
      var thirdCase = 'голубых';
    }
  }

  if (ColorSelect == 'lavand') {
    if (idFlowerSelect !== 'pion' && idFlowerSelect !== 'giperikum') {
      var firstCase = 'лавандовая';
      var secondCase = 'лавандовые';
      var thirdCase = 'лавандовых';
    } else {
      var firstCase = 'лавандовый';
      var secondCase = 'лавандовых';
      var thirdCase = 'лавандовых';
    }
  }

  var wordForm = function wordForm(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
  };

  var val = $('.js-constr-qnt').find('input[type=text]').val();
  var count = parseInt(val, 10);
  var result = wordForm(count, [firstCase, secondCase, thirdCase]);
  $('.js-name-color').html(result);
};

function animateConstructorNum(val) {
  let qnt = $('.js-span-qnt');
  qnt.html(parseInt(val,10));
  qnt.addClass('is-active');
  setTimeout( ()=>(qnt.removeClass('is-active')),200);
};

//  length select
$(document).on('click', '.length-toggle', function () {
  $(this).addClass('is-active');
  if ($(this).siblings('.is-active')) {
    $(this).siblings().removeClass('is-active');
    recalculate();
  }
  var attr = $(this).attr('data-length-active');
  if (typeof attr !== typeof undefined && attr !== false) {

  }
  else if (!attr) {
    $(this).siblings().removeAttr('data-length-active');
    $(this).attr('data-length-active','');
    recalculate();
    let lengthValue = $(this).attr('data-action');
    $('.result-info__length').html(lengthValue+' см');
  }
});
//  Color select

$(document).on('click', '.js-color-toggle', function () {
  $(this).addClass('is-active');
  if ($(this).siblings('.is-active')) {
    $(this).siblings().removeClass('is-active');
  }
  var attr = $(this).attr('data-color-active');
  if (typeof attr !== typeof undefined && attr !== false) {
    // $(this).removeAttr('data-color-active');
    // recalculate();
    // $(this).siblings().removeAttr('data-color-active');
  }
  else if (!attr) {
    $(this).siblings().removeAttr('data-color-active');
    $(this).attr('data-color-active','');
    let colorCount = $('.js-color-toggle[data-color-active]').attr('data-color-count');
    let qty = parseInt($('.qnt-toggle__val').val());
    if (qty < 21) {
      var numberVal = 'first';
    }
    else if (qty >=21 && qty < 51) {
      var numberVal = 'second';
    }
    else if (qty >=51 && qty <101) {
      var numberVal = 'third';
    }
    else if (qty >=101) {
      var numberVal = 'fourth';
    }
    var currentImg = document.querySelector('.result-pic__img');
    var nextImg = currentImg.getAttribute('data-color-' + colorCount + '-' + numberVal + '-src');
    currentImg.setAttribute('src', nextImg);
    recalculate();
    colorNameChange();
  }
});
// Packing select
$(document).on('mouseover', '.packing-option', function() {$(this).find('.packing-option__pic').addClass('is-active')});
$(document).on('mouseout', '.packing-option', function() {if (!$(this).hasClass('is-active')) {$(this).find('.packing-option__pic').removeClass('is-active')} });
$(document).on('click', '.packing-option', function () {
  $(this).toggleClass('is-active');
  if ($(this).siblings('.is-active')) {
    $(this).siblings().removeClass('is-active');
    $(this).siblings().find('.packing-option__pic').removeClass('is-active');
  }
  var attr = $(this).attr('data-packing-active');
  if (typeof attr !== typeof undefined && attr !== false) {
    $(this).removeAttr('data-packing-active');
    $(this).find('.packing-option__pic').toggleClass('is-active');
    recalculate();
    $(this).siblings().removeAttr('data-packing-active');
    $('.result-info__pack').html('');
  }
  else if (!attr) {
    $(this).siblings().removeAttr('data-packing-active');
    $(this).attr('data-packing-active', '');
    $(this).find('.packing-option__pic').addClass('is-active');
    recalculate();
    var packingText = $(this).find('.pack-info__name').text();
    packingText = '(Упаковка: ' + packingText + ')';
    $('.result-info__pack').html(packingText);
  }

});

// Добавление товара в корзину со страницы товара
$(document).on('click', ".js-product-page-buy", function (e) {
  e.preventDefault();
  var $this = $(this);
  var f = $this.closest('.js-item');
  var qty = f.find('.qnt-toggle__val').val();
  var id = f.attr('data-id');
  var sku = f.attr("data-sku");
  var name = f.attr('data-name');
  var price = f.attr('data-price');
  var pic = f.attr('data-smallpic');
  var cart = $('.js-header-cart-container');
  var cartList = $('.js-header-cart-items');
  var cartTotal = $(".js-header-cart-total");

  $.post('/cart/add/', { html: 1, product_id: id, quantity: qty }, function (response) {
    if (response.status == 'ok') {

      var pList = $(cartList).children('.js-header-cart-product');
      var pId = parseInt(response.data.item_id);
      var pIsNew;
      var elems = cartList.children().length;

      if (elems !== 0) {
        var check;
        $.each(pList, function(i, v)  {if ($(v).data('id') == pId) {check = false}
        });
        check == false ? pIsNew = false : pIsNew = true}

      else if (elems == 0)  {pIsNew = true}

      $this.html('Товар добавлен в корзину');
      setTimeout(function () {
        $this.html('Заказать');
      }, 2000);

      $('.js-header-cart-result').show();
      $('.js-header-cart-bottom-btn').show();
      $('.js-header-cart-count').html(response.data.count);
      $('.js-header-cart-balloon').show();
      $('.header-cart-container__empty').hide();
      $('.header-cart-container__bottom').removeClass('.header-cart-container__bottom--p0');
      $('.js-header-cart-result').removeClass('header-cart-container__result--is-hidden');
      $('.js-header-cart-message').hide();
      cart.addClass('is-opened');

      if (pIsNew == true) {
        cartList.find('.js-header-cart-message').remove();
        $('.header-cart-container__bottom').removeClass('header-cart-container__bottom--p0');

        $('.js-header-cart-result').show();
        $('.js-header-cart-bottom-btn').show();

        cartList.append('<div data-id="' + pId + '" class="header-cart-container__item js-header-cart-product"><div class="header-cart-product"><div class="header-cart-product__pic"><img src="'+pic+'" alt="'+name+'" class="header-cart-product__img"></div><div class="header-cart-product__content"><small class="header-cart-product__code">'+sku+'</small><h4 class="header-cart-product__name">'+name+'</h4><div class="header-cart-product__qnt">Количество: <span class="js-header-cart-product-qty">'+parseInt(qty)+'</span></div><div class="header-cart-product__price"><span class="js-header-cart-product-price">'+(parseInt(qty)*parseInt(price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")+' </span> <span>₽</span></div></div><div class="header-cart-product__close js-header-cart-product-delete"><div class="header-cart-product__close-inner"></div></div></div></div>');
      } else if (pIsNew == false) {
        var curQty = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
          //curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
          curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html().replace(/\s/g, '')),
          newQty = curQty + parseInt(qty);
        $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html(curQty + parseInt(qty));
        $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html((curPrice + (parseInt(qty)*parseInt(price))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
      }

      cart.addClass('is-opened');
      var totalResult = response.data.total.replace(/[^-0-9]/gim,'');
      cartTotal.html(totalResult);

    }
    if (response.status != 'ok') {
      messageElement.style.backgroundColor = "red";
    }
    else if (response.status == 'fail') {

    }
  }, "json");

  return false;
});
// Удаление из корзины
$(".js-header-cart-items").on('click', ".js-header-cart-product-delete",function () {
  var row = $(this).closest('.js-header-cart-product'),
      cart = $('.js-header-cart-container'),
      cartList = $('.js-header-cart-items');

  $.post('/cart/delete/', {html: 1, id: row.data('id')}, function (response) {
      if (response.status == 'ok')  {
        var totalResult = response.data.total.replace(/[^-0-9]/gim,'');
        $('.js-header-cart-count').html(response.data.count);
        $('.js-header-cart-total').html(totalResult);
      }
      if (response.data.count == 0) {
          $('.js-header-cart-result').hide();
          $('.js-header-cart-bottom-btn').hide();
          $('.header-cart-container__bottom').addClass('header-cart-container__bottom--p0');
          $('.js-header-cart-count').html('0');
          $('.js-header-cart-balloon').hide();
          $('.js-header-cart-message').show();
       //   cart.append('<div class="header-cart-container__empty js-header-cart-message">Корзина пуста</div>');
          setTimeout(function() {
            cart.removeClass('is-opened');
          }, 1000);


      }
      row.hide('slow', function() { row.remove(); });
  }, "json");
  return false;
});

// Обновление летучей корзины
function updateCartHeader (productId, qnt) {

}
// Homepage Circle-slider
if($('.js-slider').length >0 )
{
  let slide = 1;
  setInterval( function(){
    $('.js-slider').find('img').fadeOut(500, function () {
      $('.js-slider').find('img').attr('src','/wa-apps/shop/themes/decorator/assets/img/slider/slide-'+slide+'.png').fadeIn(1000);
    });
    slide++;
    if (slide > 2) {slide = 1;}
  },3500)
};

// Spoiler at wedding-page
$('.js-showmore-offers').click(function(){
  $(this).parent().find('.grid').children('div.spoiler-content').slideToggle();
    if($(this).text() == 'Скрыть'){
      $(this).text('Показать еще');
    } else {
      $(this).text('Скрыть');
    }
  return false;
});

$('.js-showmore-constructor').click(function () {
  $(this).parent().find('.grid').children('div.spoiler-content').slice(0, 3).slideToggle().removeClass('spoiler-content');
  if (!document.querySelector('.spoiler-content')) {this.style.display = 'none';}
  return false;
});

// Checkout step
// var shippingid = $("input[name=shipping_id][value='5']:checked").val();
// if(shippingid) {
//   console.log('fff');
//   $('.shipping-rates').css({'display': 'none'});
// }
// function updateCartHeader (productId, qnt) {
//   let name = "Признание";
//   let img = "./dist/img/products/1.jpg";
//   let price = 4200;
//   let code = "Ds0000402";
//   let container = document.querySelector(`js-header-cart-container`);
//   // Проверяем пустая ли корзина была
//   let emptyElement = container.querySelector(`.header-cart-container__empty`) || false;
//   if (emptyElement) {
//     emptyElement.remove();
//     let itemsElement = document.createElement("div");
//     itemsElement.classList.add("js-header-cart-total");
//     let productElement = document.createElement("div");
//     productElement.classList.add("js-header-cart-item");
//     productElement.setAttribute("data-cart-prod", productId);
//     productElement.innerHTML = `
//         <div class="header-cart-product">
//           <div class="header-cart-product__pic">
//             <img src="${img}" alt="" class="header-cart-product__img">
//           </div>
//           <div class="header-cart-product__content">
//             <small class="header-cart-product__code">${code}</small>
//             <h4 class="header-cart-product__name">${name}</h4>
//             <div class="header-cart-product__qnt">Количество: <span data-cart-prod-qnt>${qnt}</span></div>
//             <div class="header-cart-product__price">
//               <span>${price}</span>
//               <span>₽</span>
//             </div>
//           </div>
//           <div class="header-cart-product__close" data-cart-prod-delete>
//             <div class="header-cart-product__close-inner"></div>
//           </div>
//         </div>
//       `;
//     itemsElement.append(productElement);
//     container.append(itemsElement);
//     let bottomElement = document.createElement("div");
//     bottomElement.classList.add("header-cart-container__bottom");
//     bottomElement.innerHTML = `
//     <div class="header-cart-container__result">
//       <span>Итого</span>
//       <span data-cart-sum>0</span>
//       <span>₽</span>
//     </div>
//     `;
//     container.append(bottomElement);
//     let aElement = document.createElement("a");
//     aElement.classList.add("header-cart-container__btn");
//     aElement.classList.add("btn");
//     aElement.href = "/shopping-cart.html";
//     aElement.innerText = "Перейти в корзину";
//     container.append(aElement);
//     productElement.querySelector('[data-cart-prod-delete]').addEventListener('click', dPFC);
//   } else {
//     // Проверяем есть ли в корзине этот товар
//     let productElement = container.querySelector(`[data-cart-prod="${productId}"]`) || false;
//     if (productElement) {
//       productElement.querySelector("[data-cart-prod-qnt]").innerText = qnt;
//     } else {
//       productElement = document.createElement("div");
//       productElement.classList.add("js-header-cart-item");
//       productElement.setAttribute("data-cart-prod", productId);
//       productElement.innerHTML = `
//         <div class="header-cart-product">
//           <div class="header-cart-product__pic">
//             <img src="${img}" alt="" class="header-cart-product__img">
//           </div>
//           <div class="header-cart-product__content">
//             <small class="header-cart-product__code">${code}</small>
//             <h4 class="header-cart-product__name">${name}</h4>
//             <div class="header-cart-product__qnt">Количество: <span data-cart-prod-qnt>${qnt}</span></div>
//             <div class="header-cart-product__price">
//               <span>${price}</span>
//               <span>₽</span>
//             </div>
//           </div>
//           <div class="header-cart-product__close" data-cart-prod-delete>
//             <div class="header-cart-product__close-inner"></div>
//           </div>
//         </div>
//       `;
//       container.querySelector(".js-header-cart-total").append(productElement);
//       productElement.querySelector('[data-cart-prod-delete]').addEventListener('click', dPFC);
//     }
//   }
//   console.log(productId);
// }
