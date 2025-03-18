import {ref} from 'vue'
import { dateFormat } from './filters'
import { WEEK_TYPE } from './constants'
export const saveNowStr = ref({
  nowStr: dateFormat(new Date()),
  weekType: WEEK_TYPE.OnYear,
  offset: 0
})