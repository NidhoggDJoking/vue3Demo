import { TYPE_LIST, DayTime } from './constants'
import { safariCompliant } from './utils'

interface DateArray {
  [index: number]: number
}

interface DateReturnVal {
  id:string,
  value:string,
  label:string,
  select: boolean,
  show: boolean,
  defaultValue: boolean
}

type dateReturnvalue<T> = (arg: T) => T;

export const constentKeyMap = {
  CURRENT_YEAR: 'Current Year',
  NEXT_YEAR: 'Next Year',
  CURRENT_MONTH: 'Current',
  LAST_MONTH: 'Last',
  TODAY: 'today',
  YESTERDAY: 'yesterday'
}

// 快选映射对象 一帮用于typeList
export const quickSelectKeyMap = {
  DEFAULT: 'default',
  YEAR: 'Year',
  MONTH: 'Month',
  INTERVAL: 'Interval'

}
export const quickSelectMap = {
  [quickSelectKeyMap.DEFAULT]: 'isDefault',
  [quickSelectKeyMap.YEAR]: 'isYear',
  [quickSelectKeyMap.MONTH]: 'isMonth',
  [quickSelectKeyMap.INTERVAL]: 'isInterval'
}
// 日期组装小于10前面补0
export const composeNumber = (currentNum:number):string => {
  return currentNum > 9 ? currentNum.toString() : `0${currentNum}`
}

// 判断是否为闰年 1:为闰年包含29号
export const isLeapYear = (year:number):number => {
  return (year % 100 === 0 ? (year % 400 === 0 ? 1 : 0) : (year % 4 === 0 ? 1 : 0))
}

