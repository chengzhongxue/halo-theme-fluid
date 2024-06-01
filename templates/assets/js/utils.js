/* global Fluid, CONFIG */

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

Fluid.utils = {

  listenScroll: function(callback) {
    var dbc = new Debouncer(callback);
    window.addEventListener('scroll', dbc, false);
    dbc.handleEvent();
    return dbc;
  },

  listenDOMLoaded(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        callback();
      });
    }
  },

  scrollToElement: function(target, offset) {
    var of = jQuery(target).offset();
    if (of) {
      jQuery('html,body').animate({
        scrollTop: of.top + (offset || 0),
        easing   : 'swing'
      });
    }
  },

  waitElementLoaded: function(selector, callback) {
    var runningOnBrowser = typeof window !== 'undefined';
    var isBot = (runningOnBrowser && !('onscroll' in window))
      || (typeof navigator !== 'undefined' && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
    if (!runningOnBrowser || isBot) {
      return;
    }

    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function(records, ob) {
        var ele = document.querySelector(selector);
        if (ele) {
          callback(ele);
          ob.disconnect();
        }
      });
      mo.observe(document, { childList: true, subtree: true });
    } else {
      Fluid.utils.listenDOMLoaded(function() {
        var waitLoop = function() {
          var ele = document.querySelector(selector);
          if (ele) {
            callback(ele);
          } else {
            setTimeout(waitLoop, 100);
          }
        };
        waitLoop();
      });
    }
  },

  createScript: function(url, onload) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('charset', 'UTF-8');
    s.async = false;
    if (typeof onload === 'function') {
      if (window.attachEvent) {
        s.onreadystatechange = function() {
          var e = s.readyState;
          if (e === 'loaded' || e === 'complete') {
            s.onreadystatechange = null;
            onload();
          }
        };
      } else {
        s.onload = onload;
      }
    }
    var ss = document.getElementsByTagName('script');
    var e = ss.length > 0 ? ss[ss.length - 1] : document.head || document.documentElement;
    e.parentNode.insertBefore(s, e.nextSibling);
  },

  getBackgroundLightness(selectorOrElement) {
    var ele = selectorOrElement;
    if (typeof selectorOrElement === 'string') {
      ele = document.querySelector(selectorOrElement);
    }
    var view = ele.ownerDocument.defaultView;
    if (!view) {
      view = window;
    }
    var rgbArr = view.getComputedStyle(ele).backgroundColor.replace(/rgba*\(/, '').replace(')', '').split(/,\s*/);
    if (rgbArr.length < 3) {
      return 0;
    }
    var colorCast = (0.213 * rgbArr[0]) + (0.715 * rgbArr[1]) + (0.072 * rgbArr[2]);
    return colorCast === 0 || colorCast > 255 / 2 ? 1 : -1;
  },
};

/**
 * Handles debouncing of events via requestAnimationFrame
 * @see http://www.html5rocks.com/en/tutorials/speed/animations/
 * @param {Function} callback The callback to handle whichever event
 */
function Debouncer(callback) {
  this.callback = callback;
  this.ticking = false;
}

Debouncer.prototype = {
  constructor: Debouncer,

  /**
   * dispatches the event to the supplied callback
   * @private
   */
  update: function() {
    this.callback && this.callback();
    this.ticking = false;
  },

  /**
   * ensures events don't get stacked
   * @private
   */
  requestTick: function() {
    if (!this.ticking) {
      requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)));
      this.ticking = true;
    }
  },

  /**
   * Attach this as the event listeners
   */
  handleEvent: function() {
    this.requestTick();
  }
};
