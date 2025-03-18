export default {
  methods: {
    getMessage(currentList = [], priorList = []) {
      return !currentList.length && priorList.length ? { message: this.$t('sdp.message.PleaseSelectCurrentPeriod') } : {}
    },
    // 用于初始化完成后调用promise完成
    callbackInitDefault(resolve) {
      if (resolve) {
        this.resolve = resolve
      } else if (this.resolve) {
        this.resolve()
        this.resolve = null
      }
    },
  }
}
