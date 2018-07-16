<template>
  <section id="main">
    <LeftMenu icon="el-icon-date" title="行政系统" :menuList="leftMenuList" />
    <!-- end left menu -->
    <div id="container">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import LeftMenu from '@/components/leftMenu/'

export default {
  data () {
    return {
      leftMenuList: [{
        label: '危险源管理',
        link: '/dangerManage',
        key: 'jlmanage_list_WaterMeter'
      }, {
        label: '岗位角色管理',
        link: '/roleManage',
        key: 'jlmanage_list_FixApplication'
      }, {
        label: '任务管理',
        link: '/taskManage',
        key: 'jlmanage_list_Other'
      }, {
        label: '巡检记录',
        link: '/checkRecord',
        key: 'jlmanage_list_Other'
      }, {
        label: '巡检异常项目',
        link: '/checkError',
        key: 'jlmanage_list_Other'
      }, {
        label: '报警异常记录',
        link: '/alertError',
        key: 'jlmanage_list_Other'
      }, {
        label: '报警推送消息',
        link: '/alertMessage',
        key: 'jlmanage_list_Other'
      }, {
        label: '其他配置',
        link: '/other',
        key: 'jlmanage_list_Other'
      }]
    }
  },
  components: {
    LeftMenu
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/') {
      sessionStorage.setItem('isInit', true)
    }
    next()
  },
  methods: {
  },
  created () {
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lange="less">
#container {
  width: calc(100% - 340px);
  margin-left: 300px;
  overflow: hidden;
}
</style>
