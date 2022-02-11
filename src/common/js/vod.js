import { post } from './http'

function getSignature() {
  return post('/webapi/config/getSignForVod', { hideLoading: true })
    .then(({ data: { data } }) => {
      return data.signature
    })
}

const createVod = () => {
  // eslint-disable-next-line new-cap
  return new window.TcVod.default({
    getSignature: getSignature // 前文中所述的获取上传签名的函数
  })
}

export default createVod
