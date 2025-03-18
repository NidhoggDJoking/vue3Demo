// @ts-nocheck

/**
 * 全局注册方法: 在main.js中添加到Vue原型
 * 在组件内通过(vue实例.$_ + 方法名)访问  如使用JSONClone: this.$_JSONClone
 */

import { CREATE_TOAST_TIME } from './constants.js'

// const Sentry = process.env.NODE_ENV === 'production' ? require('@sentry/browser') : null

// import { Message } from 'element-ui'

/**
 * JSON序列化拷贝方法 用于克隆(纯数据的)对象或者数组
 * 需要注意JSON序列化克隆会出现以下状况
 * 1 丢失原型链
 * 2 如Infinity,NaN一样的关键字会转换为null
 * 3 值为undefined的属性会丢失
 * 4 对象方法会丢失
 * 5 往数组中添加的属性方法都会丢失
 * @export
 * @param {Object, Array} object
 * @returns
 */
export const JSONClone = object => {
  return typeof object === 'object' && JSON && object !== null
    ? JSON.parse(JSON.stringify(object)) : object
}

/**
 * 浅拷贝
 * 就是字面上的意思
 * @export
 * @param {Object, Array} object
 * @returns
 */
export const clone = object => {
  if (typeof object !== 'object' || object === null) {
    return object
  } else {
    return Array.isArray(object) ? [...object] : Object.assign({}, object)
  }
}

/**
 * 深拷贝
 * 就是字面上的意思
 * @export
 * @param {Object, Array} object
 * @returns
 */
export const deepClone = (source, parent: any = undefined) => {
  let _parent = parent
  if (!source || typeof source !== 'object' || source._isVue) {
    return source
  }

  // 该字段有父级则需要追溯该字段的父级
  while (_parent) {
    // 如果该字段引用了它的父级则为循环引用
    if (_parent.originalParent === source) {
      // 循环引用直接返回同级的新对象
      return _parent.currentParent
    }
    _parent = _parent.parent
  }

  const duplicate = Array.isArray(source) ? [] : {}
  for (const i in source) {
    if (source.hasOwnProperty(i)) {
      if (typeof source[i] === 'object') {
        // 递归执行深拷贝 将同级的待拷贝对象与新对象传递给 parent 方便追溯循环引用
        duplicate[i] = deepClone(source[i], {
          originalParent: source,
          currentParent: duplicate,
          parent: parent,
        })
      } else {
        duplicate[i] = source[i]
      }
    }
  }
  return duplicate
}
/**
 * 深拷贝，但是忽略一些属性
 * @param {*} obj 目标对象
 * @param {*} copyObj 拷贝对象
 * @param {*} key 忽略key
 */
export const filterDeepClone = (obj, copyObj, key = []) => {
  for (const i in copyObj) {
    if (!key.includes(i)) {
      obj[i] = deepClone(copyObj[i])
    }
  }
}
/**
 * @description  防抖: 不管调用多少次,只能在最后触发后经过设定的时间才能再次触发
 * @export
 * @param {Function} func 需要防抖的方法
 * @param {Number} wait 设定时间
 * @returns {Fucntion} 包装的方法
 */
