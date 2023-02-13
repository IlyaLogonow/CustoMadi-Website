"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var StickyNavigation = /*#__PURE__*/function () {
  function StickyNavigation() {
    var _this = this;

    _classCallCheck(this, StickyNavigation);

    this.currentId = null;
    this.currentTab = null;
    this.tabContainerHeight = 70;
    var self = this;
    $('.et-hero-tab').click(function () {
      self.onTabClick(event, $(this));
    });
    $(window).scroll(function () {
      _this.onScroll();
    });
    $(window).resize(function () {
      _this.onResize();
    });
  }

  _createClass(StickyNavigation, [{
    key: "onTabClick",
    value: function onTabClick(event, element) {
      event.preventDefault();
      var scrollTop = $(element.attr('href')).offset().top - this.tabContainerHeight + 1;
      $('html, body').animate({
        scrollTop: scrollTop
      }, 600);
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      this.checkTabContainerPosition();
      this.findCurrentTabSelector();
    }
  }, {
    key: "onResize",
    value: function onResize() {
      if (this.currentId) {
        this.setSliderCss();
      }
    }
  }, {
    key: "checkTabContainerPosition",
    value: function checkTabContainerPosition() {
      var offset = $('.et-hero-tabs').offset().top + $('.et-hero-tabs').height() - this.tabContainerHeight;

      if ($(window).scrollTop() > offset) {
        $('.et-hero-tabs-container').addClass('et-hero-tabs-container--top');
      } else {
        $('.et-hero-tabs-container').removeClass('et-hero-tabs-container--top');
      }
    }
  }, {
    key: "findCurrentTabSelector",
    value: function findCurrentTabSelector(element) {
      var newCurrentId;
      var newCurrentTab;
      var self = this;
      $('.et-hero-tab').each(function () {
        var id = $(this).attr('href');
        var offsetTop = $(id).offset().top - self.tabContainerHeight;
        var offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;

        if ($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
          newCurrentId = id;
          newCurrentTab = $(this);
        }
      });

      if (this.currentId != newCurrentId || this.currentId === null) {
        this.currentId = newCurrentId;
        this.currentTab = newCurrentTab;
        this.setSliderCss();
      }
    }
  }, {
    key: "setSliderCss",
    value: function setSliderCss() {
      var width = 0;
      var left = 0;

      if (this.currentTab) {
        width = this.currentTab.css('width');
        left = this.currentTab.offset().left;
      }

      $('.et-hero-tab-slider').css('width', width);
      $('.et-hero-tab-slider').css('left', left);
    }
  }]);

  return StickyNavigation;
}();