// 生成某年的12个月
export const handGetMonthList = (year:number) => [31, 28 + isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// 日期拆分成数组
export const handGetDateInfo = (date:string):DateArray => date.split('-').map(item => parseInt(item))

// 排序  倒序
export const handSortNumber = (arr) => arr.sort((a, b) => parseInt(b) - parseInt(a))

// 月份转换 为 -1 就为12
export const transMonthFormatter = month => month === -1 ? 12 : month
// 转换成标准时间格式YYYY-MM-DD  不包括时分秒
export const dateTransNormal = (time:string | number):string => {
  const date = new Date(safariCompliant(time))
  const month = composeNumber(date.getMonth() + 1)
  const day = composeNumber(date.getDate())
  return date.getFullYear() + '-' + month + '-' + day
}

// 日期数组转换成区间  [2020-01-01,2020-01-02,2020-02-03] ====> [2021-01-01~2020-01-02,2020-02-03]
export const transformDate = (list) => {
  const formatterDate = list.sort((a, b) => Date.parse(a) - Date.parse(b))
  const oneDayDelay = 1 * 24 * 60 * 60 * 1000
  const dateRangeList = []
  for (let i = 0; i < formatterDate.length; i++) {
      let date = formatterDate[i]
      let currentLastIndex = dateRangeList.length - 1
      let currentLastArr = currentLastIndex > -1 ? dateRangeList[currentLastIndex] : null

      if (currentLastArr && (Date.parse(date) - Date.parse(currentLastArr[currentLastArr.length - 1])) === oneDayDelay) {
          dateRangeList[currentLastIndex].push(date)
      } else {
          dateRangeList.push([date])
      }
  }
  return dateRangeList.reduce((result, pre) => {
    if (pre.length > 1) {
      const currentValue = {
        label: pre[0] + '~' + pre[pre.length - 1],
        value: [...pre]
      }
      return [...result, currentValue]
    } else {
      const currentValue = {
        label: pre[0],
        value: [...pre]
      }
      return [...result, currentValue]
    }
  }, [])
}

// 获取日期区间内的所有日期
export const handGetDateArray = (startDate, endDate) => {
  // const handGetMonthList = year => [31, 28 + isLeapYear(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const [startY, startM, startD] = handGetDateInfo(startDate)
  const [endY, endM, endD] = handGetDateInfo(endDate)
  const judgeDay = ([currentY, currentM, currentD]) => currentY === endY && currentM === endM && currentD === endD
  const numForMatter = num => num > 9 ? num + '' : '0' + num
  const dateStr = ([y, m, d]) => `${y}-${numForMatter(m)}-${numForMatter(d)}`
  const dateResult = []
  const loopFn = ([y, m, d]) => {
    const flag = judgeDay([y, m, d])
    if (flag) {
      dateResult.push(dateStr([y, m, d]))
      return
    }

    const monthList = handGetMonthList(y)
    const isOverFlowMonth = m > 12
    const isOverFlowDay = d > monthList[m - 1]

    if (isOverFlowMonth) {
      loopFn([y + 1, 1, d])
    } else if (isOverFlowDay) {
      loopFn([y, m + 1, 1])
    } else {
      dateResult.push(dateStr([y, m, d]))
      loopFn([y, m, d + 1])
    }

  }
  loopFn([startY, startM, startD])
  return dateResult
  // const endYear = endTime.split('-')[0]
}

// 生成某一年的所有日期
export const generateYearData = (year:number, currentSelectList, priSelectList) => {
  const monthArray = handGetMonthList(year)
  monthArray.map((item, mIndex) => {
  return new Array(item).map(day => {
    const dateTime = year + '-' + composeNumber(mIndex + 1) + '-' + composeNumber(day + 1)
      return {
        dateTime,
        year,
        month: mIndex + 1,
        day: day + 1,
        isSelectCurrent: currentSelectList.includes(currentSelectList),
        isSelectpriPeriod: priSelectList.includes(priSelectList)
      }
    })
  })
}

// 特殊字符映射成指定日期 Current Last   Current Year
export const generateKeyWordDate = (dateList, currentDate) => {
  const today = currentDate ? new Date(currentDate) : new Date()
  const preMonth = today.getMonth() === 0 ? 12 : today.getMonth()
  const currentMonth = today.getMonth() + 1
  // const keyArray:Array<Array<string>> = [['Current Year', today.getFullYear() + ''], ['Current', composeNumber(currentMonth)], ['Last', composeNumber(preMonth)]]
  const keyMap = new Map([
    [constentKeyMap.CURRENT_YEAR, today.getFullYear() + ''],
    [constentKeyMap.NEXT_YEAR, today.getFullYear() + 1 + ''],
    [constentKeyMap.CURRENT_MONTH, composeNumber(currentMonth)],
    [constentKeyMap.LAST_MONTH, composeNumber(preMonth)],
    [constentKeyMap.TODAY, dateTransNormal(+today)],
    [constentKeyMap.YESTERDAY, dateTransNormal((+today - DayTime))]
  ])
  const resList = dateList.map(item => keyMap.get(item) || item)
  return [...new Set(resList)]
}

// 生成至目标年限的map
export const generateYearList = (targetYear:number) => {
  return Array.from({ length: targetYear - 1990 }).map((item:any):DateReturnVal => {
    const targetYear:string = composeNumber(item + 1990)
    return {
      id: targetYear,
      value: targetYear,
      label: targetYear,
      select: false,
      show: true,
      defaultValue: false
    }
  })
}

// 生成目标月份的map
export const generateMonthList = (targetMonth:number) => {
  return Array.from({ length: targetMonth }).map((item:any):DateReturnVal => {
    const targetMonth:string = composeNumber(item)
    return {
      id: targetMonth,
      value: targetMonth,
      label: targetMonth,
      select: false,
      show: true,
      defaultValue: false
    }
  })
}

// 将老看板年月默认拆开

export const spliceMonth = (list) => {
  return list.reduce((result, pre) => {
    const isMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', constentKeyMap.CURRENT_MONTH, constentKeyMap.LAST_MONTH]
    if (isMonth.includes(pre)) {
      result.month.push(pre)
    } else {
      result.year.push(pre)
    }
    return result
  }, { year: [], month: [] })
}

// 计算某一天的去年同期
export const caculatPeriod = (date, priYear = 0) => {
  date = safariCompliant(date)
  // const formatterDate = list.sort((a, b) => Date.parse(a) - Date.parse(b))
  const currentDate = new Date(safariCompliant(date))
  const currentYear = currentDate.getFullYear()

  const preYear = priYear || currentYear - 1
  const preLeapYear = isLeapYear(preYear)
  const curLeapYear = isLeapYear(currentYear)
  const timeState = +new Date(`${currentYear}/01/01 00:00:00`)
  const perTimeState = +new Date(`${preYear}/01/01 00:00:00`)
  const twoMonthLastDay = +new Date(`${preYear}/02/28 23:59:59`)
  let data = perTimeState + (Date.parse(date) - timeState)
  // 还需要判断2.28当天 但是时分秒大于00:00:00的情况
  return (preLeapYear !== curLeapYear && data > twoMonthLastDay) ? (preLeapYear ? data + DayTime : curLeapYear ? data - DayTime : data) : data

}

// 计算本期上期

export const handGetCalculatPeriod = (type, { cWeekList = [], cDefaultList = [], cYearList = [], cMonthYearList = [], cIntervalList = [] }, userYearList?, priYear?) => {
  if (type === TYPE_LIST.default) {
    if (!cDefaultList?.length) return []
    return cDefaultList.map(item => {
      return dateTransNormal(caculatPeriod(item, priYear))
    })
  }
  if (type === TYPE_LIST.Year) {
    if (!cYearList?.length) return []
    cYearList.sort((a, b) => b.y - a.y)
    const diffYear = priYear ? cYearList[0].y - priYear : 1
    return cYearList.reduce((result, pre) => {
      const periodYear = priYear ? String(pre.y - diffYear) : composeNumber(pre.y - 1)
      return userYearList.includes(periodYear) ? [...result, { y: periodYear }] : result
    }, [])
  }
  if (type === TYPE_LIST.Month) {
    if (!cMonthYearList?.length) return []
    cMonthYearList.sort((a, b) => b.y - a.y)
    const diffYear = priYear ? cMonthYearList[0].y - priYear : 1
    return cMonthYearList.reduce((result, pre) => {
      const periodYear = priYear ? composeNumber(pre.y - diffYear) : composeNumber(pre.y - 1)
      return userYearList.includes(periodYear) ? [...result, { y: periodYear, m: pre.m }] : result
    }, [])
  }
  if (type === TYPE_LIST.Interval) {
    if (!cIntervalList?.length) return []
    let curTime = cIntervalList[0].split('-')?.[0] || cIntervalList[0].substr(0, 4)
    const diffYear = priYear ? Number(curTime) - Number(priYear) : 1
    return cIntervalList.map(item => {
      if (item) {
        const dateFormat = item.split(' ')
        const lastYear = priYear ? Number(item.substr(0, 4)) - diffYear : 0
        const time = dateTransNormal(caculatPeriod(item, lastYear))
        return dateFormat[1] ? time + ' ' + dateFormat[1] : time
      } else {
        return ''
      }
    })
  }
  if (type === TYPE_LIST.Week) {
    if (!cWeekList?.length) return []
    cWeekList.sort((a, b) => b.y - a.y)
    const diffYear = priYear ? cWeekList[0].y - priYear : 1
    return cWeekList.map(item => {
      const { y, m } = item
      const lastYear = priYear ? String(y - diffYear) : String(y - 1)
      const yearItem = userYearList.find(({ value }) => {
        return lastYear === value
      })
      if (yearItem) {
        // 没有找到取最大一周做处理
        return yearItem.children.find(i => {
          return m.value === i.value
        }) || yearItem.children[0]
      }
      return null
    }).filter(e => e)
  }
}

// 把一个月的数据 按周转为二维数组

export const transMonthDateToWeekArray = (list) => {
  const cList = list.reduce((result, pre) => {
    if (result[pre.weekCount]) {
      result[pre.weekCount][pre.offsetDay] = pre
    } else {
      const initMap = Array.from({ length: 7 }, item => ({ empty: true }))
      initMap[pre.offsetDay] = pre
      result[pre.weekCount] = [...initMap]
    }
    return result
  }, [])
  return cList.filter(item => item)
}

// 选中某个星期返回获取的日期
export const getDateFromWeek = (list, week) => {
  return list.filter(item => item.offsetDay === week)
}
