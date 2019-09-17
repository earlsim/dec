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
});

// Дерево DOM построено и главные ресурсы загружены
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Date time
  flatpickr("#date", {
    // "locale": Russian,
    "locale": "ru",
    enableTime: true,
    time_24hr: true,
    dateFormat: "d-m-Y H:i",
    minDate: "today",
    maxDate: new Date().fp_incr(14)
  });

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
  new Select(".js-field-select");

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

  // Instagram Slider
  // Инстаграм слайдер на главной
  new Swiper('.js-inst-slider', {
    speed: 400,
    spaceBetween: 24,
    slidesPerView: 4,
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

  checkoutStepFirst();
  checkoutStepSecond();
  checkoutStepFourth();
  checkoutFormSend();

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

  // Button add in product card
  [].slice.call(document.querySelectorAll('.js-product-add')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.parentNode.parentNode.classList.toggle('is-active');
    }, false);
  });

  // Добавление товара в корзину со страницы товара
  [].slice.call(document.querySelectorAll('.js-product-to-cart')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let productInfoBlock = this.parentNode.parentNode;
      let productBlock = productInfoBlock.parentNode;
      let id = productBlock.getAttribute('data-id');
      let qnt = parseInt(productBlock.querySelector('.js-product-qnt [type=text]').value);

      fetch(`/cart/add/${id}/${qnt}`)
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

    }, false);
  });

  // Has ajax request
  // Button buy in product card
  [].slice.call(document.querySelectorAll('.js-product-buy')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let productCardElement = this.parentNode;
      let id = productCardElement.getAttribute('data-id');
      let qnt = parseInt(productCardElement.querySelector('.js-product-qnt [type=text]').value);

      $.ajax({
        url: `/response.php?test=cart-add`,
        // url: `/cart/add/${id}/${qnt}`,
        success: function (res) {
          // console.log(res);
          res = JSON.parse(res);
          let messageElement = document.createElement('div');
          messageElement.classList.add('product-card__message');
          messageElement.classList.add('btn');
          messageElement.innerHTML = res.message;
          if (!res.success) {
            messageElement.style.backgroundColor = "red";
          }
          productCardElement.append(messageElement);
          productCardElement.classList.toggle('is-bought');
          setTimeout(function () {
            messageElement.remove();
          }, 2000);

          if (res.data) {
            updateCartHeader(id, qnt);
            cartSetQuantity(res.data.quantity);
            cartSetSum(res.data.sum);
            console.log(res.data);
            document.querySelector('.header-cart').classList.remove('header-cart--empty');
          }
        }
      });

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
    }, false);
  });

  // Button continue/close in product card
  // Продолжить/закрыть в карточке товара
  [].slice.call(document.querySelectorAll('.js-product-close')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.parentNode.parentNode.classList.remove('is-active');
      this.parentNode.classList.remove('is-bought');
    }, false);
  });

  // Button (min & max) qnt in product card
  [].slice.call(document.querySelectorAll('.js-product-qnt [data-action]')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let inputElement = this.parentNode.querySelector('input[type=text]');
      let val = parseInt(inputElement.value);
      if (this.getAttribute('data-action') === 'min') {
        if (val <= 1) return;
        val = val - 1;
      } else if (this.getAttribute('data-action') === 'max') {
        val = val + 1;
      } else {
        console.info('Undefined [data-action].');
        return;
      }
      if (val % 10 && val < 10) { val = `0${val}`; }
      inputElement.value = val;
    }, false);
  });

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
      console.log(val, actQty);

      timer = setTimeout(() => {
        $.post('/cart/save/', {html: 1, id: id, quantity: actQty}, function (response) {
          if (response.status == 'ok') {
            cartSetQuantity(response.data.count);
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
      $.post('/cart/delete/', {html: 1, id: id}, function (response) {
          if (response.data.count == 0) {
              location.reload();
          }
          row.remove();
          cartSetQuantity(response.data.count);
          cartSetSum(response.data.total.replace(' ₽', ''));
      }, "json");
      return false;
  });

  // Input qnt in product card
  [].slice.call(document.querySelectorAll('.js-product-qnt [type=text]')).forEach(item => {
    "use strict";
    item.addEventListener('input', function (e) {
      e.preventDefault();
      let inputElement = this;
      let val = parseInt(inputElement.value);
      console.log(val);
      if (Number.isNaN(val)) val = 0;
      console.log(val);
      if (val < 0) return;
      if (val % 10 && val < 10) { val = `0${val}`; }
      inputElement.value = val;
    }, false);
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
    });
  }

  // Modals
  let modalOrderBtn = document.querySelectorAll('.js-modal-order-btn') || false;
  if (modalOrderBtn.length > 0) {
    modalOrderBtn.addEventListener('click', function (e) {
      e.preventDefault();
      VModal.show('modal-order');
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
  [].slice.call(document.querySelectorAll('.js-product-to-favorites')).forEach(item => {
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
          console.log(item);
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
    }, false);
  });
  // Добавление товара в избранное со страницы товара
  // Has ajax request
  // js-favorites-add
  [].slice.call(document.querySelectorAll('.js-product-like')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let id = parseInt(this.parentNode.getAttribute('data-id'));

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

      $.ajax({
        url: "/response.php?test=favorites-add",
        // url: `/favorites/add/${id}`,
        success: function (res) {
          // console.log(res);
          res = JSON.parse(res);
          if (res.success) {
            console.log(res);
          }
        }
      });

    }, false);
  });


  [].slice.call(document.querySelectorAll('.js-favorites-delete')).forEach(item => {
    "use strict";
    item.addEventListener('click', function (e) {
      e.preventDefault();
      let productCardElement = this.parentNode;
      var productId = productCardElement.getAttribute('data-id');

      $.post("/wishlist/toggle/", {html: 1, product_id: productId}, function (res) {
        // url: `/favorites/delete/${id}/`,
          // console.log(res);
          if (res.status == 'ok') {
            productCardElement.parentNode.parentNode.parentNode.remove();
            favoritesSetQuantity(res.data.quantity);
            if (res.data.count === 0) {
              let favoritesPage = document.querySelector("#favorites-page") || false;
              console.log(favoritesPage);
              if (favoritesPage) {
                favoritesPage.querySelector(".catalog__body").remove();
                let div = document.createElement('div');
                div.classList.add('page__msg');
                div.innerText = "Нет товаров в избранном.";
                favoritesPage.append(div);
              }
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

// Якорь кнопки слайдера
$(".js-scroll-to-form").click(function () {
  document.body.style.overflow = "visible";
  document.querySelector('#head-slider').classList.add('head-slider--hidden');
  document.querySelector('.header').classList.add('header--absolute');
  var id = $(this).attr("href"),
    top = $(id).offset().top;
    $('body,html').animate({scrollTop:top},1000);

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

  let fieldRegisterMe = document.querySelector('input[name="register_me"') || false;
  if (fieldRegisterMe) {
    document.querySelector('input[name="register_me"').addEventListener('click', function (e) {
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
function checkoutFormSend () {
  let checkoutForm = document.querySelector('#checkout') || false;
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();
      $.ajax({
        url: this.action,
        method: "POST",
        data: $(document.getElementById('checkout')).serialize(),
        success: function (res) {
          // console.log(res);
          // res = JSON.parse(res);
          if (res.success) {
            document.querySelector('#modal-message-text').innerText = res.message;
            VModal.show('modal-message');
          }
        },
        statusCode: {
          422: function (res) {
            res = res.responseJSON;
            for (let name in res.errors) {
              if (res.errors.hasOwnProperty(name)) {
                document.querySelector(`input[name="${name}"]`).parentNode.classList.add('has-error');
              }
            }
          }
        }
      });
    });
  }
}

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
          if (res.success) {
            VModal.close('modal-feedback');
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

          $.each(pList, function(i, v) { $(v).data('id') != pId ? pIsNew = true : pIsNew = false;});

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

          console.log(pIsNew, cartList);

          if (pIsNew == true) {
            cartList.find('.js-header-cart-message').remove();
            $('.js-header-cart-bottom').show();
            $('.js-header-cart-bottom-btn').show();

            cartList.append('<div data-id="' + pId + '" class="header-cart-container__item js-header-cart-product"><div class="header-cart-product"><div class="header-cart-product__pic"><img src="'+fPic+'" alt="'+fName+'" class="header-cart-product__img"></div><div class="header-cart-product__content"><small class="header-cart-product__code">'+fSku+'</small><h4 class="header-cart-product__name">'+fName+'</h4><div class="header-cart-product__qnt">Количество: <span class="js-header-cart-product-qty">'+parseInt(fQty)+'</span></div><div class="header-cart-product__price"><span class="js-header-cart-product-qty">'+(parseInt(fQty)*parseInt(fPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")+' </span> <span>₽</span></div></div><div class="header-cart-product__close js-header-cart-product-delete"><div class="header-cart-product__close-inner"></div></div></div></div>');
          } else if (pIsNew == false) {
            var curQty = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
                // curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html()),
                curPrice = parseInt($('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html().replace(/\s/g, '')),
                newQty = curQty + parseInt(fQty);
            $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-qty').html(curQty + parseInt(fQty));
            $('.js-header-cart-product[data-id="'+pId+'"]').find('.js-header-cart-product-price').html((curPrice + (parseInt(fQty)*parseInt(fPrice))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
          }

          cart.addClass('is-opened');
          cartTotal.html(response.data.total);

      } else if (response.status == 'fail') {
          alert(response.errors);
      }

  }, "json");
  return false;
});

// Удаление из корзины
$(".js-header-cart-product-delete").click(function () {
  var row = $(this).closest('.js-header-cart-product'),
      cart = $('.js-header-cart-container'),
      cartList = $('.js-header-cart-items');

  $.post('/cart/delete/', {html: 1, id: row.data('id')}, function (response) {
      if (response.data.count == 0) {
          $('.js-header-cart-bottom').hide();
          $('.js-header-cart-bottom-btn').hide();
          $('.js-header-cart-count').html('0');
          $('.js-header-cart-balloon').hide();
          cartList.html('<div class="js-header-cart-message" style="justify-content: center; display: flex; padding: 20px;">Корзина пуста</div>');
          cart.removeClass('is-opened');
      }
      row.hide('slow', function() { row.remove(); });
  }, "json");
  return false;
});

// Обновление летучей корзины
function updateCartHeader (productId, qnt) {

}

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
