import { convertBreakpointsToMediaQueries, transformValuesFromBreakpoints } from './helpers.js'
import MqLayout from './component.js'

const DEFAULT_BREAKPOINT = {
  sm: 450,
  md: 1250,
  lg: Infinity,
}

const DEFAULT_SSR_BREAKPOINT = 'sm'

const install = function (Vue,
  {
    breakpoints = DEFAULT_BREAKPOINT,
    ssrBreakpoint = DEFAULT_SSR_BREAKPOINT,
  } = {}
) {
  // Init reactive component
  const reactorComponent = new Vue({
    data: () => ({
      currentBreakpoint: null,
      // lifecycleCheck: 'created',
    }),
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
      return {
        lifecycleCheck: 'created',
        mqData: ssrBreakpoint
      }
    },
    computed: {
      $mq() {
        // console.log('in $mq... ', this._lifecycleCheck)
        if (this.lifecycleCheck === 'mounted') {
          if (reactorComponent.currentBreakpoint) {
            return reactorComponent.currentBreakpoint
          }
        }
        return ssrBreakpoint
      },
    },
    mounted () {
      console.log('in vue mq mounted... ', this.mqData, this.lifecycleCheck)
      this.lifecycleCheck = 'mounted'
    },
  })
  Vue.prototype.$mqAvailableBreakpoints = breakpoints
  Vue.component('MqLayout', MqLayout)
}

export default { install }

