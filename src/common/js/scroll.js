function scroll (x, y, el) {
  let preDis = 0
  const timer = setInterval(() => {
    const dis = x - el.scrollLeft
    if (Math.abs(dis) * 0.25 <= 1 || preDis === dis) {
      el.scrollTo(x, y)
      clearInterval(timer)
      return
    }
    if (preDis !== dis) {
      preDis = dis
    }
    el.scrollTo(el.scrollLeft + Math.floor(dis * 0.25), y)
  }, 10)
}

// 暴露此方法

export default scroll
