/**
 * @Description:
 * @author Roc Deng
 * @date 2020/5/7 0007
*/

// 此顺序不允许随意改动, 如需改动请联系相应开发人员进行确认
export const THEME_NAME_MAP = {
  // 经典白
  THEME_LIGHT: 'sdp-classic-white',

  // 暗黑蓝
  THEME_DARK: 'sdp-dark-blue',

  // 深邃蓝
  THEME_BLUE: 'sdp-deep-blue',
}

export default {
  // 自定义属性键名
  DATA_THEME: 'data-theme',

  // 默认主题
  THEME_DEFAULT: THEME_NAME_MAP.THEME_LIGHT,

  ...THEME_NAME_MAP
}
