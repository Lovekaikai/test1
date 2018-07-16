import Vue from 'vue'
import Router from 'vue-router'
import adm from '@/pages/adm/index'
import dangerManage from '@/pages/adm/dangerManage'
import alertError from '@/pages/adm/alertError'
import alertMessage from '@/pages/adm/alertMessage'
import checkError from '@/pages/adm/checkError'
import checkRecord from '@/pages/adm/checkRecord'
import roleManage from '@/pages/adm/roleManage'
import taskManage from '@/pages/adm/taskManage'
import other from '@/pages/adm/other'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/adm'
    },
    {
      path: '/adm',
      name: 'adm',
      component: adm,
      redirect: '/dangerManage',
      children: [
        {
          path: '/dangerManage',
          name: 'dangerManage',
          component: dangerManage
        },
        {
          path: '/alertError',
          name: 'alertError',
          component: alertError
        },
        {
          path: '/alertMessage',
          name: 'alertMessage',
          component: alertMessage
        },
        {
          path: '/checkError',
          name: 'checkError',
          component: checkError
        },
        {
          path: '/checkRecord',
          name: 'checkRecord',
          component: checkRecord
        },
        {
          path: '/roleManage',
          name: 'roleManage',
          component: roleManage
        },
        {
          path: '/taskManage',
          name: 'taskManage',
          component: taskManage
        },
        {
          path: '/other',
          name: 'other',
          component: other
        }
      ]
    }
  ]
})