new StickyNavigation();
/*accordion*/

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm5hbWVzIjpbIlN0aWNreU5hdmlnYXRpb24iLCJjdXJyZW50SWQiLCJjdXJyZW50VGFiIiwidGFiQ29udGFpbmVySGVpZ2h0Iiwic2VsZiIsIiQiLCJjbGljayIsIm9uVGFiQ2xpY2siLCJldmVudCIsIndpbmRvdyIsInNjcm9sbCIsIm9uU2Nyb2xsIiwicmVzaXplIiwib25SZXNpemUiLCJlbGVtZW50IiwicHJldmVudERlZmF1bHQiLCJzY3JvbGxUb3AiLCJhdHRyIiwib2Zmc2V0IiwidG9wIiwiYW5pbWF0ZSIsImNoZWNrVGFiQ29udGFpbmVyUG9zaXRpb24iLCJmaW5kQ3VycmVudFRhYlNlbGVjdG9yIiwic2V0U2xpZGVyQ3NzIiwiaGVpZ2h0IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIm5ld0N1cnJlbnRJZCIsIm5ld0N1cnJlbnRUYWIiLCJlYWNoIiwiaWQiLCJvZmZzZXRUb3AiLCJvZmZzZXRCb3R0b20iLCJ3aWR0aCIsImxlZnQiLCJjc3MiLCJhY2MiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpIiwibGVuZ3RoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsYXNzTGlzdCIsInRvZ2dsZSIsInBhbmVsIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwic3R5bGUiLCJtYXhIZWlnaHQiLCJzY3JvbGxIZWlnaHQiXSwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFN0aWNreU5hdmlnYXRpb24ge1xyXG5cdFxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5jdXJyZW50SWQgPSBudWxsO1xyXG5cdFx0dGhpcy5jdXJyZW50VGFiID0gbnVsbDtcclxuXHRcdHRoaXMudGFiQ29udGFpbmVySGVpZ2h0ID0gNzA7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHQkKCcuZXQtaGVyby10YWInKS5jbGljayhmdW5jdGlvbigpIHsgXHJcblx0XHRcdHNlbGYub25UYWJDbGljayhldmVudCwgJCh0aGlzKSk7IFxyXG5cdFx0fSk7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKCgpID0+IHsgdGhpcy5vblNjcm9sbCgpOyB9KTtcclxuXHRcdCQod2luZG93KS5yZXNpemUoKCkgPT4geyB0aGlzLm9uUmVzaXplKCk7IH0pO1xyXG5cdH1cclxuXHRcclxuXHRvblRhYkNsaWNrKGV2ZW50LCBlbGVtZW50KSB7XHJcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0bGV0IHNjcm9sbFRvcCA9ICQoZWxlbWVudC5hdHRyKCdocmVmJykpLm9mZnNldCgpLnRvcCAtIHRoaXMudGFiQ29udGFpbmVySGVpZ2h0ICsgMTtcclxuXHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBzY3JvbGxUb3AgfSwgNjAwKTtcclxuXHR9XHJcblx0XHJcblx0b25TY3JvbGwoKSB7XHJcblx0XHR0aGlzLmNoZWNrVGFiQ29udGFpbmVyUG9zaXRpb24oKTtcclxuICAgIHRoaXMuZmluZEN1cnJlbnRUYWJTZWxlY3RvcigpO1xyXG5cdH1cclxuXHRcclxuXHRvblJlc2l6ZSgpIHtcclxuXHRcdGlmKHRoaXMuY3VycmVudElkKSB7XHJcblx0XHRcdHRoaXMuc2V0U2xpZGVyQ3NzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdGNoZWNrVGFiQ29udGFpbmVyUG9zaXRpb24oKSB7XHJcblx0XHRsZXQgb2Zmc2V0ID0gJCgnLmV0LWhlcm8tdGFicycpLm9mZnNldCgpLnRvcCArICQoJy5ldC1oZXJvLXRhYnMnKS5oZWlnaHQoKSAtIHRoaXMudGFiQ29udGFpbmVySGVpZ2h0O1xyXG5cdFx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gb2Zmc2V0KSB7XHJcblx0XHRcdCQoJy5ldC1oZXJvLXRhYnMtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2V0LWhlcm8tdGFicy1jb250YWluZXItLXRvcCcpO1xyXG5cdFx0fSBcclxuXHRcdGVsc2Uge1xyXG5cdFx0XHQkKCcuZXQtaGVyby10YWJzLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdldC1oZXJvLXRhYnMtY29udGFpbmVyLS10b3AnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0ZmluZEN1cnJlbnRUYWJTZWxlY3RvcihlbGVtZW50KSB7XHJcblx0XHRsZXQgbmV3Q3VycmVudElkO1xyXG5cdFx0bGV0IG5ld0N1cnJlbnRUYWI7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHQkKCcuZXQtaGVyby10YWInKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRsZXQgaWQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0bGV0IG9mZnNldFRvcCA9ICQoaWQpLm9mZnNldCgpLnRvcCAtIHNlbGYudGFiQ29udGFpbmVySGVpZ2h0O1xyXG5cdFx0XHRsZXQgb2Zmc2V0Qm90dG9tID0gJChpZCkub2Zmc2V0KCkudG9wICsgJChpZCkuaGVpZ2h0KCkgLSBzZWxmLnRhYkNvbnRhaW5lckhlaWdodDtcclxuXHRcdFx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gb2Zmc2V0VG9wICYmICQod2luZG93KS5zY3JvbGxUb3AoKSA8IG9mZnNldEJvdHRvbSkge1xyXG5cdFx0XHRcdG5ld0N1cnJlbnRJZCA9IGlkO1xyXG5cdFx0XHRcdG5ld0N1cnJlbnRUYWIgPSAkKHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGlmKHRoaXMuY3VycmVudElkICE9IG5ld0N1cnJlbnRJZCB8fCB0aGlzLmN1cnJlbnRJZCA9PT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRJZCA9IG5ld0N1cnJlbnRJZDtcclxuXHRcdFx0dGhpcy5jdXJyZW50VGFiID0gbmV3Q3VycmVudFRhYjtcclxuXHRcdFx0dGhpcy5zZXRTbGlkZXJDc3MoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0c2V0U2xpZGVyQ3NzKCkge1xyXG5cdFx0bGV0IHdpZHRoID0gMDtcclxuXHRcdGxldCBsZWZ0ID0gMDtcclxuXHRcdGlmKHRoaXMuY3VycmVudFRhYikge1xyXG5cdFx0XHR3aWR0aCA9IHRoaXMuY3VycmVudFRhYi5jc3MoJ3dpZHRoJyk7XHJcblx0XHRcdGxlZnQgPSB0aGlzLmN1cnJlbnRUYWIub2Zmc2V0KCkubGVmdDtcclxuXHRcdH1cclxuXHRcdCQoJy5ldC1oZXJvLXRhYi1zbGlkZXInKS5jc3MoJ3dpZHRoJywgd2lkdGgpO1xyXG5cdFx0JCgnLmV0LWhlcm8tdGFiLXNsaWRlcicpLmNzcygnbGVmdCcsIGxlZnQpO1xyXG5cdH1cclxuXHRcclxufVxyXG5cclxubmV3IFN0aWNreU5hdmlnYXRpb24oKTtcclxuXHJcbi8qYWNjb3JkaW9uKi9cclxudmFyIGFjYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY2NvcmRpb25cIik7XHJcbnZhciBpO1xyXG5cclxuZm9yIChpID0gMDsgaSA8IGFjYy5sZW5ndGg7IGkrKykge1xyXG4gIGFjY1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XHJcbiAgICB2YXIgcGFuZWwgPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpe1xyXG4gICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFNQSxnQjtFQUVMLDRCQUFjO0lBQUE7O0lBQUE7O0lBQ2IsS0FBS0MsU0FBTCxHQUFpQixJQUFqQjtJQUNBLEtBQUtDLFVBQUwsR0FBa0IsSUFBbEI7SUFDQSxLQUFLQyxrQkFBTCxHQUEwQixFQUExQjtJQUNBLElBQUlDLElBQUksR0FBRyxJQUFYO0lBQ0FDLENBQUMs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