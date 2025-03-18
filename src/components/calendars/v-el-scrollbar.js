import {nextTick} from 'vue'
import { THEME_CONFIG } from './constants'
function getFinalStyle(obj, styleName) {
  let y = 0
  if (obj.currentStyle) {
    y = obj.currentStyle[styleName]
  } else if (document.defaultView) {
    y = document.defaultView.getComputedStyle(obj, null).getPropertyValue(styleName)
  }
  return parseInt(y)
}
/**
 * el-scrollbar 使用 v-sdp-el-scrollbar="{style，themeType}"
 * style当前overflow使用值
 * themeType主题
**/
const SdpElScrollbar = {
  unbind(el, binding, vnode) {
    if (!el.classList.contains('el-scrollbar')) return void '该指令仅针对 el-scrollbar 组件'
    window.removeEventListener('resize', vnode.componentInstance.update)
  },

  bind(el, binding, vnode) {
    if (!el.classList.contains('el-scrollbar')) return void '该指令仅针对 el-scrollbar 组件'
    window.addEventListener('resize', vnode.componentInstance.update)

    nextTick(() => {
      const { style = 'hidden' } = binding.value || {}
      el.style.overflow = style
      // 先从行类样式中取在到class中取
      const bottom = getFinalStyle(el, 'padding-bottom')
      const wrap = el.querySelector('.el-scrollbar__wrap')
      const num = parseInt(wrap.style.marginBottom) - bottom
      wrap.style.height = `calc(100% - ${num}px)`
      wrap.style.overflow = 'scroll'
      // 修改滚动条样式
      const themeType = document.body.getAttribute(THEME_CONFIG.DATA_THEME)
      if (themeType === THEME_CONFIG.THEME_DARK) {
        const scrollBar = el.querySelectorAll('.el-scrollbar__thumb') || []
        for (let div of scrollBar) {
          div && (div.style.background = 'rgba(111,128,148,0.5)')
        }
      }
    })
  }
}

export default SdpElScrollbar