export const debounce = (func, wait = 50) => {
  let timer = 0
  // timer = timer || 0
  return function () {
    const args = Array.from(arguments)
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
let timer
export const _debounce = (func, wait = 50) => {
  timer = timer || 0
  return function () {
    const args = Array.from(arguments)
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
/**
 * @description  下划线转驼峰命名字符串
 * @export
 * @param {String} str 需要节流的方法
 * @returns {String} 返回的驼峰命名字符串
 */
export const toCamel = function (str) {
  return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
    return $1 + $2.toUpperCase()
  })
}
/**
 * @description  节流: 无论调用多少次,最快只能是设定的时间触发一次
 * @export
 * @param {Function} func 需要节流的方法
 * @param {Number} wait 设定时间
 * @returns {Function} 包装的方法
 */
export const throttle = (func, wait = 50) => {
  let last = 0
  return function () {
    const now = +new Date()
    if (now - last > wait) {
      last = now
      return func.apply(this, Array.from(arguments))
    } else {
      return false
    }
  }
}

/**
 * @description  去重:去掉数组中重复的项,可用于对象内部
 * @export
 * @param {array} list 需要去重的数组
 * @param {string} [query] 可选,如果数组内是数组或对象,传入需要去重的key或index的计算式,例如 a 或者 a.b
 * @param {string} [spearator] 可选,自定义计算key的分隔符,默认为.
 * @returns {array} 经过去重的数组
 */
export const removeRepetition = (list, query, separator = '.') => {
  // 判断是否是对象的去重
  if (query) {
    // 将计算式拆分
    const keyArr = query.split(separator)
    // 如果是嵌套两层或更多,采用计算
    if (keyArr.length > 1) {
      return list.reduce((prev, current) => {
        return prev.some(e => getValueByKeyArray(e, keyArr) === getValueByKeyArray(current, keyArr)) ? prev : [...prev, current]
      }, [])
    } else {
      return list.reduce((prev, current) => {
        return prev.some(e => e[query] === current[query]) ? prev : [...prev, current]
      }, [])
    }
  } else {
    return [...new Set(list)]
  }
}

/**
 * @description  设置对象内的值:在设置多层对象时用
 * @export
 * @param {{}} obj 需要设置值的对象
 * @param {string} query 可选,如果多层嵌套,传入需要去重的key或index的计算式,例如 a 或者 a.b
 * @param {any} val 值
 * @param {string} spearator 可选,自定义计算key的分隔符,默认为.
 */
export const setValByQuery = (obj, query, val, separator = '.') => {
  const keys = query.split(separator)
  keys.reduce((prev, next, index) => {
    if (index === keys.length - 1) {
      prev[next] = val
    } else {
      if (prev[next] && typeof prev[next] === 'object') {
        return prev[next]
      } else {
        throw new Error('对象查询失败, AT: ', next)
      }
    }
  }, obj)
}

/**
 * @description  判断元素是否存在传入的类名
 * @export
 * @param {Element} el 判断的元素
 * @param {string} cls 判断的类名
 * @returns {boolean}
 */
export const hasClass = (el, cls) => {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}
export function replaceColumnValuesLan(val, languageCode = null) {
  const lang = languageCode || '1'
  let codeArr = val.code.split('$mls$')
  if (codeArr?.length === 1) return codeArr[0]
  const langCode = parseInt(lang)
  if (codeArr?.length >= langCode) {
    return codeArr[langCode - 1] ? codeArr[langCode - 1] : val.defaultValue
  }
  return val.defaultValue
}
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  if (!date) return
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

export const compareCalendarDate = (dateA, dateB) => {
  const a = new Date(dateA.replace(/\.|-/g, '/'))
  const b = new Date(dateB.replace(/\.|-/g, '/'))

  let yearA = a.getFullYear()
  let monthA = a.getMonth()

  let yearB = b.getFullYear()
  let monthB = b.getMonth()

  let isEqual = yearA === yearB && monthA === monthB
  let isBigger = yearA > yearB || (yearA === yearB && monthA > monthB)

  return isBigger ? 1 : isEqual ? 0 : -1
}

// 获取当前格式化的时间,比如yyyy-MM-dd，yyyy-MM-dd hh:mm:ss
export function getNowTime(format = 'yyyy-MM-dd') {
  let nowTime
  const date = new Date()
  function getZeroDate(date) {
    return date >= 10 ? date : `0${date}`
  }
  const dateObj = {
    'yyyy': date.getFullYear(),
    'MM': getZeroDate(date.getMonth() + 1),
    'dd': getZeroDate(date.getDate()),
    'hh': getZeroDate(date.getHours()),
    'mm': getZeroDate(date.getMinutes()),
    'ss': getZeroDate(date.getSeconds()),
  }
  // let formatArr = []
  const arr = format.split(' ')
  // arr.forEach((item, index) => {
  //   const str = index ? '-' : ':'
  //   formatArr.push(...item.split(str))
  // })
  nowTime = arr[0].split('-').map(e => dateObj[e]).join('-')
  if (arr.length === 2) {
    nowTime += ` ${arr[1].split(':').map(e => dateObj[e.toLowerCase()]).join(':')}`
  }
  return nowTime
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

/**
 * @description  扁平化数组
 * @param arr {array} 需要扁平化的数组
 * @param deep {number}  展开数组的层次
 * @returns {array} 经过扁平化的数组
 */
export function flatten(arr, deep = Infinity) {
  return deep && Array.isArray(arr) ? [].concat(...arr.map(e => flatten(e, deep - 1))) : arr
}

/**
 * @description  检查全是String的数组里是否有重复项
 * @param {array} 需要检查的数组
 * @returns {boolean}
 */
export function hasStringArrayRepeat(arr) {
  return arr.length !== [...new Set(arr)].length
}

// eslint-disable-next-line no-return-assign
export const nanoid = (t = 21) => crypto.getRandomValues(new Uint8Array(t)).reduce((t, e) => t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? '-' : '_', '')

export function generateUUID(salt = 0) {
  // let d = new Date().getTime() + salt
  // const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //   const r = (d + Math.random() * 16) % 16 | 0
  //   d = Math.floor(d / 16)
  //   return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  // })
  // return uuid

  return nanoid()
}

// 图形字段的keyName生成，不管传什么参数，都是为了让keyName一定不会重复
export function generateKeyName(str, salt = 0, uuid = '') {
  if (uuid) return `K-${str}-${salt}-${uuid}`
  return `K-${str}-${generateUUID(salt)}`
}

/**
 * @description 获取某个月的天数
 * @param date {string} '2019/10' 需要获取天数的月份
 */
export function getLastDayOfTheMonth(date) {
  const [year, month] = date.replace(/\.|-/g, '/').split('/')
  return new Date(year, month, 0).getDate()
}

/**
 * @description 把第二个 对象/数组 合并到第一个 对象/数组
 * @param objectAssignTo
 * @param objectMergeIn
 * @param deep
 * @param excludeArray
 * @returns {undefined}
 */
const mergeFn = (objectAssignTo, objectMergeIn, deep = Infinity, excludeArray) => {
  const currentEntries = Array.isArray(objectMergeIn)
    ? objectMergeIn.entries()
    : Object.entries(objectMergeIn)

  for (const [key, value] of currentEntries) {
    if (excludeArray && Array.isArray(value)) {
      objectAssignTo[key] = value
    } else if (deep && typeof value === 'object' && value !== null) {
      // 防止objectAssignTo[key] 为null 时出现报错，从而阻塞流程
      if (objectAssignTo[key] === null) {
        objectAssignTo[key] = {}
      }
      if (typeof objectAssignTo[key] !== 'object' && value !== undefined) {
        objectAssignTo[key] = Array.isArray(value) ? [] : {}
      }
      mergeFn(objectAssignTo[key], value, deep - 1, excludeArray)
    } else {
      objectAssignTo[key] = value
    }
  }
}

/**
 * @description 深度合并多个 对象/数组,提供层级选择
 * @param {<object|array>+, number?, boolean?}
 * 前面的参数为合并的对象/数组  最后为配置项,配置项选填,如果数字表示合并深度,布尔值表示是否忽略数组
 * 配置项参数无所谓顺序,只要是在参数的末尾
 * @returns {<object|array>} 返回深度合并后的对象
 * @example
 * 1. deepMergeObjects(object1, object2) 表示合并object1, object2,深度为Infinity
 * 2. deepMergeObjects(object1, object2, 2) 表示合并object1, object2,深度为两层
 * 3. deepMergeObjects(object1, object2, 2, true) 表示合并object1, object2,深度为两层,遇到数组直接赋值,不对数组进行合并
 * 4. deepMergeObjects(object1, object2, 2) deepMergeObjects(object1, object2, true, 2)这样都是可以的写法
 */
export function deepMergeObjects(...mergeObjects) {
  let deep = Infinity
  let excludeArray = false
  let error = null

  const currentMergeObjects = mergeObjects.reduceRight((pre, current) => {
    if (typeof current === 'boolean' || typeof current === 'number') {
      if (typeof current === 'boolean') {
        excludeArray = current
      } else {
        deep = current
      }
      pre.splice(pre.length - 1, 1)
    } else if (typeof current !== 'object' || current === null) {
      error = new Error('illegal params')
    }
    return pre
  }, mergeObjects)

  if (error) throw error

  return currentMergeObjects.reduce((pre, current) => {
    mergeFn(pre, current, deep, excludeArray)
    return pre
  }, Array.isArray(currentMergeObjects[0]) ? [] : {})
}

/**
 获取元素宽高
 */
export function getRect(el) {
  if (!el) return {}
  const rect = el.getBoundingClientRect()
  if (rect) {
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight,
    }
  }
}
/**
 * 获取元素的width、height、top、left、size_min、size_max
 * el: 元素
 */
export function getElementSize(el) {
  const size = getRect(el)
  const { height = 0, width = 0 } = size

  return {
    ...size,
    size_min: Math.min(height, width),
    size_max: Math.max(height, width),
  }
}
/**
 * 更新对象里数据的大小， 用于缩放
 * obj: 更新对象
 * scale: 缩放比例
 */
export function updateSizeByScale(obj, scale) {
  if (scale == null || scale === 1) return
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'number') {
      obj[key] = Number((obj[key] / scale).toFixed(4))
    }
  })
}


