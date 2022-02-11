<template>
  <div class="back-header" :style="{height: '44px', color: color}">
    <van-icon @click="goBack" class="back-btn" name="arrow-left" />
    <h4>{{ title }}</h4>
    <div class="right-slot">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'back-header',
  props: {
    title: {
      type: String,
      default: ''
    },
    canBack: {
      type: Boolean,
      default: true
    },
    delta: {
      type: Number,
      default: -1
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="stylus">
.back-header
  position fixed
  left 0
  top 0
  width 100%
  display flex
  justify-content space-between
  align-items center
  z-index 9
  background-color #fff
  color #000
  .back-btn
    padding 10px 30px
    font-size 33px
    font-weight bold
  &>h4
    font-weight 400
    font-size 36px
  .right-slot
    min-width 93px
</style>
