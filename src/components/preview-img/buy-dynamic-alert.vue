<template>
  <div class="lock-alert" @click="hide">
    <img :src="img" alt="">
  </div>
</template>

<script>
export default {
  name: 'buy-dynamic-alert',
  props: {
    img: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
    hide() {
      document.body.removeChild(this.$el)
      this.$destroy()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
  .lock-alert
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    z-index 100
    background rgba(0,0,0,0.9)
    &>img
      width 100%
</style>
