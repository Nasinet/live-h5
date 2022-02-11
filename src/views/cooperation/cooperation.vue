<template>
  <div class="cooperation">
    <van-icon @click="$router.back()" class="back-icon" name="arrow-left" size="0.44rem" color="#fff" />
    <img src="./tittle@2x.png" alt="" class="title">
    <div class="connect">
      <div class="item">
        <img src="./kefu@2x.png" alt="">
        <p>联系电话：{{appConfig.service_phone}}</p>
      </div>
      <div class="item">
        <img src="./email@2x.png" alt="">
        <p>联系邮箱：{{ appConfig.service_email }}</p>
      </div>
      <div class="item">
        <img src="./qq@2x.png" alt="">
        <p>联系QQ：{{ appConfig.service_qq }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'cooperation',
  computed: {
    ...mapState(['appConfig'])
  }
}
</script>

<style scoped lang="stylus">
.cooperation
  width 100%
  height 100%
  background url(./bg1@2x.png) center center no-repeat
  background-size cover
  position relative
  .back-icon
    position fixed
    padding-left 20px
    left 10px
    top 30px
  .title
    width 288px
    height 55px
    position absolute
    bottom 511px
    left 50%
    transform translateX(-50%)
  .connect
    position absolute
    bottom 74px
    left 0
    width 705px
    height 375px
    box-sizing border-box
    padding-top 39px
    padding-left 103px
    background url(./bg2@2x.png) center center no-repeat
    background-size 100% 100%
    &>p
      margin-bottom 57px
      padding-left 208px
      font-size 26px
      color #343434
    .item
      display flex
      align-items center
      margin-bottom 24px
      &:nth-child(1)
        margin-bottom 7px
      &>img
        margin-right 18px
        width 60px
        height 60px
      &>p
        font-size 26px
        color #343434
</style>
