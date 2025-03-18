// 数组排序
import { dateFormat } from './filters'
import { saveNowStr } from './bridge'

import { CALENDARTYPE, DATE_CONST, DATE_YEAR, DayTime, PERIOD, quickBusinessType, TYPE_LIST, WEEK_TYPE } from './constants'
import { flatten, formatDate } from './globalTools'
import { constentKeyMap, handGetCalculatPeriod } from './dateTools'

export const sortArray = (arr = [], key = '') => {
  const len = arr.length
  if (!len) return arr

  for (let j = 0; j < len - 1; j++) {
    for (let i = 0; i < len - 1 - j; i++) {
      if (arr[i][key] > arr[i + 1][key]) {
        const temp = arr[i]
        arr[i] = arr[i + 1]
        arr[i + 1] = temp
      }
    }
  }
  return arr
}

export function timestampToTime(timestamp, separate = '-') {
  let date = new Date(timestamp)
  let Y = date.getFullYear() + separate
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + separate
  let D = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  return Y + M + D
}

export function timeToTimestamps({ endDate, startDate }) {
  if (!endDate || !startDate) return []
  let endDateTime = new Date(safariCompliant(`${endDate} 00:00:00`))
  let startDateTime = new Date(safariCompliant(`${startDate} 00:00:00`))
  if (endDateTime === startDateTime) {
    return [startDateTime.getTime()]
  }
  const timestamps: number[] = []
  // eslint-disable-next-line no-unmodified-loop-condition
  while (startDateTime <= endDateTime) {
    timestamps.push(startDateTime.getTime())
    startDateTime.setDate(startDateTime.getDate() + 1)
  }
  return timestamps
}

export function transformShowData(data, calendarType = quickBusinessType, dateFormat = 'yyyy-MM-dd') {
  const sortData = data.sort((a, b) => a - b)
  let cache = []
  let saveData = new Map()
  let num = 0
  sortData.forEach((item) => {
    let keyTime = item
    if (num) {
      const cur = new Date(item)
      keyTime = cur.setDate(cur.getDate() - num)
    }
    const arr = saveData.get(keyTime)
    if (arr && calendarType === quickBusinessType) {
      saveData.set(arr[0], [...arr, item])
    } else {
      saveData.set(item, [item])
      num = 0
    }
    ++num
  })

  for (let [key, data] of saveData) {
    cache.push({
      data, label: data.length > 1 ? `${formatDate(new Date(key), dateFormat)} ~ ${formatDate(new Date(data[data.length - 1]), dateFormat)}` : `${formatDate(new Date(key), dateFormat)}`,
    })
  }

  return cache
}

export const getListSelect = (list, key = 'id', defaultKey = 'select') => {
  return list.reduce((result, current) => {
    if (current[defaultKey]) {
      return [...result, current[key]]
    }
    return result

  }, [])
}

export const dateFormatter = (nowStr) => {
  console.log('nowStr',nowStr)
    if(!nowStr) return {}
  const [currentYear, currentMonth] = nowStr.split(' ')[0].split('-')
  const beforeMonth = currentMonth - 1 || 12
  return { currentYear, currentMonth, beforeMonth: beforeMonth > 9 ? '' + beforeMonth : '0' + beforeMonth }
}

export function dateFormats(year) {
  const num = year - DATE_YEAR
  const yearArr = []
  for (let i = 0; i < num + 1; i++) {
    yearArr.push({ value: year - i, label: year - i })
  }
  return yearArr
}

const isGMT9 = (date) => date.getTimezoneOffset() / 60 === -9

export const getTimestamp = (date) => {
  // const h = 60 * 60 * 1000
  // const day = 24 * h

  let timestamp = +date

  // const next = timestamp - day

  // const hours = new Date(next).getHours()

  // if (hours) {
  //   if (hours === 23) {
  //     timestamp += h
  //   } else if (hours === 1) {
  //     timestamp -= h
  //   }
  // }

  return timestamp
}

