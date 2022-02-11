<template>
  <div class="verify">
    <step :step="step" />
    <div class="phone" v-if="step===1">
      <img src="./bg@2x.png" alt="">
      <p>您的账号已绑定手机号，可直接进入下一步。</p>
      <div class="btn" @click="step++">下一步</div>
    </div>
    <id-card @next="step++" v-if="step===2" />
    <info-edit v-if="step===3" />
  </div>
</template>

<script>
import Step from './step'
import IdCard from './id-card'
import InfoEdit from './info-edit'

export default {
  name: 'verify',
  components: {
    Step,
    IdCard,
    InfoEdit
  },
  data() {
    return {
      step: 1
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.phone
  margin-top 138px
  text-align center
  &>img
    width 455px
    height 380px
  &>p
    margin-top 55px
    margin-bottom 65px
    font-size 28px
    color #A1A1A1
  .btn
    margin 0 61px
    height 100px
    line-height 100px
    border-radius 50px
    background $theme-color
    font-size 32px
    color #FEFFFF
</style>
