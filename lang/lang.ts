// @ts-ignore
import langJSON from './langpackage'

const langList = ['zh', 'en']
const langPackage = {}

Object.keys(langJSON).forEach(key => {
  langList.forEach(lang => {
    langPackage[lang] || (langPackage[lang] = {})
    langPackage[lang][key] = {}
    Object.keys(langJSON[key]).forEach(k => {
      langPackage[lang][key][k] = langJSON[key][k][lang]
    })
  })
})
function detailCmp(s, k = '', r = {}) {
  if (typeof s === 'object') {
    Object.keys(s).forEach(sk => {
      if (typeof s[sk] === 'object') {
        const _k = `${ k }${ k ? '.' : '' }${ sk }`
        if (!s[sk].hasOwnProperty('zh')) {
          detailCmp(s[sk], _k, r)
        } else {
          const rKey = s[sk].zh
          let item = {
            en: [s[sk].en],
            zh: s[sk].zh,
            key: [_k],
          }
          if (r[rKey]) {
            r[rKey].en.push(s[sk].en)

            if (new Set(r[rKey].en).size !== 1) {
              r[rKey].isRepeat = '产品给了重复的翻译'
            } else if (new Set(r[rKey].en).size !== r[rKey].en.length) {
              r[rKey].isRepeat = '前端写了重复的'
            }
            
            r[rKey].key.push(_k)
          } else {
            r[rKey] = item
          }
        }
      }
    })
  }
  return r
}
const b = detailCmp(langJSON)
const repeatDetail = []
const removeDetail = []
Object.keys(b).forEach(k => {
  if (b[k].key.length > 1) {
    repeatDetail.push(b[k])
    if (b[k].isRepeat === '前端写了重复的') {
      removeDetail.push(b[k])
    }
  }
})
// console.log('多语言重复了！！！',  repeatDetail)
if (removeDetail.length) {
  console.error('多语言重复了！！！')
  console.log('多语言重复了！！！', removeDetail)
}
export default langPackage
