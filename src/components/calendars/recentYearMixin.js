import { dateFormatter } from './utils'
import { DATE_CONST, DATE_YEAR } from './constants'

export default {
  inject: ['nowStr', 'recentYears'],
  computed: {
    nowYearValue() {
      return dateFormatter(this.nowStr).currentYear || new Date().getFullYear()
    },
    nowTimestamp() {
      if (this.recentYears !== Infinity) {
        return +new Date(`${Number(this.nowYearValue) - this.recentYears + 1}/01/01 00:00:00`)
      }
      return false
    }
  },
  methods: {
    getYearList(futureCalendar) {
      const yearList = futureCalendar ? [DATE_CONST.CurrentYear, DATE_CONST.NextYear] : [DATE_CONST.CurrentYear]
      for (let i = Number(this.nowYearValue); i >= DATE_YEAR; i--) {
        yearList.push(String(i))
      }
      return yearList
    },
    changeYearListShow(currentYearList, yearValueList = [], futureCalendar = false) {
      const defaultValueList = yearValueList
      if (yearValueList.includes(DATE_CONST.CurrentYear) && !yearValueList.includes(String(this.nowYearValue))) {
        defaultValueList.push(String(this.nowYearValue))
      }
      currentYearList.forEach(e => {
        if (!isNaN(Number(e.value))) {
          const show = defaultValueList.includes(e.value) && Number(e.value) > (Number(this.nowYearValue) - this.recentYears)
          e['show'] = show

          if (Number(e.value) > Number(this.nowYearValue) && futureCalendar) {
            e['show'] = defaultValueList.includes(DATE_CONST.NextYear)
          }
        } else {
          e['show'] = e.show = defaultValueList.includes(e.value)
        }
      })
    },
  }
}
