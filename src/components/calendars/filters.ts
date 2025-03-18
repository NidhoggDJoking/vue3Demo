/**
* 全局注册过滤器: 在main.js中添加到Vue过滤器中
* 双花括号插值和 v-bind 表达式 中可以通过管道符|来使用
* 也可以像全局方法一样通过实例访问
*/
// 取剩余秒
const pluralize = (time, label) => {
  return time + label + '前'
}
/**
 * 相对时间过滤器，传入时间，返回距离今天有多久
 * @export
 * @param {Date} time 时间戳
 * @returns
 */
export const timeAgo = time => {
  time = time instanceof Date ? time : new Date(time)
  const between = Date.now() / 1000 - (Number(time) / 1000)
  if (between < 3600) {
    if (Object.is(~~(between / 60), 0)) return '刚刚'
    return pluralize(~~(between / 60), ' 分钟')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' 小时')
  } else {
    return pluralize(~~(between / 86400), ' 天')
  }
}

/**
 * 格式化时间 yyyy-MM-dd hh:mm:ss 会替换为 2018-01-01 12:00:00
 * value 必须是 Data 类型
 * @export
 * @param {Date} value 时间戳
 * @param {String} fmt 格式化方式
 * @returns
 */
export const dateFormat = (value, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (!value || typeof fmt !== 'string' || !(value instanceof Date)) {
    return ''
  }

  const date = new Date(value)
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

const Time = {
  // 获取当前时间戳
  getUnix() {
    return new Date().getTime()
  },
  // 获取今天0点0分0秒的时间戳
  getTodayUnix() {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },
  // 获取今年1月1日0点0分0秒的时间戳
  getYearUnix() {
    const date = new Date()
    date.setMonth(0)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },
  // 获取标准年月日
  getLastDate(time) {
    const date = new Date(time)
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return date.getFullYear() + '-' + month + '-' + day
  },
  // 转换时间
  getFormatTime(timestamp) {
    const now = Time.getUnix() // 当前时间戳
    const today = Time.getTodayUnix() // 今天0点时间戳
    // const year = Time.getYearUnix()
    // 今年0点时间戳
    const timer = (now - timestamp) / 1000 // 转换为秒级时间戳
    let tip = ''

    if (timer <= 0) {
      tip = '刚刚'
    } else if (Math.floor(timer / 60) <= 0) {
      tip = '刚刚'
    } else if (timer < 3600) {
      tip = Math.floor(timer / 60) + '分钟前'
    } else if (timer >= 3600 && (timestamp - today >= 0)) {
      tip = Math.floor(timer / 3600) + '小时前'
    } else if (timer / 86400 <= 31) {
      tip = Math.ceil(timer / 86400) + '天前'
    } else {
      tip = Time.getLastDate(timestamp)
    }
    return tip
  },
}

export const relativeTime = Time.getFormatTime

// 转换成标准时间格式
export const dateTransNormal = (time) => {
  const date = new Date(time)
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return date.getFullYear() + '-' + month + '-' + day
}