// 获取字符串长度
export function getStringLength(str, len = 0) {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len++
    }
  }
  return len
}
// 根据字符串长度返回该长度所对应的字符位置
export function getStringNum(str, len = 0, num = 0) {
  // str 字符串
  // len 默认长度 0
  // num 字符长度
  let index
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len++
    }
    if (num <= len && !index) {
      index = i
    }
  }
  console.log(index)
  return index
}
/**
 * 为元素绑定事件，
 * @param evType
 * @param elId
 * @param callback
 */
export function addEventToComponentEl(evType, elId, callback) {
  const tablePreview = document.getElementById('data-screen-table')
  tablePreview.addEventListener('click', this.clickHandler, false)
}
/**
 * 判断中英文字符长度，
 * @param str
  * @returns  number
 */
export function getStrLength(str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const tempStr = str.charCodeAt(i)
    if ((tempStr >= 0x0001 && tempStr <= 0x007e) || (tempStr >= 0xff60 && tempStr <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}

// 坪效找数据集
export function recursionFindDataSet(originalTable) {
  const result = []
  if (Array.isArray(originalTable)) {
    originalTable.forEach(item => {
      if (Array.isArray(item)) {
        item.forEach(obj => {
          if (obj.content.lge) {
            result.push(obj.content.lge.areaDataSetId, obj.content.lge.moneyDataSetId)
          }
        })
      }
    })
  }
  return [...new Set(result)]
}

export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true
  if (!(a instanceof Array)) return false
  if (!(b instanceof Array)) return false
  if (a.length !== b.length) return false
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 * 设置对象属性，不对路径进行校验
 * @param obj (Object)
 * @param path (Array)
 * @param val (Any)
 */
export function setProp(obj, path, val) {
  if (!checkedType(obj, 'Object')) {
    console.warn('setProp 方法 调用参数不正确')
  }

  return Object.assign(obj, path)
}

export function replaceProp(obj, path, val) {
  const oldVal = getProp(obj, path)
  if (!oldVal) {
    console.warn('replaceProp方法替换路径不正确')
    return obj
  } else {
    setProp(obj, path, val)
  }
}

/**  2.0 新增方法 */

/**
 * 获取对象属性
 * @param obj (Object) 目标对象
 * @param path {String | Array} 属性路径
 * @param defaultResult 默认返回结果
 * @returns {*} 对象属性不存在时， 返回undefined
 */
export function getProp(obj, path, defaultResult: any = '') {
  if (!obj) {
    return defaultResult
  }
  const pathArr = Array.isArray(path) ? path : (path + '').split('.')
  const getValueResult = getValueByKeyArray(obj, pathArr)
  if ([0].includes(getValueResult)) return getValueResult
  return getValueResult || defaultResult
}

// 通过一个key的数组来获取对象里的值
function getValueByKeyArray(obj, arr) {
  return arr.reduce((prev, next) => {
    return [undefined, null].includes(prev) ? prev : prev[next]
  }, obj)
}

export function checkedType(target, type) {
  const targetStr = Object.prototype.toString.call(target)
  return type ? targetStr === `[object ${type}]` : targetStr
}

export function emitEvent() {
  this.$emit()
}

export const isObject = (data) => {
  return Object.prototype.toString.call(data) === '[object Object]'
}

/**
 * 生成随机4位字母3位数组字符串
 */
export function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ'
  const string_length = 7
  let randomstring = ''
  let charCount = 0
  let numCount = 0
  let rnum
  for (let i = 0; i < string_length; i++) {
    if (charCount >= 4) {
      rnum = Math.floor(Math.random() * 10)
      randomstring += rnum
      numCount += 1
    } else {
      rnum = Math.floor(Math.random() * chars.length)
      randomstring += chars.substring(rnum, rnum + 1)
      charCount += 1
    }
  }
  return randomstring
}

/**
 * @param mainEl (Object) 目标元素
 * @param insertEl (Object) 插入元素
 * @param mainChild (String) 插入目标位置元素
*/
export function insertElement(mainEl, insertEl, mainChild = null) {
  if (isElement(mainEl) && isElement(insertEl) && (isElement(mainChild) || mainChild === null)) {
    insertEl.style.position = 'absolute'
    insertEl.style.overflow = 'hidden'
    mainEl.insertBefore(insertEl, mainChild)
  }
}

export function isElement(obj) {
  return (typeof HTMLElement === 'object')
    ? (obj instanceof HTMLElement)
    : !!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string')
}

/**
 * @description 计算字符串的宽度和高度
 * @param {String} text  要计算的字符串
 * @param {Object} style  要计算的字符串的样式
 * @returns {Object} 返回一个对象，包含字符串的宽高属性
 */
export function getStrSize(text, style = { fontSize: '14px' }) {
  const _span = document.createElement('span')
  const result = {
    width: _span.offsetWidth,
    height: _span.offsetHeight,
  }
  Object.assign(_span.style, {
    visibility: 'hidden',
  }, style)
  document.body.appendChild(_span)
  _span.innerText = text ? text.toString().replace(/\s/g, 'a') : ''
  Object.assign(result, {
    width: _span.offsetWidth - result.width,
    height: _span.offsetHeight - result.height,
  })
  _span.parentNode.removeChild(_span)
  return result
}

/**
 * @description 处理HTML的转码
 * @param {String} text 要转码的字符串
*/
export function htmlEncode(text) {
  var dom = document.createElement('div')
  if (dom.textContent) {
    dom.textContent = text
  } else {
    dom.innerText = text
  }
  return dom.innerHTML
}

/**
 * @description 高分辨率下放大px，获取放大后的值
 * @param {number|string} basePx 原始px
 * @param {number} baseScreen 基准尺寸默认1920
 * @returns {number|string} 放大后的结果
 */
export function getPxOfHighResolution(basePx, baseScreen = 1920) {
  if (!window.screen || window.screen.width < 1920) return basePx
  const isIncudesPx = /px/.test(`${basePx}`)
  const result = Math.ceil(parseInt(basePx) * window.screen.width / baseScreen)
  return isIncudesPx ? result + 'px' : result

}

/**
 * @description 将下划线转成驼峰式
 * @param str (String) 要转换的字符串
*/
export function toHump(str) {
  return str.replace(/-(\w)/g, (all, letter) => {
    return letter.toUpperCase()
  })
}

/**
 * @description 将驼峰式转成下划线
 * @param str (String) 要转换的字符串
*/
export function humpToUnderline(str) {
  let temp = str.replace(/[A-Z]/g, (match) => {
    return '-' + match.toLowerCase()
  })
  // 如果首字母是大写，执行replace时会多一个-，这里需要去掉
  if (temp.slice(0, 1) === '-') {
    temp = temp.slice(1)
  }
  return temp
}


// 向上保留一位小数
function decimalFormat(num, points, alwaysShorthand) {
  if (alwaysShorthand) {
    // 使用toFixed自动补全小数位数
    const decimalNum = points === 0 ? 0 : Math.log10(points)
    return points === 0 ? num.toFixed(0) : (Math.round(num * points) / points).toFixed(decimalNum)
  }
  return num > 0 ? Math.ceil(num * points) / points : Math.floor(num * points) / points
}
// 正数向上取整 负数向下取整
function integerFormat(num) {
  return num > 0 ? Math.ceil(num) : Math.floor(num)
}
export function numToThouands(value) {
  const _numStr = String(value)
  const isFloat = _numStr.includes('.')
  let newNumStr = isFloat ? _numStr.split('.')[0] : _numStr
  newNumStr = newNumStr.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
  return isFloat ? `${newNumStr}.${_numStr.split('.')[1]}` : newNumStr
}

// 千分格式转换成数字格式
export function thouandsToNumber(value) {
  const _numStr = String(value)
  const isNegative = _numStr.includes('-')
  let newNumStr = _numStr.replace(/[^0-9.]/g, '')
  return (isNegative ? -1 : 1) * (newNumStr || 0)
}
export function accSub(arg1, arg2) {
  if (isNaN(arg1)) {
    arg1 = 0
  }
  if (isNaN(arg2)) {
    arg2 = 0
  }
  arg1 = Number(arg1)
  arg2 = Number(arg2)

  let r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m - arg2 * m) / m
}
/**
 * @description 数字转化格式
 * @param {String} formatType 要转化的格式，单位简写：unitShorthand，百分比：percentage，千分位：thousands
 * @param {Number} points 转化之后保留的小数位
 * @param {Boolean} alwaysShorthand 是否始终需要带小数点位数的单位简写
 * @return {Function}
 */