export function getDay(year, month, date, dateTime, extra, offset = 0, currentDate, getWeekCount) {
  const current = `${safariCompliant(dateTime)} 00:00:00`
  const currentData = new Date(current)
  const beginData = new Date(current)
  beginData.setMonth(0)
  beginData.setDate(1)
  const moveDay = function (obj) {
    const day = obj.getDay()
    return day >= offset ? day - offset : 6 - day
  }
  const offsetDay = moveDay(currentData)
  const beginDay = moveDay(beginData)
  const dateCount = Math.ceil((Number(currentData) - Number(beginData)) / (24 * 60 * 60 * 1000)) + 1
  const isCurrent = dateTime === dateFormat(new Date(), 'yyyy-MM-dd')
  if (!currentDate && isCurrent) {
    extra.isDisabled = true
  }
  let weekCount = Math.ceil((dateCount + beginDay) / 7)
  let model = {
    year,
    month,
    date,
    offsetDay,
    timestamp: getTimestamp(currentData),
    // weekCount,
    weekCount: getWeekCount(year, weekCount),
    dateTime,
    isCurrent: currentDate && isCurrent,
    isStyle: false,
    ...extra,
  }
  return model
}

export function isLeapYear(year) {
  return (year % 100 === 0 ? (year % 400 === 0 ? 1 : 0) : (year % 4 === 0 ? 1 : 0))
}

