'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var json2mq = _interopDefault(require('json2mq'));
var _throttle = _interopDefault(require('lodash/throttle'));

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
    var mediaQuery = json2mq(options);
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
        lifecycleCheck: 'created',
        mqData: ssrBreakpoint
      };
    },
    computed: {
      $mq: function $mq() {
        // console.log('in $mq... ', this._lifecycleCheck)
        if (this.lifecycleCheck === 'mounted') {
          if (reactorComponent.currentBreakpoint) {
            return reactorComponent.currentBreakpoint;
          }
        }

        return ssrBreakpoint;
      }
    },
    mounted: function mounted() {
      _throttle(console.log('in vue mq mounted... ', this.mqData, this.lifecycleCheck), 100);

      _throttle(this.lifecycleCheck = 'mounted', 100);
    }
  });
  Vue.prototype.$mqAvailableBreakpoints = breakpoints;
  Vue.component('MqLayout', component);
};

var index = {
  install: install
};

module.exports = index;
