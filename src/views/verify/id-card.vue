<template>
  <div class="id-card">
    <div class="input">
      <label>真实姓名</label>
      <input type="text" v-model="real_name" placeholder="请输入真实姓名">
    </div>
    <div class="input">
      <label>身份证号</label>
      <input type="text" v-model="id_num" placeholder="请输入身份证号">
    </div>
    <div class="upload">
      <h4><i></i>身份验证</h4>
      <div class="imgs">
        <img :src="id_card_url[0]" @click="clickFile(0)" alt="">
        <img :src="id_card_url[1]" @click="clickFile(1)" alt="">
        <img :src="id_card_url[2]" @click="clickFile(2)" alt="">
      </div>
      <div class="texts">
        <p>身份证正面</p>
        <p>身份证背面</p>
        <p>手持身份证</p>
      </div>
    </div>
    <p class="tips"><span>温馨提示：</span>
      请确保姓名、身份证号清晰可见，这可以帮助客服人
      员快速通过你的申请
    </p>
    <div @click="submit" class="btn">下一步</div>
    <input @change="upload" type="file" ref="file" v-show="false">
  </div>
</template>

<script>
import cos from '../../common/js/cos'
import { mapState } from 'vuex'
import { post } from '../../common/js/http'

export default {
  name: 'id-card',
  data() {
    return {
      real_name: '',
      id_num: '',
      id_card_url: [require('./zhengmian@2x.png'), require('./fanmian@2x.png'), require('./shouchi@2x.png')],
      imgIndex: 0
    }
  },
  computed: {
    ...mapState(['appConfig'])
  },
  methods: {
    clickFile(index) {
      this.imgIndex = index
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
        this.id_card_url[this.imgIndex] = 'https://' + data.Location
        this.$refs.file.value = ''
      })
    },
    submit() {
      if (!this.real_name) {
        this.$toast.fail('请输入真实姓名')
        return
      }
      if (!this.id_num) {
        this.$toast.fail('请输入身份证号')
        return
      }
      if (!this.id_card_url.some(item => item.indexOf('https') === 0)) {
        this.$toast.fail('请上传身份信息')
        return
      }
      post('/api/auth/identityAuth', {
        real_name: this.real_name,
        id_num: this.id_num,
        id_card_url: this.id_card_url.join(',')
      })
        .then(() => {
          this.$emit('next')
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.id-card
  padding 0 30px
  .input
    height 114px
    display flex
    align-items center
    &>label
      font-size 30px
      color #666666
    &>input
      flex 1
      height 114px
      line-height 114px
      font-size 30px
      text-align right
  .upload
    &>h4
      display flex
      align-items center
      margin-top 39px
      margin-bottom 25px
      font-size 30px
      color #333333
      &>i
        margin-right 12px
        width 5px
        height 22px
        background #F06E1E
    .imgs, .texts
      display flex
      justify-content space-between
      &>img
        width 224px
        height 146px
      &>p
        margin-top 11px
        width 224px
        font-size 24px
        color #959595
        text-align center
  .tips
    margin 0 40px
    margin-top 53px
    line-height 36px
    font-size 24px
    color #959595
    &>span
      color #FF3B3B
  .btn
    margin 0 61px
    margin-top 179px
    height 100px
    line-height 100px
    border-radius 50px
    background $theme-color
    font-size 32px
    color #FEFFFF
    text-align center
</style>