export function getFormatterFunc(formatType, points = 10, alwaysShorthand = false) {
  // 单位简写、货币单位简写
  if (['unitShorthand', 'currencyUnit'].includes(formatType)) {
    const intervalList = {
      unitShorthand: [1000, 1000000],
      currencyUnit: [10000, 100000000],
    }
    const unitList = {
      unitShorthand: ['K', 'M'],
      currencyUnit: ['万', '亿'],
    }
    const interval = intervalList[formatType]
    const [firstInterval, secondInterval] = interval
    const unit = unitList[formatType]

    return (value) => {
      if (isNaN(value)) {
        return value
      } else {
        const absVal = Math.abs(value)
        if (absVal >= firstInterval && absVal < secondInterval) {
          // 绝对值在1000 ~ 10000: 保留一位小数; 绝对值在10000以上: 正数向上取整 负数向下取整
          let val = Number(value) / firstInterval
          let result = (absVal > firstInterval * 10 && !alwaysShorthand) ? integerFormat(val) : decimalFormat(val, points, alwaysShorthand)
          // return result.toString().replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,') + 'K'
          return numToThouands(result) + unit[0]
        } else if (absVal >= secondInterval) {
          let val = Number(value) / secondInterval
          // 绝对值在1000000 ~ 10000000: 保留一位小数; 绝对值在10000000以上: 正数向上取整 负数向下取整
          let result = (absVal > secondInterval * 10 && !alwaysShorthand) ? integerFormat(val) : decimalFormat(val, points, alwaysShorthand)
          // return result.toString().replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,') + 'M'
          return numToThouands(result) + unit[1]
        }
      }
      let formatVal = alwaysShorthand ? decimalFormat(value, points, alwaysShorthand) : value
      return value >= 1000 ? numToThouands(formatVal) : formatVal
    }
  }
  // 百分比
  if (formatType === 'percentage') {
    return (value) => {
      if (!isNaN(value)) {
        let decimal = value.toString().split('.')[1]
        let pointNum = 0
        if (decimal && decimal.length > 2) {
          pointNum = decimal.length - 2
        }
        pointNum = alwaysShorthand ? points === 0 ? 0 : Math.log10(points) : pointNum
        // 保留自身的小数位
        let num = Number((value * 100).toFixed(pointNum))
        // 当标签绝对值 >= 10% 时取整
        if (!alwaysShorthand && Math.abs(num) >= 10) {
          num = num > 0 ? Math.ceil(num) : Math.floor(num)
        } else if (alwaysShorthand) {
          num = decimalFormat(num, points, alwaysShorthand)
        }
        // const label = num.toString().replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
        const label = numToThouands(num)
        return label + '%'
      }
      return value
    }
  }
  // 千分位
  if (formatType === 'thousands') {
    return (value) => {
      if (typeof value !== 'number' || isNaN(value)) {
        throw new Error('param is not a number')
      }
      return numToThouands(value)
    }
  }
  // 数字
  if (formatType === 'number') {
    return (value) => {
      return typeof value !== 'number' || isNaN(value) ? '' : numToThouands(decimalFormat(value, points, alwaysShorthand))
    }
  }
  if (['', undefined, 'normal'].includes(formatType) && alwaysShorthand) {
    return (value) => {
      return typeof value !== 'number' || isNaN(value) ? '' : numToThouands(decimalFormat(value, points, alwaysShorthand))
    }
  }
  return null
}

