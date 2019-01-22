export function initDate() {
  let month = new Date().getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = new Date().getDate()
  if (day < 10) {
    day = '0' + day
  }
  return (new Date().getFullYear() + '-' + month + '-' + day)
}

export function getPickerOptions() {
  return {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }
}

