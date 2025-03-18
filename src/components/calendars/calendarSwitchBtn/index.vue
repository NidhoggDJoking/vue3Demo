<template>
  <span
  :class="['btn', isShowPriorPeriod ?  'icon-sdp-quxiaozidingyibijiao':'icon-sdp-zidingyibijiao']"
  @click="$emit('change',isShowPriorPeriod)"
  >&nbsp;&nbsp;{{
    btnText
  }}</span>
</template>

<script>
export default {
  props: {
    isShowPriorPeriod: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnText() {
      return this.isShowPriorPeriod
        ? this.$t('sdp.views.CancelTheComparison')
        : this.$t('sdp.views.CustomDateComparison')
    },
  },
}
</script>
<style lang="scss" scoped>
.btn {
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  height: 32px;
  display: inline-block;
  font-size: 12px;
  color: var(--sdp-cszjsz-wzs1);
  margin-top: 10px;
  line-height: 30px;
  text-align: center;
  border: 1px solid var(--sdp-cszj-bkfgx);
  &:hover {
    border-color: var(--sdp-cszj-onns);
    color: var(--sdp-cszj-onns);
  }
}
</style>
