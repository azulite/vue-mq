import { convertBreakpointsToMediaQueries, transformValuesFromBreakpoints } from './helpers.js'
import MqLayout from './component.js'

const DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const install = function (Vue, { breakpoints = DEFAULT_BREAKPOINT } = {}) {
  // Init reactive component
  const reactorComponent = new Vue({
    data: () => ({
      currentBreakpoint: null,
    })
  })

  const mediaQueries = convertBreakpointsToMediaQueries(breakpoints)
  Object.keys(mediaQueries).map((key) => {
    const mediaQuery = mediaQueries[key]
    const enter = () => { reactorComponent.currentBreakpoint = key }
    _subscribeToMediaQuery(mediaQuery, enter)
  })

  function _subscribeToMediaQuery(mediaQuery, enter) {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(mediaQuery)
      const cb = ({ matches }) => {
        if (matches) enter()
      }
      mql.addListener(cb) //subscribing
      cb(mql) //initial trigger
    }
  }

  Vue.filter('mq', (currentBreakpoint, values) => {
    return transformValuesFromBreakpoints(Object.keys(breakpoints), values, currentBreakpoint)
  })
  Vue.mixin({
    data: () => {
      const mqDefault = 'mobile'
      // let mqdata = mqDefault
      // if (reactorComponent.currentBreakpoint) {
      //   mqdata = reactorComponent.currentBreakpoint
      // }
      return {
        mqDefault: mqDefault,
        mqData: this.$mq
      }
    },
    computed: {
      $mq() {
        if (reactorComponent.currentBreakpoint) {
          return reactorComponent.currentBreakpoint
        }
        // return this.mqDefault // this will be undefined during created lifecycle
        return 'mobile'
      },
    }
  })
  Vue.prototype.$mqAvailableBreakpoints = breakpoints
  Vue.component('MqLayout', MqLayout)
}

export default { install }
