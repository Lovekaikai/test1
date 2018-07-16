import { Message, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import qs from 'querystring'

export default class Common {
  defaultUserIcon = './static/img/user.png'
  loadingInstance = {}

  static req (url, param, callback, errCallback) {
    // Common.login()
    let that = this
    let prefix = ''
    this.lock()
    param = param || {}

    try {
      param = JSON.stringify(param)
    } catch (e) {
      console.log('in req')
      console.error(e)
    }
    let _promise = new Promise(function (resolve, reject) {
      axios({
        url: prefix + url,
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          data: param
        })
      })
        .then(res => {
          that.unlock()
          if (res.data.errcode === '0') {
            if (callback && typeof callback === 'function') {
              callback(res, Common.undo)
            } else {
              // that.error('错了哦，这是一条错误消息')
            }
            resolve(res)
          } else {
            console.log(errCallback)
            if (errCallback && typeof errCallback === 'function') {
              errCallback(res)
            } else {
              that.error(res.data.errmsg)
            }
          }
        })
        .catch(res => {
          that.unlock()
          console.log('请求失败')
          reject(res)
        })
    })
    return _promise
  }

  // slient
  static reqS (url, param) {
    // this.login()
    param = param || {}
    try {
      param = JSON.stringify(param)
    } catch (e) {
      console.log('in req')
      console.error(e)
    }
    let _promise = new Promise(function (resolve, reject) {
      axios({
        url: url,
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
          data: param
        })
      })
        .then(res => {
          resolve(res)
        })
        .catch(res => {
          reject(res)
        })
    })
    return _promise
  }

  // special param
  static reqSP (url, param, callback, errCallback) {
    let _promise = new Promise(function (resolve, reject) {
      axios({
        url: url,
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: param
      })
        .then(res => {
          if (Number(res.data.errcode) === 0) {
            if (callback && typeof callback === 'function') {
              callback(res)
            }
            resolve(res)
          } else {
            if (errCallback && typeof errCallback === 'function') {
              errCallback(res)
            }
          }
        })
        .catch(res => {
          console.log('请求失败')
          reject(res)
        })
    })
    return _promise
  }

  static login () {
    console.error('自动登陆一下!')
    let p = {
      ajax_act: 'login',
      data:
        '{"acct":"15766273878","password":"111111","code":"","cache_acct":0}'
    }
    axios.post('/index.php?m=login', qs.stringify(p))
  }

  static lock () {
    this.loadingInstance = Loading.service({
      lock: true,
      text: ''
    })
  }

  static unlock () {
    this.loadingInstance.close()
  }

  static trim (str) {
    return str.replace(/ /g, '')
  }
  static closeMessage () {
    Message.close()
  }

  static translateTimeStampToLocalDate (timestamp) {
    let date = new Date(parseInt(timestamp) * 1000)
    // 2017 / 02 / 02 10: 42
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    return `${year}-${this.add0(month + 1)}-${this.add0(day)} ${this.add0(
      hour
    )}:${this.add0(min)}`
  }

  static transferUserInfo (userList) {
    if (!userList) {
      return []
    }
    return userList.map(val => {
      val.id = val.user_id
      return val
    })
  }

  static unique (arr) {
    let unique = {}
    arr.forEach(function (item) {
      unique[JSON.stringify(item)] = item
    })
    arr = Object.keys(unique).map(function (u) {
      return JSON.parse(u)
    })
    return arr
  }
  static goBack () {
    this.$router.go(-1)
  }
  static error (msg) {
    Message({
      customClass: 'err',
      type: 'error',
      message: msg,
      duration: 1500,
      showClose: true
    })
  }
  static deep (obj) {
    try {
      return JSON.parse(JSON.stringify(obj))
    } catch (e) {
      console.log(e)
      return obj
    }
  }
  static wrap (str) {
    if (!str) {
      return str
    }
    return str.replace(/\n/g, '<br>')
  }
  static add0 (num) {
    return num < 10 ? '0' + num : num
  }
  static changeDateTime (arr) {
    return +new Date(arr) / 1000
  }
}
