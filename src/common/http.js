import Vue from 'vue'
import axios from 'axios'
import { Message, Loading } from 'element-ui'
import qs from 'querystring'
//
// let test = process.env.NODE_ENV !== 'production' ? '&test=9135558' : ''

export default class common extends Vue {
  loadingInstance = {}
  static req (url, param, callback, errCallBack) {
    let that = this
    param = param || {}
    try {
      param = JSON.stringify(param)
    } catch (error) {
      console.log('in req')
    }
    this.lock()
    let _promise = new Promise(function (resolve, reject) {
      axios({
        method: 'POST',
        url: url,
        data: qs.stringify({ data: param })
      }).then((resp) => {
        if (resp.data.errcode === '-99999') {
          that.login()
          that.unlock()
          Message({
            showClose: true,
            message: resp.data.errmsg,
            duration: 1000,
            type: 'error'
          })
        } else {
          that.unlock()
          callback(resp)
        }
        resolve(true)
      }).catch((rep) => {
      })
    })
    return _promise
  }
  static reqS (url, param, callback, errCallBack) {
    let that = this
    param = param || {}
    try {
      param = JSON.stringify(param)
    } catch (error) {
      console.log('in req')
    }
    let _promise = new Promise(function (resolve, reject) {
      axios({
        method: 'POST',
        url: url,
        data: qs.stringify({ data: param })
      }).then((resp) => {
        if (resp.data.errcode === '-99999') {
          that.login()
          Message({
            showClose: true,
            message: resp.data.errmsg,
            duration: 1000,
            type: 'error'
          })
        } else {
          callback(resp)
        }
        resolve(true)
      }).catch((rep) => {
      })
    })
    return _promise
  }
  static login () {
    let p = {
      ajax_act: 'login',
      data: '{"acct":"admin","password":"adminpass","code":"","cache_acct":0}'
    }
    axios.post('/index.php?m=login', qs.stringify(p))
  }
  static trim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
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
  static transferUserInfo (userList) {
    if (!userList) {
      return []
    }
    return userList.map(val => {
      val.id = val.id
      return val
    })
  }
  static changeDateTime (arr) {
    return +new Date(arr) / 1000
  }
}
