import sdpEn from '../../lang/en'
import sdpZh from '../../lang/zh'
import en from './lang/en'
import zh from './lang/zh'

import { createI18n } from "vue-i18n"


export const messages = {
  en: {
    ...en,
    ...sdpEn,
  },
  zh: {
    ...zh,
    ...sdpZh,
  },
  ja: {
    ...en,
    ...sdpEn,
  },
}
const i18n = createI18n({
  legacy: false,
  locale: 'zh', // set locale
  messages // set locale messages
})

export default i18n
