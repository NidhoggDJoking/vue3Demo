import themeConfig from './themeConfig'

export const SELECT_STATE = {
  NONE: 'NONE',
  ALL: 'ALL',
  MULTIPLE: 'MULTIPLE',
  SINGLE: 'SINGLE',
}

export const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
export const HAND_CLICK = 'handClick'
export const MONTH_ALL_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export const DAY_LANG_NAMES = function() {
  const list = [
    { text: this.$t('sdp.views.Su'), value: 'Su' },
    { text: this.$t('sdp.views.Mo'), value: 'Mo' },
    { text: this.$t('sdp.views.Tu'), value: 'Tu' },
    { text: this.$t('sdp.views.We'), value: 'We' },
    { text: this.$t('sdp.views.Th'), value: 'Th' },
    { text: this.$t('sdp.views.Fr'), value: 'Fr' },
    { text: this.$t('sdp.views.Sa'), value: 'Sa' },
  ]
  return list
}
export const MONTH_LANG_NAMES = function() {
  const list = [
  { text: this.$t('sdp.views.January'), value: 'January' },
  { text: this.$t('sdp.views.February'), value: 'February' },
  { text: this.$t('sdp.views.March'), value: 'March' },
  { text: this.$t('sdp.views.April'), value: 'April' },
  { text: this.$t('sdp.views.Mays'), value: 'Mays' },
  { text: this.$t('sdp.views.June'), value: 'June' },
  { text: this.$t('sdp.views.July'), value: 'July' },
  { text: this.$t('sdp.views.August'), value: 'August' },
  { text: this.$t('sdp.views.September'), value: 'September' },
  { text: this.$t('sdp.views.October'), value: 'October' },
  { text: this.$t('sdp.views.November'), value: 'November' },
  { text: this.$t('sdp.views.December'), value: 'December' },
  ]

  return list
}



export const PERIOD = {
  currentPeriod: 'currentPeriod',
  priorPeriod: 'priorPeriod',
}

export const DayTime = 24 * 60 * 60 * 1000

export const DATE_CONST = {
  Today: 'Today',
  Yesterday: 'Yesterday',
  Tomorrow: 'Tomorrow',
  CustomDatePeriod: 'Custom Date Period',
  CustomDate: 'Custom date',
  CurrentYear: 'Current Year',
  NextYear: 'Next Year',
  NextMonth: 'Next Month',
  NextWeek: 'Next Week',
  Current: 'Current',
  Last: 'Last',
  None: 'none',
  PriorPeriod: 'Prior Period',
  Rule: 'natural',
  All: 'all',
  range30: '30',
  range60: '60',
  range90: '90',
  range180: '180',
  rangeFuture30: 'F30',
  rangeFuture60: 'F60',
  rangeFuture90: 'F90',
  rangeFuture180: 'F180',
  WeekToDate: 'Week to Date',
  MonthToDate: 'Month to Date',
  QuarterToDate: 'Quarter to Date',
  YearToDate: 'Year to Date',
  MostRecent: 'Most Recent',
  Scattered: 'scattered',
  ScatteredMultiple: 'ScatteedMultiple',
  TillYearEnd: 'Till Year-end',
  TillMonthEnd: 'Till Month-end',
  TillQuarterEnd: 'Till Quarter-end',
  TillWeekend: 'Till Weekend',
  LastYear: 'Last Year',
  LastMonth: 'Last Month',
  LastWeek: 'Last Week',
  LastQuarter: 'Last Quarter',
  NextQuarter: 'Next Quarter',
  LastNDays: 'Last n days',
  NextNDays: 'Next n days',
  LastToNext: 'Last to Next',
  TheMostRecentYear: 'The Most Recent Year',
  HandleSelect: 'HandleSelect',
  CompareSelect: 'CompareSelect',
  // 财务日历
  FWeekToDate: 'Financial Week to Date',
  FPeriodToDate: 'Financial Period to Date',
  FQuarterToDate: 'Financial Quarter to Date',
  FYearToDate: 'Financial Year to Date',
  LastFYear: 'Last Financial Year',
  LastFMonth: 'Last Financial Month',
  LastFWeek: 'Last Financial Week',
  LastFPeriod: 'Last Financial Period',
  LastFQuarter: 'Last Financial Quarter',
}

export const TYPE_LIST = {
  default: 'default',
  Year: 'Year',
  Month: 'Month',
  Week: 'Week',
  Event: 'Event',
  Period: 'Period',
  Interval: 'Interval'
}

export const EVENT_TYPE = {
  PARAMS: 'Parameter Filtering',
  HIERARCH: 'Hierarchical Statistics',
}

export const EVENT_COMPARE_TYPE = {
  CUSTOM: 'Custom',
  COMPARE_LAST_TIME: 'compareLastTime',
  COMPARE_N_TIME: 'compareNTimes',
}

