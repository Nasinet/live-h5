<template>
  <div :class="['sex', gender === 1 && 'man']">
    <i :class="{iconfont: true, 'icon-nv': gender === 0, 'icon-nan': gender === 1}"></i>
    <span>{{ age }}</span>
  </div>
</template>

<script>
export default {
  name: 'user-gender',
  props: {
    gender: {
      type: Number,
      default: 0
    },
    age: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped lang="stylus">
  .sex
    margin-left 7px
    border-radius 3px
    width 42px
    height 26px
    line-height 26px
    text-align center
    font-size 16px
    color #FFFFFF
    background #FF9CE4
    &.man
      background #70CAFF
    .iconfont
      margin-right 0 !important
      font-size 16px
      color #fff
</style>