/**
 * 判断数据内容是否相同，只比较一层
 * @param arr1
 * @param arr2
 * @param sort
 * @return boolean
 */
export function sameArray(arr1 = [], arr2 = [], sort = true) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2) || (arr1.length !== arr2.length)) {
    return false
  }
  const tempArr1 = [...arr1].sort().toString()
  const tempArr2 = [...arr2].sort().toString()
  // for (let i = 0, len = tempArr2.length; i < len; i++) {
  //   if (tempArr1[i] !== tempArr2[i]) {
  //     return false
  //   }
  // }
  return tempArr1 === tempArr2
}
function createToastWithUnsetMaxHeight(params) {
  if (typeof this.$createToast === 'function') {
    const config = Object.assign({ time: CREATE_TOAST_TIME, }, params)
    const toast = this.$createToast(config)
    try {
      toast.$el.getElementsByClassName('cube-toast-tip')[0].style.maxHeight = 'unset'
    } catch (e) {
      console.log(e)
    }
    return toast
  }
}



function isNull(value) {
  return value === null
}

function isEmptyString(value) {
  return value === ''
}

export function isEmptyArray(arr) {
  return Array.isArray(arr) && arr.length === 0
}

function isUndefined(value) {
  return value === undefined
}

export function isNullOrUndefinedOrEmptyString(value) {
  return isNull(value) ||
    isEmptyString(value) ||
    isUndefined(value)
}