export const DATE_ID_2887 = 2887

export const DATE_YEAR = 1990

export const UNIQUE_SELECT_KEY = { // 选中的key本期or上期
  CURRENT: 'current',
  PERIOD: 'period'
}
export const PERIOD_TYPE = {
  [UNIQUE_SELECT_KEY.CURRENT]: 'currentPeriod',
  [UNIQUE_SELECT_KEY.PERIOD]: 'priorPeriod'
}

export const quickBusinessType = '2'

export const QUICK_CONST = {
  'pri_period_key': 'pri_period_key',
  'pri_period_key_infrasys': 'pri_period_key_infrasys',
  'pri_period_key_month-on-month': 'pri_period_key_month-on-month',
  'pri_period_key_year-on-year': 'pri_period_key_year-on-year',
  'this_period_key': 'this_period_key'
}

export const CALENDARTYPE = {
  [TYPE_LIST.Month]: 'According To Month',
  [TYPE_LIST.Year]: 'According To Year',
  [TYPE_LIST.Interval]: 'Date Interval',
  [TYPE_LIST.default]: '1',
  [TYPE_LIST.Week]: 'According To Week',
  [TYPE_LIST.Event]: 'Date Interval',
}

export const RESTORE_TYPE = {
  reSetDefault: 'reSetDefault',
  reSetUserHandle: 'reSetUserHandle'
}

export const COMPARE_TYPE = {
  yearOnYear: 'Year-on-Year',
  dayOnDay: 'Day-on-Day',
  monthOnMonth: 'Month-on-Month',
  past7Days: 'Past 7 days',
  Next7Days: 'Next 7 days',
  weekOnWeek: 'Week-on-Week',
  quarterOnQuarter: 'Quarter-on-Quarter',
  last6Months: 'Last 6 Months',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  next6Months: 'Next 6 Months',
  theMostRecentYear: 'The Most Recent Year',
  prompt: 'prompt',
  custom: 'Custom',
  customOnYear: 'Custom-on-Year',
  // 财务日历
  FYearOnYear: 'FYear-on-Year',
  FPeriodOnPeriod: 'FPeriod-on-Period',
  FWeekOnWeek: 'FWeek-on-Week',
  FQuarterOnQuarter: 'FQuarter-on-Quarter '
}

// 营运日历
export const USER_DATE_TYPE = new Map([
  [
    [DATE_CONST.Yesterday, DATE_CONST.Today, DATE_CONST.MostRecent, DATE_CONST.Tomorrow],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.dayOnDay,
      'infrasys': COMPARE_TYPE.monthOnMonth
    }
  ],
  [
    [COMPARE_TYPE.past7Days, COMPARE_TYPE.Next7Days],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.past7Days,
      'infrasys': COMPARE_TYPE.monthOnMonth
    }
  ],
  [
    [DATE_CONST.WeekToDate, DATE_CONST.TillWeekend, DATE_CONST.LastWeek, DATE_CONST.NextWeek],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.weekOnWeek,
      'infrasys': COMPARE_TYPE.weekOnWeek
    }
  ],
  [
    [DATE_CONST.QuarterToDate, DATE_CONST.LastQuarter, DATE_CONST.TillQuarterEnd, DATE_CONST.TillQuarterEnd, DATE_CONST.NextQuarter],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.quarterOnQuarter,
      'infrasys': COMPARE_TYPE.quarterOnQuarter
    }
  ],
  [
    [DATE_CONST.LastMonth, DATE_CONST.TillMonthEnd, DATE_CONST.MonthToDate, DATE_CONST.NextMonth],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.monthOnMonth,
      'infrasys': COMPARE_TYPE.monthOnMonth
    }
  ],
  [
    [DATE_CONST.YearToDate, DATE_CONST.TillYearEnd, DATE_CONST.LastYear, DATE_CONST.NextYear, TYPE_LIST.Year],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.yearOnYear,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [COMPARE_TYPE.last6Months, COMPARE_TYPE.next6Months],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.last6Months,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [COMPARE_TYPE.last30Days],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.last30Days,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [COMPARE_TYPE.last90Days],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.last90Days,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [TYPE_LIST.Month],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.monthOnMonth,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [TYPE_LIST.Week],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.weekOnWeek,
      'infrasys': COMPARE_TYPE.weekOnWeek
    }
  ],
  [
    [TYPE_LIST.Interval, DATE_CONST.CustomDatePeriod],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.custom,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [DATE_CONST.Scattered],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.dayOnDay,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [DATE_CONST.ScatteredMultiple],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.prompt,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  // xsd
  [
    [DATE_CONST.LastNDays, DATE_CONST.NextNDays],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.yearOnYear,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [
    [DATE_CONST.LastToNext],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.dayOnDay,
      'infrasys': COMPARE_TYPE.monthOnMonth
    }
  ],
  [
    [DATE_CONST.TheMostRecentYear],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.theMostRecentYear,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [ // 本期和上期对应时
    [DATE_CONST.CompareSelect],
    {
      'year-on-year': COMPARE_TYPE.yearOnYear,
      'month-on-month': COMPARE_TYPE.yearOnYear,
      'infrasys': COMPARE_TYPE.yearOnYear
    }
  ],
  [ // 本期和上期不对应时
    [DATE_CONST.HandleSelect],
    {
      'year-on-year': COMPARE_TYPE.custom,
      'month-on-month': COMPARE_TYPE.custom,
      'infrasys': COMPARE_TYPE.custom
    }
  ]
])