export function getYearDayNum(year) {
  const yearArr = [31, 28 + isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return yearArr.reduce((pre, next) => {
    return pre + next
  })
}

export const getWeek = (year, offset = 0) => {
  const current = `${year}/12/31 00:00:00`
  const beginData = new Date(current)
  beginData.setMonth(0)
  beginData.setDate(1)
  const moveDay = function (obj) {
    const day = obj.getDay()
    return day >= offset ? day - offset : 6 - day
  }
  const currentData = new Date(current)
  const beginDay = moveDay(beginData)
  const dateCount = Math.ceil((Number(currentData) - Number(beginData)) / (24 * 60 * 60 * 1000)) + 1
  return Math.ceil((dateCount + beginDay) / 7)
}

export function getYearData({
  year,
  offset = 0,
  isOpenFuture = false,
  range = DATE_CONST.All,
  selectData = [],
  currentDate = false,
  isAllDisabled = false,
  weekType = '0',
  selectedFunc = null,
}) {
  if (!year) return []

  offset = Number(offset)

  const current = new Date()

  let leftRange = null
  let rightRange = null
  let leftRangeTime = +new Date()
  let rightRangeTime = +new Date()

  const isArryRange = Array.isArray(range)

  if (isArryRange) {
    const leftRangeItem = range.find(e => !e.includes('F'))
    const rightRangeItem = range.find(e => e.includes('F'))
    leftRange = leftRangeItem
    rightRange = rightRangeItem
  } else {
    leftRange = range
  }

  if (leftRange && leftRange !== DATE_CONST.All) {
    const days = Number(leftRange) * DayTime
    leftRangeTime -= days
  }

  if (rightRange) {
    const days = Number(rightRange.replace('F', '')) * DayTime
    rightRangeTime += days
  }

  // 周规则
  const lastYear = year - 1
  const weekMax = getWeek(year, offset)
  const lastYearWeekMax = getWeek(lastYear, offset)
  const lastYearDay = new Date(`${lastYear}-01-01`).getDay()
  const lastDay = new Date(`${year}-12-31`).getDay()
  const lastYearLastDay = new Date(`${lastYear}-12-31`).getDay()
  const offsetLastDay = (offset ? 0 : 6)
  const rulesWeek = 4

  const getWeekCount = (year, weekCount) => {
    switch (weekType) {
      /**
       * 周类型-不跨年（默认）
       */
      case WEEK_TYPE.OnYear:
        return weekCount
      /**
       * 周类型-跨年（常规）
       */
      case WEEK_TYPE.RegularYear:
        return (weekMax === weekCount && lastDay !== offsetLastDay) ? 1 : weekCount
      /**
       * 周类型-跨年（ISO-8601）
       */
      case WEEK_TYPE.IsoYear:
        const isMinus = offsetLastDay !== lastYearLastDay && lastYearLastDay >= rulesWeek
        if (weekCount === 1) {
          if (offsetLastDay === lastYearLastDay) return weekCount

          return lastYearLastDay >= rulesWeek ? (lastYearDay <= rulesWeek ? lastYearWeekMax : lastYearWeekMax - 1) : 1
        }
        weekCount = isMinus ? weekCount - 1 : weekCount
        const curWeekMax = isMinus ? weekMax - 1 : weekMax
        if (weekCount === curWeekMax) {
          if (offsetLastDay === lastDay) return weekCount

          return lastDay >= rulesWeek ? weekCount : 1
        }
        return weekCount
    }
  }

  // 生成每月天数的数组
  const yearArr = [31, 28 + isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const _selectedFunc = selectedFunc || ((selArr, curData) => {
    return selArr.includes(getTimestamp(new Date(`${safariCompliant(curData)} 00:00:00`)))
  })

  const _disableFunc = (dateTime) => {
    if (isAllDisabled) return isAllDisabled
    const targetDate = new Date(dateTime)
    if (targetDate < current) {
      // 过去 禁用
      // if (leftRange === DATE_CONST.All) {
      //   return false
      // } else if (!leftRange) {
      //   return true
      // } else {
      //   return new Date(leftRangeTime) > targetDate
      // }
      return true
    } else {
      // 未来
      if (isOpenFuture) {
        if (!rightRange) {
          return false
        } else {
          return targetDate > new Date(rightRangeTime)
        }
      } else {
        return true
      }
    }
  }

  return yearArr.reduce((pre, days, index) => {
    const monthData = []
    for (let date = 1; date <= days; date++) {
      const month = (index + 1)
      const dateTime = `${year}-${month > 9 ? month : `0${month}`}-${date > 9 ? date : `0${date}`}`
      monthData.push(
        getDay(year, month, date, dateTime,
          {
              isDisabled: _disableFunc(dateTime),
              isSelected: _selectedFunc(selectData, dateTime),
            },
            offset, currentDate, getWeekCount
        )
      )
    }
    return [...pre, monthData]
  }, [])
}

class Prior {
  preLeapYear: number
  curLeapYear: number
  timeState: number
  perTimeState: number
  twoMonthLastDay: number
  constructor(curYear, preYear) {
      this.preLeapYear = isLeapYear(preYear)
      this.curLeapYear = isLeapYear(curYear)
      this.timeState = +new Date(`${curYear}/01/01 00:00:00`)
      this.perTimeState = +new Date(`${preYear}/01/01 00:00:00`)
      this.twoMonthLastDay = +new Date(`${preYear}/02/28 00:00:00`)
  }
  getPrior(item) {
    const data = this.perTimeState + (item - this.timeState)
    if (this.preLeapYear !== this.curLeapYear && data > this.twoMonthLastDay) {
      if (this.preLeapYear) {
        return data + DayTime
      } else if (this.curLeapYear) {
        return data - DayTime
      }
    }
    return data
  }
}

export const computePrior = (data, curYear, preYear = curYear - 1) => {
  // const preYear = curYear - 1
  const prior = new Prior(curYear, preYear)
  const priorData = data.map(item => {
    return prior.getPrior(item)
  })
  return { priorData: [...new Set(priorData)], preYear }
}

export const computePriorSingle = (date) => {
  date = date.split(' ').length > 1 ? new Date(`${safariCompliant(date)}`) : new Date(`${safariCompliant(date)} 00:00:00`)
  const curYear = date.getFullYear()
  const preYear = curYear - 1
  const prior = new Prior(curYear, preYear)
  return prior.getPrior(date)
}

export const computePriorMultiple = (dates) => {
  return dates.map(date => computePriorSingle(date))
}

export const safariCompliant = (time) => {
  if (typeof time === 'string') {
    return time.replace(/[-.]/g, '/')
  }
  return time
}

// 时间日期进行比较
export const computeDateSort = (date) => {
  return date.sort((a, b) => new Date(safariCompliant(a)).getTime() - new Date(safariCompliant(b)).getTime())
}

export const getIsScatteredType = ({ currentList = [], priorList = [], computedPriorList = [], selectData = {}, priorDataRes = null }, type) => {
  const curLen = currentList.length
  const priLen = priorList.length
  const isLen = curLen && priLen
  if (!isLen) return {}

  switch (type) {
    case TYPE_LIST.Interval:
      const newPriorList = handGetCalculatPeriod(TYPE_LIST.Interval, { cIntervalList: currentList })
      return { scatteredType: priorList.every(item => newPriorList.includes(item)) ? DATE_CONST.CompareSelect : DATE_CONST.HandleSelect }
    case TYPE_LIST.default:
    case TYPE_LIST.Month:
    case TYPE_LIST.Week:
    case TYPE_LIST.Year:
    case TYPE_LIST.Event:
      let priData = []
      if (type === TYPE_LIST.default) {
        const priorListClone = priorDataRes || flatten(Object.entries(selectData).map(([key, data]) => computePrior(data, key).priorData))
        priData = priorListClone.map(timestamp => formatDate(new Date(timestamp)))
      } else if (type === TYPE_LIST.Month) {
        priData = currentList.map(item => {
          const [y, m] = item.split('-')
          return `${y - 1}-${m}`
        })
      } else if (type === TYPE_LIST.Week) {
        priData = computedPriorList
      } else if (type === TYPE_LIST.Year) {
        priData = currentList.map(item => String(item - 1))
      }

      if ((priData.length !== priLen) || !priorList.every(item => priData.includes(item))) {
        return { scatteredType: DATE_CONST.HandleSelect }
      }
      return { scatteredType: DATE_CONST.CompareSelect }
    default:
      return {}
  }
}

export function getDisabledDate(time, isFuture, futureYear = 1, showHms = true) {
  const getDisabled = (date) => {
    return time.getTime() > date || time.getTime() < new Date('1990/01/01 00:00:00')
  }
  const date = new Date()
  !showHms && date.setHours(23, 59, 59, 0)

  const year = date.getFullYear()
  if (isFuture) {
    const dateNew = new Date(`${year + futureYear}/12/31 23:59:59`)
    return getDisabled(dateNew)
  }
  // const month = date.getMonth() + 1
  // const day = date.getDate()
  // const dateTime = `${year}/${month > 9 ? month : `0${month}`}/${day > 9 ? day : `0${day}`}`
  // const dateNew = new Date(`${dateTime} 23:59:59`) // safari不兼容 需要把时间格式换成 YYYY/MM/DD 并且要加上时分秒的限制
  // return getDisabled(dateNew)
  return getDisabled(date)
}

export function getCurrentYearAndLastTransform([year, moth]) {
  const date = new Date()
  const isOneMoth = date.getMonth() === 0
  if (year === constentKeyMap.CURRENT_YEAR && moth === constentKeyMap.LAST_MONTH && isOneMoth) {
    const setYear = (date.getFullYear() - 1) + ''
    return [setYear, moth]
  }
  return [year, moth]
}
// 获取树的第一个数据
export function getFirstValueFormTree(treeData) {
  for (let tree of treeData) {
    if (!tree.children) {
      return tree
    }
    if (tree.children && tree.children.length) {
      const data = getFirstValueFormTree(tree.children)
      if (data) return data
    }
  }
  return false
}
export function eventDayTreeCategaryId(res) {
  res.forEach(yearItem => {
    yearItem.eventCategoryBoardVOS && yearItem.eventCategoryBoardVOS.forEach(categoryItem => {
      categoryItem.eventBoardVOList && categoryItem.eventBoardVOList.forEach(eventCategoryItem => {
        eventCategoryItem.eventDataVOS && eventCategoryItem.eventDataVOS.forEach(day => {
          day.calendarValueCategory = eventCategoryItem.id
        })
      })
    })
  })
  return res
}
export function getNodeLeaf(node) {
  const data = []
  const getLeaf = (node) => {
    if (node.isLeaf && (!node.childNodes || !node.childNodes.length)) {
      data.push(node)
      return
    }
    if (node.childNodes && node.childNodes.length) {
      node.childNodes.forEach(item => {
        getLeaf(item)
      })
    }
  }
  getLeaf(node)
  return data
}
// 从树型数组中获取key值为value值的节点
export function getValueFormTree(treeData, key = 'defaultValue', value = true) {
  for (let tree of treeData) {
    if (tree[key] === value) {
      return tree
    }
    if (tree.children && tree.children.length) {
      const data = getValueFormTree(tree.children, key, value)
      if (data) return data
    }
  }
  return false
}

export function getEventRecentYear(arr, key = 'value', value = new Date().getFullYear()) {
  if (!arr.length) return false
  let dif = Infinity
  let target = arr[0]
  for (let obj of arr) {
    const difValue = Number(obj[key]) - value
    const abs = Math.abs(difValue)
    if (abs < dif || (abs === dif && difValue < 0)) {
      dif = abs
      target = obj
    }
  }
  return target
}

export const getMothFormat = dateFormat => dateFormat.replace(/(^[dD]+[^yYmM]+)|([^yYmM]+[dD]+)/, '')

/**
 * 调用获取年数组
 * @param y<number> 需要添加的年
 * @param cYear<number> 从那一年开始添加
 * @return years<number[]>
 */
const getNextYear = (cYear, y = 15) => {
  if (typeof y !== 'number') return []

  const years = []
  while (y) {
    years.push(String(cYear + y))
    y--
  }
  return years
}

/**
 * 添加未来年
 * @param yearValueList 需要添加的未来年数组
 */
function insertNextYear(yearValueList: (string | number)[] = [], cYear) {
  const isCurrentYear = yearValueList.includes(DATE_CONST.CurrentYear)
  if (!isCurrentYear) return

  const nextYear = getNextYear(cYear)
  const newYearValueList = new Set([...nextYear, ...yearValueList])
  yearValueList.splice(0, yearValueList.length, ...newYearValueList)
}

export const insertAllNextYear = (userSetting, cYear = new Date().getFullYear(), cd) => {
  let arr = ['yearData', 'weekData', 'monthData']
  Object.keys(userSetting).forEach((key) => {
    if (!arr.includes(key)) return

    const yearValueList = userSetting[key].yearValueList || []
    insertNextYear(yearValueList, cYear)
  })
  cd && cd()
}


export const classifyYear = (data) => {
  const mapData = new Map()
  data.forEach((item) => {
    const year = new Date(item).getFullYear()
    const arr = mapData.get(year) || []
    mapData.set(year, [...arr, item])
  })
  return mapData
}


export function getBrowserInfo() {
  // const strStart = 0
  // const strStop = 0
  // const temp = ''
  const Sys = {
    browser: undefined,
    ver: 'string'
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  // alert(userAgent);

  if (userAgent.indexOf('opr') !== -1) { // Opera
    Sys.browser = 'Opera'
    Sys.ver = userAgent.match(/(opr).*?([\d.]+)/)?.[2]
  } else if (userAgent.indexOf('firefox') !== -1) { // FireFox
    Sys.browser = 'Firefox'
    Sys.ver = userAgent.match(/(firefox).*?([\d.]+)/)?.[2]
  } else if (userAgent.indexOf('edge') !== -1) { // Edge
    Sys.browser = 'Edge'
    Sys.ver = userAgent.match(/(edge).*?([\d.]+)/)?.[2]
  } else if ((userAgent.indexOf('net') !== -1 || userAgent.indexOf('nt') !== -1) && userAgent.indexOf('rv') !== -1) { // IE 11
    Sys.browser = 'IE'
    Sys.ver = userAgent.match(/(rv).*?([\d.]+)/)?.[2]
  } else if ((userAgent.indexOf('net') !== -1 || userAgent.indexOf('nt') !== -1) && userAgent.indexOf('msie') !== -1) { // IE浏览器
    Sys.browser = 'IE'
    Sys.ver = userAgent.match(/(msie).*?([\d.]+)/)?.[2]
  } else if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) { // Safari浏览器
    Sys.browser = 'Safari'
    Sys.ver = userAgent.match(/(version).*?([\d.]+)/)?.[2]
  } else if (userAgent.indexOf('chrome') !== -1) { // Chrome浏览器
    Sys.browser = 'Chrome'
    Sys.ver = userAgent.match(/(chrome).*?([\d.]+)/)?.[2]
  } else if (userAgent.indexOf('bingBot'.toLowerCase()) !== -1) { // Bing浏览器
    Sys.browser = 'Bing'
    Sys.ver = userAgent.match(/(bingbot).*?([\d.]+)/)?.[2]
  } else {
    Sys.browser = 'Other'
    Sys.ver = userAgent
  }

  return Sys
}