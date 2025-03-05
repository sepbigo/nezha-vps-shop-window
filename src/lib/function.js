function parseRemainingData(data) {
  let { amount, startDate, endDate, cycle, autoRenewal = 0 } = data
  const cycleValues = {
    年: 365,
    半年: 180,
    季: 90,
    月: 30,
  }
  let remainingPrice = 0.0

  let cycleValue = cycleValues[cycle]
  let nowTime = parseInt(new Date().getTime() / 1000)
  let beginTime = parseInt(new Date(startDate).getTime() / 1000)
  if (autoRenewal == '1') {
    let startDateFormat = new Date(startDate)
    let nowDate = new Date()
    let mSteps = {
      年: 12,
      半年: 6,
      季: 3,
      月: 1,
    }
    endDate = startDateFormat.setMonth(startDateFormat.getMonth() + mSteps[cycle])
    endDate = new Date(endDate)
    while (endDate.getTime() < nowDate.getTime()) {
      endDate = endDate.setMonth(endDate.getMonth() + mSteps[cycle])
      endDate = new Date(endDate)
    }
    endDate = endDate.toLocaleDateString('zh-CN').replace(/\//g, '-')
  }
  let endTime = parseInt(new Date(endDate).getTime() / 1000)
  let remainingDays = Math.floor((endTime - nowTime) / (24 * 60 * 60))
  const priceValue = amount.replace(/[$￥P€]/g, '')
  const priceUnit = amount.match(/[$￥P€]/g) ? amount.match(/[$￥P€]/g)?.[0] : '$'
  remainingPrice = (parseFloat(priceValue) / cycleValue) * remainingDays
  let aTime = nowTime - beginTime
  let bTime = endTime - beginTime
  let cTime = parseInt((aTime / bTime) * 100)
  if (!remainingPrice) {
    remainingPrice = 0.0
  }
  return {
    percent: cTime,
    day: remainingDays,
    date: endDate.split(' ')[0],
    remainingPrice: remainingPrice.toFixed(2),
    priceUnit,
    priceValue,
  }
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export { formatBytes, parseRemainingData }
