"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }

      factory(jQuery);
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  $.fn.tilt = function (options) {
    /**
     * RequestAnimationFrame
     */
    var requestTick = function requestTick() {
      if (this.ticking) return;
      requestAnimationFrame(updateTransforms.bind(this));
      this.ticking = true;
    };
    /**
     * Bind mouse movement evens on instance
     */


    var bindEvents = function bindEvents() {
      var _this = this;

      $(this).on('mousemove', mouseMove);
      $(this).on('mouseenter', mouseEnter);
      if (this.settings.reset) $(this).on('mouseleave', mouseLeave);
      if (this.settings.glare) $(window).on('resize', updateGlareSize.bind(_this));
    };
    /**
     * Set transition only on mouse leave and mouse enter so it doesn't influence mouse move transforms
     */


    var setTransition = function setTransition() {
      var _this2 = this;

      if (this.timeout !== undefined) clearTimeout(this.timeout);
      $(this).css({
        'transition': "".concat(this.settings.speed, "ms ").concat(this.settings.easing)
      });
      if (this.settings.glare) this.glareElement.css({
        'transition': "opacity ".concat(this.settings.speed, "ms ").concat(this.settings.easing)
      });
      this.timeout = setTimeout(function () {
        $(_this2).css({
          'transition': ''
        });
        if (_this2.settings.glare) _this2.glareElement.css({
          'transition': ''
        });
      }, this.settings.speed);
    };
    /**
     * When user mouse enters tilt element
     */


    var mouseEnter = function mouseEnter(event) {
      this.ticking = false;
      $(this).css({
        'will-change': 'transform'
      });
      setTransition.call(this); // Trigger change event

      $(this).trigger("tilt.mouseEnter");
    };
    /**
     * Return the x,y position of the mouse on the tilt element
     * @returns {{x: *, y: *}}
     */


    var getMousePositions = function getMousePositions(event) {
      if (typeof event === "undefined") {
        event = {
          pageX: $(this).offset().left + $(this).outerWidth() / 2,
          pageY: $(this).offset().top + $(this).outerHeight() / 2
        };
      }

      return {
        x: event.pageX,
        y: event.pageY
      };
    };
    /**
     * When user mouse moves over the tilt element
     */


    var mouseMove = function mouseMove(event) {
      this.mousePositions = getMousePositions(event);
      requestTick.call(this);
    };
    /**
     * When user mouse leaves tilt element
     */


    var mouseLeave = function mouseLeave() {
      setTransition.call(this);
      this.reset = true;
      requestTick.call(this); // Trigger change event

      $(this).trigger("tilt.mouseLeave");
    };
    /**
     * Get tilt values
     *
     * @returns {{x: tilt value, y: tilt value}}
     */


    var getValues = function getValues() {
      var width = $(this).outerWidth();
      var height = $(this).outerHeight();
      var left = $(this).offset().left;
      var top = $(this).offset().top;
      var percentageX = (this.mousePositions.x - left) / width;
      var percentageY = (this.mousePositions.y - top) / height; // x or y position inside instance / width of instance = percentage of position inside instance * the max tilt value

      var tiltX = (this.settings.maxTilt / 2 - percentageX * this.settings.maxTilt).toFixed(2);
      var tiltY = (percentageY * this.settings.maxTilt - this.settings.maxTilt / 2).toFixed(2); // angle

      var angle = Math.atan2(this.mousePositions.x - (left + width / 2), -(this.mousePositions.y - (top + height / 2))) * (180 / Math.PI); // Return x & y tilt values

      return {
        tiltX: tiltX,
        tiltY: tiltY,
        'percentageX': percentageX * 100,
        'percentageY': percentageY * 100,
        angle: angle
      };
    };
    /**
     * Update tilt transforms on mousemove
     */


    var updateTransforms = function updateTransforms() {
      this.transforms = getValues.call(this);

      if (this.reset) {
        this.reset = false;
        $(this).css('transform', "perspective(".concat(this.settings.perspective, "px) rotateX(0deg) rotateY(0deg)")); // Rotate glare if enabled

        if (this.settings.glare) {
          this.glareElement.css('transform', "rotate(180deg) translate(-50%, -50%)");
          this.glareElement.css('opacity', "0");
        }

        return;
      } else {
        $(this).css('transform', "perspective(".concat(this.settings.perspective, "px) rotateX(").concat(this.settings.disableAxis === 'x' ? 0 : this.transforms.tiltY, "deg) rotateY(").concat(this.settings.disableAxis === 'y' ? 0 : this.transforms.tiltX, "deg) scale3d(").concat(this.settings.scale, ",").concat(this.settings.scale, ",").concat(this.settings.scale, ")")); // Rotate glare if enabled

        if (this.settings.glare) {
          this.glareElement.css('transform', "rotate(".concat(this.transforms.angle, "deg) translate(-50%, -50%)"));
          this.glareElement.css('opacity', "".concat(this.transforms.percentageY * this.settings.maxGlare / 100));
        }
      } // Trigger change event


      $(this).trigger("change", [this.transforms]);
      this.ticking = false;
    };
    /**
     * Prepare elements
     */


    var prepareGlare = function prepareGlare() {
      var glarePrerender = this.settings.glarePrerender; // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.

      if (!glarePrerender) // Create glare element
        $(this).append('<div class="js-tilt-glare"><div class="js-tilt-glare-inner"></div></div>'); // Store glare selector if glare is enabled

      this.glareElementWrapper = $(this).find(".js-tilt-glare");
      this.glareElement = $(this).find(".js-tilt-glare-inner"); // Remember? We assume all css is already set, so just return

      if (glarePrerender) return; // Abstracted re-usable glare styles

      var stretch = {
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%'
      }; // Style glare wrapper

      this.glareElementWrapper.css(stretch).css({
        'overflow': 'hidden',
        'pointer-events': 'none'
      }); // Style glare element

      this.glareElement.css({
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'background-image': "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
        'width': "".concat($(this).outerWidth() * 2),
        'height': "".concat($(this).outerWidth() * 2),
        'transform': 'rotate(180deg) translate(-50%, -50%)',
        'transform-origin': '0% 0%',
        'opacity': '0'
      });
    };
    /**
     * Update glare on resize
     */


    var updateGlareSize = function updateGlareSize() {
      this.glareElement.css({
        'width': "".concat($(this).outerWidth() * 2),
        'height': "".concat($(this).outerWidth() * 2)
      });
    };
    /**
     * Public methods
     */


    $.fn.tilt.destroy = function () {
      $(this).each(function () {
        $(this).find('.js-tilt-glare').remove();
        $(this).css({
          'will-change': '',
          'transform': ''
        });
        $(this).off('mousemove mouseenter mouseleave');
      });
    };

    $.fn.tilt.getValues = function () {
      var results = [];
      $(this).each(function () {
        this.mousePositions = getMousePositions.call(this);
        results.push(getValues.call(this));
      });
      return results;
    };

    $.fn.tilt.reset = function () {
      $(this).each(function () {
        var _this3 = this;

        this.mousePositions = getMousePositions.call(this);
        this.settings = $(this).data('settings');
        mouseLeave.call(this);
        setTimeout(function () {
          _this3.reset = false;
        }, this.settings.transition);
      });
    };
    /**
     * Loop every instance
     */


    return this.each(function () {
      var _this4 = this;

      /**
       * Default settings merged with user settings
       * Can be set trough data attributes or as parameter.
       * @type {*}
       */
      this.settings = $.extend({
        maxTilt: $(this).is('[data-tilt-max]') ? $(this).data('tilt-max') : 20,
        perspective: $(this).is('[data-tilt-perspective]') ? $(this).data('tilt-perspective') : 300,
        easing: $(this).is('[data-tilt-easing]') ? $(this).data('tilt-easing') : 'cubic-bezier(.03,.98,.52,.99)',
        scale: $(this).is('[data-tilt-scale]') ? $(this).data('tilt-scale') : '1',
        speed: $(this).is('[data-tilt-speed]') ? $(this).data('tilt-speed') : '400',
        transition: $(this).is('[data-tilt-transition]') ? $(this).data('tilt-transition') : true,
        disableAxis: $(this).is('[data-tilt-disable-axis]') ? $(this).data('tilt-disable-axis') : null,
        axis: $(this).is('[data-tilt-axis]') ? $(this).data('tilt-axis') : null,
        reset: $(this).is('[data-tilt-reset]') ? $(this).data('tilt-reset') : true,
        glare: $(this).is('[data-tilt-glare]') ? $(this).data('tilt-glare') : false,
        maxGlare: $(this).is('[data-tilt-maxglare]') ? $(this).data('tilt-maxglare') : 1
      }, options); // Add deprecation warning & set disableAxis to deprecated axis setting

      if (this.settings.axis !== null) {
        console.warn('Tilt.js: the axis setting has been renamed to disableAxis. See https://github.com/gijsroge/tilt.js/pull/26 for more information');
        this.settings.disableAxis = this.settings.axis;
      }

      this.init = function () {
        // Store settings
        $(_this4).data('settings', _this4.settings); // Prepare element

        if (_this4.settings.glare) prepareGlare.call(_this4); // Bind events

        bindEvents.call(_this4);
      }; // Init


      this.init();
    });
  };
  /**
   * Auto load
   */


  $('[data-tilt]').tilt();
  return true;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsdC5qcXVlcnkuanMiLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwibW9kdWxlIiwiZXhwb3J0cyIsInJvb3QiLCJqUXVlcnkiLCJ1bmRlZmluZWQiLCJ3aW5kb3ciLCJyZXF1aXJlIiwiJCIsImZuIiwidGlsdCIsIm9wdGlvbnMiLCJyZXF1ZXN0VGljayIsInRpY2tpbmciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ1cGRhdGVUcmFuc2Zvcm1zIiwiYmluZCIsImJpbmRFdmVudHMiLCJfdGhpcyIsIm9uIiwibW91c2VNb3ZlIiwibW91c2VFbnRlciIsInNldHRpbmdzIiwicmVzZXQiLCJtb3VzZUxlYXZlIiwiZ2xhcmUiLCJ1cGRhdGVHbGFyZVNpemUiLCJzZXRUcmFuc2l0aW9uIiwidGltZW91dCIsImNsZWFyVGltZW91dCIsImNzcyIsInNwZWVkIiwiZWFzaW5nIiwiZ2xhcmVFbGVtZW50Iiwic2V0VGltZW91dCIsImV2ZW50IiwiY2FsbCIsInRyaWdnZXIiLCJnZXRNb3VzZVBvc2l0aW9ucyIsInBhZ2VYIiwib2Zmc2V0IiwibGVmdCIsIm91dGVyV2lkdGgiLCJwYWdlWSIsInRvcCIsIm91dGVySGVpZ2h0IiwieCIsInkiLCJtb3VzZVBvc2l0aW9ucyIsImdldFZhbHVlcyIsIndpZHRoIiwiaGVpZ2h0IiwicGVyY2VudGFnZVgiLCJwZXJjZW50YWdlWSIsInRpbHRYIiwibWF4VGlsdCIsInRvRml4ZWQiLCJ0aWx0WSIsImFuZ2xlIiwiTWF0aCIsImF0YW4yIiwiUEkiLCJ0cmFuc2Zvcm1zIiwicGVyc3BlY3RpdmUiLCJkaXNhYmxlQXhpcyIsInNjYWxlIiwibWF4R2xhcmUiLCJwcmVwYXJlR2xhcmUiLCJnbGFyZVByZXJlbmRlciIsImFwcGVuZCIsImdsYXJlRWxlbWVudFdyYXBwZXIiLCJmaW5kIiwic3RyZXRjaCIsImRlc3Ryb3kiLCJlYWNoIiwicmVtb3ZlIiwib2ZmIiwicmVzdWx0cyIsInB1c2giLCJkYXRhIiwidHJhbnNpdGlvbiIsImV4dGVuZCIsImlzIiwiYXhpcyIsImNvbnNvbGUiLCJ3YXJuIiwiaW5pdCJdLCJzb3VyY2VzIjpbInRpbHQuanF1ZXJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZmFjdG9yeSkge1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoWydqcXVlcnknXSwgZmFjdG9yeSk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAgICAgLy8gTm9kZS9Db21tb25KU1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHJvb3QsIGpRdWVyeSApIHtcclxuICAgICAgICAgICAgaWYgKCBqUXVlcnkgPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlcXVpcmUoJ2pRdWVyeScpIHJldHVybnMgYSBmYWN0b3J5IHRoYXQgcmVxdWlyZXMgd2luZG93IHRvXHJcbiAgICAgICAgICAgICAgICAvLyBidWlsZCBhIGpRdWVyeSBpbnN0YW5jZSwgd2Ugbm9ybWFsaXplIGhvdyB3ZSB1c2UgbW9kdWxlc1xyXG4gICAgICAgICAgICAgICAgLy8gdGhhdCByZXF1aXJlIHRoaXMgcGF0dGVybiBidXQgdGhlIHdpbmRvdyBwcm92aWRlZCBpcyBhIG5vb3BcclxuICAgICAgICAgICAgICAgIC8vIGlmIGl0J3MgZGVmaW5lZCAoaG93IGpxdWVyeSB3b3JrcylcclxuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgalF1ZXJ5ID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKShyb290KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XHJcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnk7XHJcbiAgICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXHJcbiAgICAgICAgZmFjdG9yeShqUXVlcnkpO1xyXG4gICAgfVxyXG59KGZ1bmN0aW9uICgkKSB7XHJcbiAgICAkLmZuLnRpbHQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCByZXF1ZXN0VGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aWNraW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVUcmFuc2Zvcm1zLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLnRpY2tpbmcgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJpbmQgbW91c2UgbW92ZW1lbnQgZXZlbnMgb24gaW5zdGFuY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBiaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2Vtb3ZlJywgbW91c2VNb3ZlKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5vbignbW91c2VlbnRlcicsIG1vdXNlRW50ZXIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5yZXNldCkgJCh0aGlzKS5vbignbW91c2VsZWF2ZScsIG1vdXNlTGVhdmUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5nbGFyZSkgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB1cGRhdGVHbGFyZVNpemUuYmluZChfdGhpcykpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldCB0cmFuc2l0aW9uIG9ubHkgb24gbW91c2UgbGVhdmUgYW5kIG1vdXNlIGVudGVyIHNvIGl0IGRvZXNuJ3QgaW5mbHVlbmNlIG1vdXNlIG1vdmUgdHJhbnNmb3Jtc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IHNldFRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZW91dCAhPT0gdW5kZWZpbmVkKSBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jc3Moeyd0cmFuc2l0aW9uJzogYCR7dGhpcy5zZXR0aW5ncy5zcGVlZH1tcyAke3RoaXMuc2V0dGluZ3MuZWFzaW5nfWB9KTtcclxuICAgICAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5nbGFyZSkgdGhpcy5nbGFyZUVsZW1lbnQuY3NzKHsndHJhbnNpdGlvbic6IGBvcGFjaXR5ICR7dGhpcy5zZXR0aW5ncy5zcGVlZH1tcyAke3RoaXMuc2V0dGluZ3MuZWFzaW5nfWB9KTtcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyh7J3RyYW5zaXRpb24nOiAnJ30pO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5nbGFyZSkgdGhpcy5nbGFyZUVsZW1lbnQuY3NzKHsndHJhbnNpdGlvbic6ICcnfSk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMuc2V0dGluZ3Muc3BlZWQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gdXNlciBtb3VzZSBlbnRlcnMgdGlsdCBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgbW91c2VFbnRlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGlja2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNzcyh7J3dpbGwtY2hhbmdlJzogJ3RyYW5zZm9ybSd9KTtcclxuICAgICAgICAgICAgc2V0VHJhbnNpdGlvbi5jYWxsKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgZXZlbnRcclxuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKFwidGlsdC5tb3VzZUVudGVyXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybiB0aGUgeCx5IHBvc2l0aW9uIG9mIHRoZSBtb3VzZSBvbiB0aGUgdGlsdCBlbGVtZW50XHJcbiAgICAgICAgICogQHJldHVybnMge3t4OiAqLCB5OiAqfX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBnZXRNb3VzZVBvc2l0aW9ucyA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YoZXZlbnQpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudCA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlWDogJCh0aGlzKS5vZmZzZXQoKS5sZWZ0ICsgJCh0aGlzKS5vdXRlcldpZHRoKCkgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VZOiAkKHRoaXMpLm9mZnNldCgpLnRvcCArICQodGhpcykub3V0ZXJIZWlnaHQoKSAvIDJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHt4OiBldmVudC5wYWdlWCwgeTogZXZlbnQucGFnZVl9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gdXNlciBtb3VzZSBtb3ZlcyBvdmVyIHRoZSB0aWx0IGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBtb3VzZU1vdmUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb25zID0gZ2V0TW91c2VQb3NpdGlvbnMoZXZlbnQpO1xyXG4gICAgICAgICAgICByZXF1ZXN0VGljay5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gdXNlciBtb3VzZSBsZWF2ZXMgdGlsdCBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgbW91c2VMZWF2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzZXRUcmFuc2l0aW9uLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXF1ZXN0VGljay5jYWxsKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgZXZlbnRcclxuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKFwidGlsdC5tb3VzZUxlYXZlXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCB0aWx0IHZhbHVlc1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMge3t4OiB0aWx0IHZhbHVlLCB5OiB0aWx0IHZhbHVlfX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBnZXRWYWx1ZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSAkKHRoaXMpLm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gJCh0aGlzKS5vZmZzZXQoKS5sZWZ0O1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSAkKHRoaXMpLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZVggPSAodGhpcy5tb3VzZVBvc2l0aW9ucy54IC0gbGVmdCkgLyB3aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZVkgPSAodGhpcy5tb3VzZVBvc2l0aW9ucy55IC0gdG9wKSAvIGhlaWdodDtcclxuICAgICAgICAgICAgLy8geCBvciB5IHBvc2l0aW9uIGluc2lkZSBpbnN0YW5jZSAvIHdpZHRoIG9mIGluc3RhbmNlID0gcGVyY2VudGFnZSBvZiBwb3NpdGlvbiBpbnNpZGUgaW5zdGFuY2UgKiB0aGUgbWF4IHRpbHQgdmFsdWVcclxuICAgICAgICAgICAgY29uc3QgdGlsdFggPSAoKHRoaXMuc2V0dGluZ3MubWF4VGlsdCAvIDIpIC0gKChwZXJjZW50YWdlWCkgKiB0aGlzLnNldHRpbmdzLm1heFRpbHQpKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICBjb25zdCB0aWx0WSA9ICgoKHBlcmNlbnRhZ2VZKSAqIHRoaXMuc2V0dGluZ3MubWF4VGlsdCkgLSAodGhpcy5zZXR0aW5ncy5tYXhUaWx0IC8gMikpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgIC8vIGFuZ2xlXHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuMih0aGlzLm1vdXNlUG9zaXRpb25zLnggLSAobGVmdCt3aWR0aC8yKSwtICh0aGlzLm1vdXNlUG9zaXRpb25zLnkgLSAodG9wK2hlaWdodC8yKSkgKSooMTgwL01hdGguUEkpO1xyXG4gICAgICAgICAgICAvLyBSZXR1cm4geCAmIHkgdGlsdCB2YWx1ZXNcclxuICAgICAgICAgICAgcmV0dXJuIHt0aWx0WCwgdGlsdFksICdwZXJjZW50YWdlWCc6IHBlcmNlbnRhZ2VYICogMTAwLCAncGVyY2VudGFnZVknOiBwZXJjZW50YWdlWSAqIDEwMCwgYW5nbGV9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZSB0aWx0IHRyYW5zZm9ybXMgb24gbW91c2Vtb3ZlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgdXBkYXRlVHJhbnNmb3JtcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybXMgPSBnZXRWYWx1ZXMuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygndHJhbnNmb3JtJywgYHBlcnNwZWN0aXZlKCR7dGhpcy5zZXR0aW5ncy5wZXJzcGVjdGl2ZX1weCkgcm90YXRlWCgwZGVnKSByb3RhdGVZKDBkZWcpYCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUm90YXRlIGdsYXJlIGlmIGVuYWJsZWRcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdsYXJlKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdsYXJlRWxlbWVudC5jc3MoJ3RyYW5zZm9ybScsIGByb3RhdGUoMTgwZGVnKSB0cmFuc2xhdGUoLTUwJSwgLTUwJSlgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdsYXJlRWxlbWVudC5jc3MoJ29wYWNpdHknLCBgMGApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCd0cmFuc2Zvcm0nLCBgcGVyc3BlY3RpdmUoJHt0aGlzLnNldHRpbmdzLnBlcnNwZWN0aXZlfXB4KSByb3RhdGVYKCR7dGhpcy5zZXR0aW5ncy5kaXNhYmxlQXhpcyA9PT0gJ3gnID8gMCA6IHRoaXMudHJhbnNmb3Jtcy50aWx0WX1kZWcpIHJvdGF0ZVkoJHt0aGlzLnNldHRpbmdzLmRpc2FibGVBeGlzID09PSAneScgPyAwIDogdGhpcy50cmFuc2Zvcm1zLnRpbHRYfWRlZykgc2NhbGUzZCgke3RoaXMuc2V0dGluZ3Muc2NhbGV9LCR7dGhpcy5zZXR0aW5ncy5zY2FsZX0sJHt0aGlzLnNldHRpbmdzLnNjYWxlfSlgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSb3RhdGUgZ2xhcmUgaWYgZW5hYmxlZFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ2xhcmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xhcmVFbGVtZW50LmNzcygndHJhbnNmb3JtJywgYHJvdGF0ZSgke3RoaXMudHJhbnNmb3Jtcy5hbmdsZX1kZWcpIHRyYW5zbGF0ZSgtNTAlLCAtNTAlKWApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xhcmVFbGVtZW50LmNzcygnb3BhY2l0eScsIGAke3RoaXMudHJhbnNmb3Jtcy5wZXJjZW50YWdlWSAqIHRoaXMuc2V0dGluZ3MubWF4R2xhcmUgLyAxMDB9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgY2hhbmdlIGV2ZW50XHJcbiAgICAgICAgICAgICQodGhpcykudHJpZ2dlcihcImNoYW5nZVwiLCBbdGhpcy50cmFuc2Zvcm1zXSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRpY2tpbmcgPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQcmVwYXJlIGVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgcHJlcGFyZUdsYXJlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zdCBnbGFyZVByZXJlbmRlciA9IHRoaXMuc2V0dGluZ3MuZ2xhcmVQcmVyZW5kZXI7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBvcHRpb24gcHJlLXJlbmRlciBpcyBlbmFibGVkIHdlIGFzc3VtZSBhbGwgaHRtbC9jc3MgaXMgcHJlc2VudCBmb3IgYW4gb3B0aW1hbCBnbGFyZSBlZmZlY3QuXHJcbiAgICAgICAgICAgIGlmICghZ2xhcmVQcmVyZW5kZXIpXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBnbGFyZSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImpzLXRpbHQtZ2xhcmVcIj48ZGl2IGNsYXNzPVwianMtdGlsdC1nbGFyZS1pbm5lclwiPjwvZGl2PjwvZGl2PicpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RvcmUgZ2xhcmUgc2VsZWN0b3IgaWYgZ2xhcmUgaXMgZW5hYmxlZFxyXG4gICAgICAgICAgICB0aGlzLmdsYXJlRWxlbWVudFdyYXBwZXIgPSAkKHRoaXMpLmZpbmQoXCIuanMtdGlsdC1nbGFyZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5nbGFyZUVsZW1lbnQgPSAkKHRoaXMpLmZpbmQoXCIuanMtdGlsdC1nbGFyZS1pbm5lclwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbWVtYmVyPyBXZSBhc3N1bWUgYWxsIGNzcyBpcyBhbHJlYWR5IHNldCwgc28ganVzdCByZXR1cm5cclxuICAgICAgICAgICAgaWYgKGdsYXJlUHJlcmVuZGVyKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyBBYnN0cmFjdGVkIHJlLXVzYWJsZSBnbGFyZSBzdHlsZXNcclxuICAgICAgICAgICAgY29uc3Qgc3RyZXRjaCA9IHtcclxuICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgICAndG9wJzogJzAnLFxyXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogJzEwMCUnLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gU3R5bGUgZ2xhcmUgd3JhcHBlclxyXG4gICAgICAgICAgICB0aGlzLmdsYXJlRWxlbWVudFdyYXBwZXIuY3NzKHN0cmV0Y2gpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICdwb2ludGVyLWV2ZW50cyc6ICdub25lJyxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdHlsZSBnbGFyZSBlbGVtZW50XHJcbiAgICAgICAgICAgIHRoaXMuZ2xhcmVFbGVtZW50LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgJ3RvcCc6ICc1MCUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiAnNTAlJyxcclxuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogYGxpbmVhci1ncmFkaWVudCgwZGVnLCByZ2JhKDI1NSwyNTUsMjU1LDApIDAlLCByZ2JhKDI1NSwyNTUsMjU1LDEpIDEwMCUpYCxcclxuICAgICAgICAgICAgICAgICd3aWR0aCc6IGAkeyQodGhpcykub3V0ZXJXaWR0aCgpKjJ9YCxcclxuICAgICAgICAgICAgICAgICdoZWlnaHQnOiBgJHskKHRoaXMpLm91dGVyV2lkdGgoKSoyfWAsXHJcbiAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogJ3JvdGF0ZSgxODBkZWcpIHRyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXHJcbiAgICAgICAgICAgICAgICAndHJhbnNmb3JtLW9yaWdpbic6ICcwJSAwJScsXHJcbiAgICAgICAgICAgICAgICAnb3BhY2l0eSc6ICcwJyxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZSBnbGFyZSBvbiByZXNpemVcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCB1cGRhdGVHbGFyZVNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2xhcmVFbGVtZW50LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiBgJHskKHRoaXMpLm91dGVyV2lkdGgoKSoyfWAsXHJcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JzogYCR7JCh0aGlzKS5vdXRlcldpZHRoKCkqMn1gLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQdWJsaWMgbWV0aG9kc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQuZm4udGlsdC5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy10aWx0LWdsYXJlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyh7J3dpbGwtY2hhbmdlJzogJycsICd0cmFuc2Zvcm0nOiAnJ30pO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vZmYoJ21vdXNlbW92ZSBtb3VzZWVudGVyIG1vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJC5mbi50aWx0LmdldFZhbHVlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gW107XHJcbiAgICAgICAgICAgICQodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlUG9zaXRpb25zID0gZ2V0TW91c2VQb3NpdGlvbnMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChnZXRWYWx1ZXMuY2FsbCh0aGlzKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkLmZuLnRpbHQucmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW91c2VQb3NpdGlvbnMgPSBnZXRNb3VzZVBvc2l0aW9ucy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQodGhpcykuZGF0YSgnc2V0dGluZ3MnKTtcclxuICAgICAgICAgICAgICAgIG1vdXNlTGVhdmUuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuc2V0dGluZ3MudHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvb3AgZXZlcnkgaW5zdGFuY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZWZhdWx0IHNldHRpbmdzIG1lcmdlZCB3aXRoIHVzZXIgc2V0dGluZ3NcclxuICAgICAgICAgICAgICogQ2FuIGJlIHNldCB0cm91Z2ggZGF0YSBhdHRyaWJ1dGVzIG9yIGFzIHBhcmFtZXRlci5cclxuICAgICAgICAgICAgICogQHR5cGUgeyp9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgbWF4VGlsdDogJCh0aGlzKS5pcygnW2RhdGEtdGlsdC1tYXhdJykgPyAkKHRoaXMpLmRhdGEoJ3RpbHQtbWF4JykgOiAyMCxcclxuICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlOiAkKHRoaXMpLmlzKCdbZGF0YS10aWx0LXBlcnNwZWN0aXZlXScpID8gJCh0aGlzKS5kYXRhKCd0aWx0LXBlcnNwZWN0aXZlJykgOiAzMDAsXHJcbiAgICAgICAgICAgICAgICBlYXNpbmc6ICQodGhpcykuaXMoJ1tkYXRhLXRpbHQtZWFzaW5nXScpID8gJCh0aGlzKS5kYXRhKCd0aWx0LWVhc2luZycpIDogJ2N1YmljLWJlemllciguMDMsLjk4LC41MiwuOTkpJyxcclxuICAgICAgICAgICAgICAgIHNjYWxlOiAkKHRoaXMpLmlzKCdbZGF0YS10aWx0LXNjYWxlXScpID8gJCh0aGlzKS5kYXRhKCd0aWx0LXNjYWxlJykgOiAnMScsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJCh0aGlzKS5pcygnW2RhdGEtdGlsdC1zcGVlZF0nKSA/ICQodGhpcykuZGF0YSgndGlsdC1zcGVlZCcpIDogJzQwMCcsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAkKHRoaXMpLmlzKCdbZGF0YS10aWx0LXRyYW5zaXRpb25dJykgPyAkKHRoaXMpLmRhdGEoJ3RpbHQtdHJhbnNpdGlvbicpIDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVBeGlzOiAkKHRoaXMpLmlzKCdbZGF0YS10aWx0LWRpc2FibGUtYXhpc10nKSA/ICQodGhpcykuZGF0YSgndGlsdC1kaXNhYmxlLWF4aXMnKSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBheGlzOiAkKHRoaXMpLmlzKCdbZGF0YS10aWx0LWF4aXNdJykgPyAkKHRoaXMpLmRhdGEoJ3RpbHQtYXhpcycpIDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHJlc2V0OiAkKHRoaXMpLmlzKCdbZGF0YS10aWx0LXJlc2V0XScpID8gJCh0aGlzKS5kYXRhKCd0aWx0LXJlc2V0JykgOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZ2xhcmU6ICQodGhpcykuaXMoJ1tkYXRhLXRpbHQtZ2xhcmVdJykgPyAkKHRoaXMpLmRhdGEoJ3RpbHQtZ2xhcmUnKSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWF4R2xhcmU6ICQodGhpcykuaXMoJ1tkYXRhLXRpbHQtbWF4Z2xhcmVdJykgPyAkKHRoaXMpLmRhdGEoJ3RpbHQtbWF4Z2xhcmUnKSA6IDEsXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGRlcHJlY2F0aW9uIHdhcm5pbmcgJiBzZXQgZGlzYWJsZUF4aXMgdG8gZGVwcmVjYXRlZCBheGlzIHNldHRpbmdcclxuICAgICAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5heGlzICE9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVGlsdC5qczogdGhlIGF4aXMgc2V0dGluZyBoYXMgYmVlbiByZW5hbWVkIHRvIGRpc2FibGVBeGlzLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2dpanNyb2dlL3RpbHQuanMvcHVsbC8yNiBmb3IgbW9yZSBpbmZvcm1hdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5kaXNhYmxlQXhpcyA9IHRoaXMuc2V0dGluZ3MuYXhpcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5pbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgc2V0dGluZ3NcclxuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgnc2V0dGluZ3MnLCB0aGlzLnNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBQcmVwYXJlIGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZ2xhcmUpIHByZXBhcmVHbGFyZS5jYWxsKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEJpbmQgZXZlbnRzXHJcbiAgICAgICAgICAgICAgICBiaW5kRXZlbnRzLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBJbml0XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdXRvIGxvYWRcclxuICAgICAqL1xyXG4gICAgJCgnW2RhdGEtdGlsdF0nKS50aWx0KCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn0pKTsiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQyxXQUFVQSxPQUFWLEVBQW1CO0VBQ2hCLElBQUksT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsTUFBTSxDQUFDQyxHQUEzQyxFQUFnRDtJQUM1QztJQUNBRCxNQUFNLENBQUMsQ0FBQyxRQUFELENBQUQsRUFBYUQsT0FBYixDQUFOO0VBQ0gsQ0FIRCxNQUdPLElBQUksUUFBT0csTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QkEsTUFBTSxDQUFDQyxPQUF6QyxFQUFrRDtJQUNyRDtJQUNBRCxNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBVUMsSUFBVixFQUFnQkMsTUFBaEIsRUFBeUI7TUFDdEMsSUFBS0EsTUFBTSxLQUFLQyxTQUFoQixFQUE0QjtRQUN4QjtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUssT0FBT0MsTUFBUCxLQUFrQixXQUF2QixFQUFxQztVQUNqQ0YsTUFBTSxHQUFHRyxPQUFPLENBQUMsUUFBRCxDQUFoQjtRQUNILENBRkQsTUFHSztVQUNESCxNQUFNLEdBQUdHLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JKLElBQWxCLENBQVQ7UUFDSDtNQUNKOztNQUNETCxPQUFPLENBQUNNLE1BQUQsQ0FBUDtNQUNBLE9BQU9BLE1BQVA7SUFDSCxDQWZEO0VBZ0JILENBbEJNLE1Ba0JBO0lBQ0g7SUFDQU4sT0FBTyxDQUFDTSxNQUFELENBQVA7RUFDSDtBQUNKLENBMUJBLEVBMEJDLFVBQVVJLENBQVYsRUFBYTtFQUNYQSxDQUFDLENBQUNDLEVBQUYs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