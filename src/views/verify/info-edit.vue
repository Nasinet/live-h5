<template>
  <div class="info-edit">
    <div class="input" @click="showSexPicker=true">
      <label>性别</label>
      <p :class="{active: form.gender !== null}">{{ form.gender === null ? '请选择性别' : sex[form.gender].text }} <van-icon name="arrow" /></p>
    </div>
    <div class="input">
      <label>年龄</label>
      <input v-model="form.age" type="text" placeholder="请输入年龄">
    </div>
    <div class="input">
      <label>身高</label>
      <input v-model="form.height" type="text" placeholder="请输入身高(cm)">
    </div>
    <div class="input">
      <label>体重</label>
      <input v-model="form.weight" type="text" placeholder="请输入体重(kg)">
    </div>
    <div class="input" @click="showConsPicker=true">
      <label>星座</label>
      <p :class="{active: form.constellation}">{{ form.constellation || '请选择星座' }} <van-icon name="arrow" /></p>
    </div>
    <div class="input">
      <label>职业</label>
      <input v-model="form.career" type="text" placeholder="请输入职业">
    </div>
    <div class="input">
      <label>城市</label>
      <input v-model="form.city" type="text" placeholder="请输入城市">
    </div>
    <h4>个性签名</h4>
    <textarea placeholder="请编辑个性签名" v-model="form.signature"></textarea>
    <div class="btn" @click="submit">提交申请</div>
    <van-popup v-model="showSexPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="sex"
        @confirm="confirmSex"
      />
    </van-popup>
    <van-popup v-model="showConsPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="constellations"
        @confirm="confirmCon"
      />
    </van-popup>
  </div>
</template>

<script>
import { post } from '../../common/js/http'

export default {
  name: 'info-edit',
  data() {
    return {
      showSexPicker: false,
      showConsPicker: false,
      sex: [{ text: '女', type: 0 }, { text: '男', type: 1 }],
      constellations: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
      form: {
        gender: null,
        age: '',
        height: '',
        weight: '',
        constellation: '',
        city: '',
        signature: '',
        career: ''
      }
    }
  },
  methods: {
    confirmSex(res) {
      this.form.gender = res.type
      this.showSexPicker = false
    },
    confirmCon(res) {
      this.form.constellation = res
      this.showConsPicker = false
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
  .info-edit
    .input
      padding 0 30px
      height 123px
      display flex
      align-items center
      border-bottom 1px solid #F4F4F4
      &>label
        font-size 30px
        color #666666
      &>p
        flex 1
        display flex
        align-items center
        justify-content flex-end
        font-size 30px
        color #B4B4B4
        &.active
          color #000
      &>input
        flex 1
        text-align right
        font-size 30px
        color #000
        &::-webkit-input-placeholder
          color #B4B4B4
    &>h4
      margin-bottom 45px
      padding 0 30px
      padding-top 48px
      font-size 30px
      color #666666
    &>textarea
      width 100%
      height 108px
      line-height 36px
      box-sizing border-box
      padding 0 30px
      font-size 30px
      &::-webkit-input-placeholder
        color #B4B4B4
    .btn
      margin 0 61px
      margin-bottom 54px
      height 100px
      line-height 100px
      text-align center
      border-radius 50px
      background $theme-color
      font-size 32px
      color #FEFFFF
</style>
