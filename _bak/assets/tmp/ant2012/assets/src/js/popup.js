import $ from 'jquery';

;( function( $, window, document, undefined ) {

  "use strict";

  // Create the defaults once
  var pluginName = "popup",
    defaults = {
      outside: true,
      activeClass: false
    };

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = element;

    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  $.extend( Plugin.prototype, {
    init: function() {

      this.$element = $(this.element);
      this.id = this.$element.attr('data-id');

      this.$popup = $('#' + this.id);

      if (this.$popup.length) {
        this.$close = this.$popup.find('.js-popup-close');
        this.bindEvents();
      }

    },
    bindEvents: function () {
      var self = this;

      self.$element.click(function (e) {
        e.preventDefault();

        // self.$popup.toggle();
        if (self.settings.activeClass) {
          self.$element.toggleClass(self.settings.activeClass);
          self.$popup.toggleClass(self.settings.activeClass);
        }
        window.dispatchEvent(new Event('resize'));
      });

      self.$popup.click(function (e) {
        e.stopPropagation();
      });

      if (self.$close && self.$close.length) {
        self.$close.click(function (e) {
          // self.$popup.hide();
          if (self.settings.activeClass) {
            self.$element.removeClass(self.settings.activeClass);
            self.$popup.removeClass(self.settings.activeClass);
          }
        });
      }

      if (this.settings.outside) {
        $(window).click(function (e) {

          if (self.$element.get(0) !== e.target && !self.$element.find(e.target).length) {
            // self.$popup.hide();
            if (self.settings.activeClass) {
              self.$element.removeClass(self.settings.activeClass);
              self.$popup.removeClass(self.settings.activeClass);
            }
          }

        });
      }
    }
  } );

  $.fn[ pluginName ] = function( options ) {
    return this.each( function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" +
          pluginName, new Plugin( this, options ) );
      }
    } );
  };

} )( $, window, document );

$('.js-popup').popup();
$('.js-filter-item, .js-menu-btn, .js-m-filter-btn').popup({
  activeClass: 'is-active'
});