export const blurInput = {
  methods: {
    inputBlur () {
      const u = navigator.userAgent
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isIOS) {
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 200)
      }
    }
  }
}

export const countDown = {
  data() {
    return {
      codeTime: 60
    }
  },
  computed: {
    countText () {
      if (this.codeTime < 60 && this.codeTime > 0) return `${this.codeTime}s`
      return this.btnDefaultText || '获取验证码'
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    countDown () {
      this.$toast.success('发送成功')
      this.timer = setInterval(() => {
        if (this.codeTime <= 0) {
          clearInterval(this.timer)
          this.timer = null
          this.codeTime = 60
          return
        }
        this.codeTime--
      }, 1000)
    }
  }
}