export function isTransparent(color: string) {
  if (typeof color !== 'string') return false

  if (color === 'transparent') return true

  if (color.includes('rgba') && /[0][^\S]*\)/.test(color)) return true

  return false
}

export function hexToRgba(hex, opacity = 1) {
  // 利用正则表达式提取颜色值中的RGB部分
  const rgbMatch = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  // 将提取的RGB值转换为十进制
  const r = parseInt(rgbMatch[1], 16)
  const g = parseInt(rgbMatch[2], 16)
  const b = parseInt(rgbMatch[3], 16)
  // 返回RGBA形式的颜色值
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const getRequest = () => {
  const hash = window.location.hash
  let url = decodeURI(window.location.href)
  if (hash) {
    const isContainHash = url.substr(hash.length * -1) === hash
    isContainHash && (url = url.substring(0, url.length - hash.length))
  }
  let theRequest = {}
  if (url.indexOf('?') !== -1) {
    let str = url.replace(/^.*\?/, '')
    let strClone = str.split('&')
    for (let i = 0; i < strClone.length; i++) {
      const searchKey = strClone[i].split('=')[0]
      theRequest[searchKey] = unescape(strClone[i].replace(`${searchKey}=`, ''))
    }
  }
  return theRequest
}

export function transformPathArr(path = '') {
  return path.split(/\.|\[|\]/).filter(Boolean)
}

export const getProperty = (obj, path) => {
  let keys = transformPathArr(path)
  let key = keys.shift()

  if (!obj.hasOwnProperty(key)) return undefined

  if (keys.length === 0) {
    return obj[key]
  } else {
    return getProperty(obj[key], keys.join('.'))
  }
}



export const transformNtoBreak = (val: string) => {
  if (!val) return val;
  return val.split("\n").join("<br/>");
}

export function isMobile() {
  return ('ontouchstart' in document.documentElement)
}

