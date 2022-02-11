<template>
  <div class="about" style="padding-top: 44px;">
    <back-header title="关于我们" />
    <img src="./logo@2x.png" alt="">
    <p class="version">最新版本：{{ isIos ? $store.state.appConfig.version_ios : $store.state.appConfig.version_android }}</p>
    <p class="net">{{ $store.state.appConfig.site_domain }}</p>
    <div class="connect">
      <p>客服电话</p>
      <span>{{ $store.state.appConfig.service_phone }}</span>
    </div>
    <div class="connect">
      <p>客服QQ</p>
      <span>{{ $store.state.appConfig.service_qq }}</span>
    </div>
    <div class="connect">
      <p>客服邮箱</p>
      <span>{{ $store.state.appConfig.service_email }}</span>
    </div>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'

export default {
  name: 'about',
  components: {
    BackHeader
  },
  created () {
    document.title = '关于我们'
  },
  computed: {
    isIos() {
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      return isiOS
    }
  }
}
</script>

<style scoped lang="stylus">
  .about
    box-sizing border-box
    &>img
      display block
      width 237px
      padding-top 20px
      margin 0 auto
      margin-bottom 13px
      height 237px
    .version
      margin-bottom 36px
      text-align center
      font-size 30px
      color #333333
    .net
      margin-bottom 97px
      text-align center
      font-size 26px
      color #666666
    .connect
      margin 0 30px
      display flex
      justify-content space-between
      height 117px
      align-items center
      font-size 30px
      border-top 1px solid #EEEEEE
      &:last-child
        border-bottom 1px solid #EEEEEE
      &>p
        color #333333
      &>span
        color #666
</style>
