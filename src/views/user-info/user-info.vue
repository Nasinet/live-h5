<template>
  <div class="user-info" style="padding-top: 44px;">
    <back-header title="个人资料" />
    <div class="input no-border">
      <label>头像</label>
      <div style="flex: 1;"></div>
      <img @click="clickFile" v-if="!form.avatar" :src="userInfo.avatar || $store.state.defaultAvatar" alt="">
      <img @click="clickFile" :src="form.avatar" v-else alt="">
      <van-icon name="arrow" class="allow-icon" />
    </div>
    <div class="input">
      <label>昵称</label>
      <input type="text" v-model="form.nick_name" :placeholder="userInfo.nick_name">
      <van-icon name="arrow" class="allow-icon" />
    </div>
    <div class="input">
      <label>ID</label>
      <p>{{ userInfo.id }}</p>
      <van-icon name="arrow" class="allow-icon" />
    </div>
    <div class="input">
      <label>手机号</label>
      <p>{{ userInfo.account }}</p>
      <van-icon name="arrow" class="allow-icon" />
    </div>
    <div class="input">
      <label>个性签名</label>
      <input type="text" v-model="form.signature" :placeholder="userInfo.profile.signature">
      <van-icon name="arrow" class="allow-icon" />
    </div>
    <div class="submit" @click="submit">保存</div>
    <p class="tips">严禁上传任何违反国家法律法规内容</p>
    <input type="file" @change="upload" ref="file" v-show="false">
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import { mapState } from 'vuex'
import cos from '../../common/js/cos'
import { post } from '../../common/js/http'

export default {
  name: 'user-info',
  components: {
    BackHeader
  },
  data() {
    return {
      form: {
        avatar: '',
        nick_name: '',
        signature: ''
      }
    }
  },
  computed: {
    ...mapState(['userInfo', 'appConfig'])
  },
  methods: {
    clickFile() {
      this.$refs.file.click()
    },
    upload() {
      const file = this.$refs.file.files[0]
      if (file.type.indexOf('image') < 0) {
        this.$toast.fail('请选择图片文件')
        return
      }
      const loading = this.$toast.loading()
      const cosObj = cos()
      cosObj.putObject({
        Bucket: this.appConfig.cos_bucket,
        Region: this.appConfig.cos_region,
        Key: this.appConfig.cos_folder_image + `/${file.name}`,
        Body: file
      }, (err, data) => {
        loading.close()
        if (err) {
          this.$toast.fail('上传失败')
          return
        }
        this.from.avatar = 'https://' + data.Location
        this.$refs.file.value = ''
      })
    },
    submit() {
      post('/api/User/editUserInfo', this.form)
        .then(() => {
          this.$router.back()
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.user-info
  height 100%
  position relative
  box-sizing border-box
  background #F4F4F4
  .input
    padding 0 30px
    display flex
    height 120px
    align-items center
    background #fff
    border-bottom 1px solid #F4F4F4
    &.no-border
      border-bottom none
    &>label
      font-size 30px
      color #666666
    &>img
      width 120px
      height 120px
      border-radius 50%
    &>p
      flex 1
      font-size 30px
      color #333333
      text-align right
    &>input
      flex 1
      font-size 30px
      color #333333
      text-align right
    .allow-icon
      margin-left 27px
      font-size 25px
  .submit
    position absolute
    width 364px
    height 75px
    line-height 75px
    border-radius 38px
    background $theme-color
    text-align center
    color #fff
    bottom 112px
    left 50%
    transform translateX(-50%)
    font-size 32px
  .tips
    position absolute
    left 50%
    bottom 36px
    white-space nowrap
    transform translateX(-50%)
    font-size 24px
    color #787878
</style>
