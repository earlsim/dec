import $ from 'jquery';
import noUiSlider from 'nouislider';

$(document).ready(function () {

  if ($(window).width() < 1025) {
    // Мобильный фильтр
    var mFilterTop;

    $('.js-m-filter-btn').click(function() {
      $('.js-catalog').toggleClass('is-hidden');
      if ($('.js-sticky').attr('data-opened') == 'false') {
        $('.js-sticky').attr('data-opened', 'true');
        mFilterTop = $(this).offset().top;
      } else if ($('.js-sticky').attr('data-opened') == 'true') {
        $('.js-sticky').attr('data-opened', 'false');
        $(window).scrollTop(200);
      }
    });

  // Липкий блок "Фильтр" в каталоге
  if ($('.js-page-content').attr('data-type') == 'catalog') {

    var Sticky = function(node){
        var doc = $(document), 
            fixed = false,
          // anchor = node,
            // content = node;
            anchor = node.find('.js-sticky-anchor'),
            bottom = node.find('.js-sticky-bottom'),
            content = node.find('.js-sticky-content');
        
        var onScroll = function(e){
          var docTop = doc.scrollTop(),
              opened = $('.js-sticky').attr('data-opened'),
              anchorTop = anchor.offset().top;
          
          if(docTop > anchorTop){
            if(!fixed && opened == 'false') {
              anchor.height(content.outerHeight());
              fixed = true;
              content.addClass('is-fixed');        
            }
          } else if (opened == 'true') {
            anchor.height(0);
            content.removeClass('is-fixed'); 
          } else {
            if(fixed && opened == 'false') {
              anchor.height(0);
              fixed = false;
              content.removeClass('is-fixed'); 
            }
          }
        };
        
        $(window).on('scroll', onScroll);
      };

      var filter = new Sticky($('.js-sticky'));
    }

  }

  $('.js-filter-form-clear').click(function() {
    var $form = $(this).closest('.js-filter-form');
    $form.trigger('reset');
    var inputs = $form.find('input');
    inputs.each(function(i,v) {
      $(v).removeAttr('checked');
    });
    $('.js-sticky-btn').removeClass('is-active');
    $form.trigger('submit');
    // console.log(inputs);
  });

  // Кнопка применить в фильтре
    $('.js-filter-slider, .js-filter-max, .js-filter-min, .js-sizes-item, .js-colors-item, .js-filter-selectable-item').click(function() {
      if ($(window).width() > 1025) {
        var anchorTop = $('.js-sticky').find('.js-sticky-anchor').offset().top;
        $('.js-sticky-btn').css('top', $(this).offset().top - anchorTop);
      } else {
      }
      $('.js-sticky-btn-wrap').fadeIn();
      $('.js-sticky-btn').addClass('is-active');
    });


  // Липкая кнопка "Применить" в фильтре
  // var StickyBtn = function(node){

  //   var doc = $(document), 
  //       fixed = false,
  //       // anchor = node,
  //       // content = node;
  //       anchor = node.closest('.js-sticky').find('.js-sticky-anchor'),
  //       bottom = node.closest('.js-sticky').find('.js-sticky-bottom'),
  //       btn = node.closest('.js-sticky').find('.js-sticky-btn');
    
  //   var onScrollBtn = function(e){
  //     console.log(bottom);
  //     var docTop = doc.scrollTop(),
  //         anchorTop = anchor.offset().top,
  //         bottomTop = bottom.offset().top;
      
  //     if(docTop > anchorTop && docTop < bottomTop){
  //       if(!fixed) {
  //         anchor.height(btn.outerHeight());
  //         fixed = true;
  //         btn.addClass('is-fixed');        
  //       }
  //     } else {
  //       if(fixed) {
  //         anchor.height(0);
  //         fixed = false;
  //         btn.removeClass('is-fixed'); 
  //       }
  //     }
  //   };
    
  //   $(window).on('scroll', onScrollBtn);
  // };

  // var filterBtn = new StickyBtn($('.js-sticky-btn'));


  // Сворачивание-разворачивание блоков
  $('.js-filter-block-btn').click(function() {
    var $this = $(this);
    var $block = $this.closest('.js-filter-block');
    var $content = $block.find('.js-filter-block-content');
 
    $block.toggleClass('is-active');    

  });

  // Сворачивание-разворачивание фильтр
  $('.js-catalog-sidebar').click(function() {
    var $this = $(this);
    $this.toggleClass('is-active');
  });
  
  //Рэндж цены

  // var priceRange = document.getElementById('price-range');

  // noUiSlider.create(priceRange, {
  //     start: [0, 100000],
  //     connect: true,
  //     step: 500,
  //     range: {
  //         'min': 0,
  //         'max': 100000
  //     }
  // });

  var sliderSelectors = document.querySelectorAll('.js-filter-slider');
  var nouiSliders = [];
  [].slice.call(sliderSelectors).forEach(function(item) {
    var snapSlider = item.querySelector('.js-filter-slider-range');
    nouiSliders.push(snapSlider);
  });

  $(nouiSliders).each(function(item) {

    var slider = nouiSliders[item];
    var $slider = $(slider);
    var id = $slider.attr('id');
    var elMin = $slider.closest('.js-product-filter').find('.js-filter-min');
    var elMax = $slider.closest('.js-product-filter').find('.js-filter-max');
    var getMin = /' + id +'_min=([^&#=]*)/.exec(window.location.search);
    var getMax = /'+ id + '_max=([^&#=]*)/.exec(window.location.search);
    let minValue = parseFloat(elMin.attr('placeholder'));
    let maxValue = parseFloat(elMax.attr('placeholder'));

    var slideMinValue = 0;
    var slideMaxValue = 0;

    if (getMin) {
      var getMinValue = parseFloat(getMin[1]);
      getMinValue != minValue ? slideMinValue = getMinValue : slideMinValue = minValue;
    } else {
      slideMinValue = minValue;
    }

    if (getMax) {
      var getMaxValue = parseFloat(getMax[1]);
      getMaxValue != maxValue ? slideMaxValue = getMaxValue : slideMaxValue = maxValue;
    } else {
      slideMaxValue = maxValue;
    }

    noUiSlider.create(slider, {
      start: [ slideMinValue , slideMaxValue ],
      connect: true,
      step: 1000,
      range: {
        'min': minValue,
        'max': maxValue
      }
    });

    var slideValues = [
      elMin,
      elMax
    ];

    slider.noUiSlider.on('update', function( values, handle ) {
      slideValues[handle].val(Math.abs(Math.round(values[handle])) + ' руб');
    });

    $('.js-price-btns input[name=priceVariant]').change(function() {
      let prices = {
        1: {
          from: 100,
          to: 2000,
        },
        2: {
          from: 2000,
          to: 5000,
        },
        3: {
          from: 5000,
          to: 10000,
        },
        4: {
          from: 10000,
          to: maxValue,
        }
      };

      slider.noUiSlider.updateOptions({
          start: [prices[this.value].from, prices[this.value].to]
        });
      elMin.value = (prices[this.value].from + ' руб');
      elMax.value = (prices[this.value].to + ' руб');
    });

  });

});