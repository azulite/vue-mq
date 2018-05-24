(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.vueMq = factory());
}(this, (function () { 'use strict';

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /** Used for built-in method references. */

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var camel2hyphen = function (str) {
    return str
            .replace(/[A-Z]/g, function (match) {
              return '-' + match.toLowerCase();
            })
            .toLowerCase();
  };

  var camel2hyphen_1 = camel2hyphen;

  var isDimension = function (feature) {
    var re = /[height|width]$/;
    return re.test(feature);
  };

  var obj2mq = function (obj) {
    var mq = '';
    var features = Object.keys(obj);
    features.forEach(function (feature, index) {
      var value = obj[feature];
      feature = camel2hyphen_1(feature);
      // Add px to dimension features
      if (isDimension(feature) && typeof value === 'number') {
        value = value + 'px';
      }
      if (value === true) {
        mq += feature;
      } else if (value === false) {
        mq += 'not ' + feature;
      } else {
        mq += '(' + feature + ': ' + value + ')';
      }
      if (index < features.length-1) {
        mq += ' and ';
      }
    });
    return mq;
  };

  var json2mq = function (query) {
    var mq = '';
    if (typeof query === 'string') {
      return query;
    }
    // Handling array of media queries
    if (query instanceof Array) {
      query.forEach(function (q, index) {
        mq += obj2mq(q);
        if (index < query.length-1) {
          mq += ', ';
        }
      });
      return mq;
    }
    // Handling single media query
    return obj2mq(query);
  };

  var json2mq_1 = json2mq;

  function convertBreakpointsToMediaQueries(breakpoints) {
    var keys = Object.keys(breakpoints);
    var values = keys.map(function (key) {
      return breakpoints[key];
    });
    var breakpointValues = [0].concat(_toConsumableArray(values.slice(0, -1)));
    var mediaQueries = breakpointValues.reduce(function (sum, value, index) {
      var options = Object.assign({
        minWidth: value
      }, index < keys.length - 1 ? {
        maxWidth: breakpointValues[index + 1] - 1
      } : {});
      var mediaQuery = json2mq_1(options);
      return Object.assign(sum, _defineProperty({}, keys[index], mediaQuery));
    }, {});
    return mediaQueries;
  }
  function transformValuesFromBreakpoints(breakpoints, values, currentBreakpoint) {
    var findClosestValue = function findClosestValue(currentBreakpoint) {
      if (values[currentBreakpoint] !== undefined) return values[currentBreakpoint];
      var index = breakpoints.findIndex(function (b) {
        return b === currentBreakpoint;
      });
      var newBreakpoint = index !== -1 || index !== 0 ? breakpoints[index - 1] : null;
      if (!newBreakpoint) return values[index];
      return values[newBreakpoint] !== undefined ? values[newBreakpoint] : findClosestValue(newBreakpoint);
    };

    return findClosestValue(currentBreakpoint);
  }
  function selectBreakpoints(breakpoints, currentBreakpoint) {
    var index = breakpoints.findIndex(function (b) {
      return b === currentBreakpoint;
    });
    return breakpoints.slice(index);
  }

  function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }

  // USAGE
  var component = {
    props: {
      mq: {
        required: true,
        type: [String, Array]
      }
    },
    computed: {
      plusModifier: function plusModifier() {
        return !isArray(this.mq) && this.mq.slice(-1) === '+';
      },
      activeBreakpoints: function activeBreakpoints() {
        var breakpoints = Object.keys(this.$mqAvailableBreakpoints);
        var mq = this.plusModifier ? this.mq.slice(0, -1) : isArray(this.mq) ? this.mq : [this.mq];
        return this.plusModifier ? selectBreakpoints(breakpoints, mq) : mq;
      }
    },
    render: function render(h, props) {
      var shouldRenderChildren = this.activeBreakpoints.includes(this.$mq);
      return shouldRenderChildren ? h('div', this.$slots.default) : h();
    }
  };

  var DEFAULT_BREAKPOINT = {
    sm: 450,
    md: 1250,
    lg: Infinity
  };
  var DEFAULT_SSR_BREAKPOINT = 'sm';

  var install = function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$breakpoints = _ref.breakpoints,
        breakpoints = _ref$breakpoints === void 0 ? DEFAULT_BREAKPOINT : _ref$breakpoints,
        _ref$ssrBreakpoint = _ref.ssrBreakpoint,
        ssrBreakpoint = _ref$ssrBreakpoint === void 0 ? DEFAULT_SSR_BREAKPOINT : _ref$ssrBreakpoint;

    // Init reactive component
    var reactorComponent = new Vue({
      data: function data() {
        return {
          currentBreakpoint: null // lifecycleCheck: 'created',

        };
      }
    });
    var mediaQueries = convertBreakpointsToMediaQueries(breakpoints);
    Object.keys(mediaQueries).map(function (key) {
      var mediaQuery = mediaQueries[key];

      var enter = function enter() {
        reactorComponent.currentBreakpoint = key;
      };

      _subscribeToMediaQuery(mediaQuery, enter);
    });

    function _subscribeToMediaQuery(mediaQuery, enter) {
      if (typeof window !== 'undefined') {
        var mql = window.matchMedia(mediaQuery);

        var cb = function cb(_ref2) {
          var matches = _ref2.matches;
          if (matches) enter();
        };

        mql.addListener(cb); //subscribing

        cb(mql); //initial trigger
      }
    }

    Vue.filter('mq', function (currentBreakpoint, values) {
      return transformValuesFromBreakpoints(Object.keys(breakpoints), values, currentBreakpoint);
    });
    Vue.mixin({
      data: function data() {
        return {
          // lifecycleCheck: 'created',
          mqData: ssrBreakpoint
        };
      },
      computed: {
        $mq: function $mq() {
          console.log('in $mq... ', this._isMounted);

          if (this._isMounted === true) {
            if (reactorComponent.currentBreakpoint) {
              return reactorComponent.currentBreakpoint;
            }
          }

          return ssrBreakpoint;
        }
      } // mounted: _throttle(() => {
      // }, 100),
      // mounted () {
      //   // console.log('in vue mq mounted... ', this.mqData, this.lifecycleCheck)
      //   this.lifecycleCheck = 'mounted'
      // }

    });
    Vue.prototype.$mqAvailableBreakpoints = breakpoints;
    Vue.component('MqLayout', component);
  };

  var index = {
    install: install
  };

  return index;

})));