// 财务日历
export const USER_FDATE_TYPE = new Map([
  [
    [DATE_CONST.Yesterday, DATE_CONST.Today, DATE_CONST.MostRecent],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.dayOnDay,
      'infrasys': COMPARE_TYPE.FPeriodOnPeriod
    }
  ],
  [
    [DATE_CONST.FWeekToDate, DATE_CONST.LastFWeek],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.FWeekOnWeek,
      'infrasys': COMPARE_TYPE.FWeekOnWeek
    }
  ],
  [
    [DATE_CONST.FPeriodToDate, DATE_CONST.LastFMonth, DATE_CONST.LastFPeriod, TYPE_LIST.Period],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.FPeriodOnPeriod,
      'infrasys': COMPARE_TYPE.FPeriodOnPeriod
    }
  ],
  [
    [DATE_CONST.FQuarterToDate, DATE_CONST.LastFQuarter],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.FQuarterOnQuarter,
      'infrasys': COMPARE_TYPE.FQuarterOnQuarter
    }
  ],
  [
    [DATE_CONST.FYearToDate, DATE_CONST.LastFYear, TYPE_LIST.Year],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.FYearOnYear,
      'infrasys': COMPARE_TYPE.FYearOnYear
    }
  ],
  [
    [TYPE_LIST.Interval, DATE_CONST.CustomDatePeriod],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.custom,
      'infrasys': COMPARE_TYPE.FYearOnYear
    }
  ],
  // 零散
  [
    [DATE_CONST.Scattered],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.dayOnDay,
      'infrasys': COMPARE_TYPE.FYearOnYear
    }
  ],
  [
    [DATE_CONST.ScatteredMultiple],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.prompt,
      'infrasys': COMPARE_TYPE.FYearOnYear
    }
  ],
  [ // 本期和上期对应时
    [DATE_CONST.CompareSelect],
    {
      'year-on-year': COMPARE_TYPE.FYearOnYear,
      'month-on-month': COMPARE_TYPE.FYearOnYear,
      'infrasys': COMPARE_TYPE.FYearOnYear
    }
  ],
  [ // 本期和上期不对应时
    [DATE_CONST.HandleSelect],
    {
      'year-on-year': COMPARE_TYPE.custom,
      'month-on-month': COMPARE_TYPE.custom,
      'infrasys': COMPARE_TYPE.custom
    }
  ]
])

export const COMPARE_TYPE_LIST = [
  {
    // 同比
    configName: 'compareYoY',
    configValue: COMPARE_TYPE.yearOnYear,
    disabled: true
  },
  {
    // 自定义
    configName: 'defaultCustom',
    configValue: COMPARE_TYPE.custom,
    disabled: true
  },
  {
    // 自定义同比年份
    configName: 'CustomComparisonYear',
    configValue: COMPARE_TYPE.customOnYear,
    disabled: false
  },
]

// app

export const WEEK_TYPE = { OnYear: '0', RegularYear: '1', IsoYear:'2' }





export const CHOOSE_WAY = {
  Single: '1',
  Multiple: '2'
}


export const quickFinancialType = '1'

export const QUARTER_NAMES = [
  'Q1', 'Q2', 'Q3', 'Q4',
]
export const DAY_NAMES_KEy = {
  Su: 'Su',
  Mo: 'Mo',
  Tu: 'Tu',
  We: 'We',
  Th: 'Th',
  Fr: 'Fr',
  Sa: 'Sa',
}
export const DAY_NAMES_Obj = {
  [DAY_NAMES_KEy.Su]: 0, [DAY_NAMES_KEy.Mo]: 1, [DAY_NAMES_KEy.Tu]: 2, [DAY_NAMES_KEy.We]: 3, [DAY_NAMES_KEy.Th]: 4, [DAY_NAMES_KEy.Fr]: 5, [DAY_NAMES_KEy.Sa]: 6
}

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// 组件名称  用于初始化和用户操作
export const COMPONENTS_NAME_PC = {
  Quick: 'quick',
  Interval: 'interval',
  Subsidiary: 'subsidiary',
  Year: 'Year',
  Period: 'Period',
}


export const CREATE_TOAST_TIME = 2500


export const THEME_CONFIG = themeConfig