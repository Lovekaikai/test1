<template>
  <section id="group">
    <el-row :gutter="24">
      <el-col :span="model == 'group' ? 24 : 12">
        <div class="left">
          <template v-for="group in groupList">
            <div class="group" :class="{active: group.id == activeGroup}" :key="group.id" @click="getUserByGroupId(group.id)">
              <span>{{group.name}}</span>
              <span @click.stop="() => {}" v-if="model == 'both' || model=='group'">
                <el-checkbox size="medium" v-model="group.checked" @change="change(group, 'group')"></el-checkbox>
              </span>
            </div>
          </template>
          <div>
            <div class="right-empty" v-show="loadingGroup">
              加载中...
            </div>
          </div>
          <div>
            <div style="text-align: center;" v-show="!loadingGroup && groupList.length == 0">
              当前没有分组
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="border-left: 1px solid #eee;" v-if="model != 'group'">
        <div class="right">
          <UserList
            :userList.sync='userList'
            :loadingUser.sync='loadingUser'
            :hasClick.sync='hasClick'
            @change="change"
          />
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import UserList from './userList.vue'
import qs from 'querystring'

export default {
  props: ['chosen', 'model', 'max'],
  data () {
    return {
      groupList: [], // 分组列表
      userList: [], // 人员列表
      tmpChosen: this.chosen, // 临时选中的值
      loadingGroup: true, // 左侧文案相关
      loadingUser: false, // 右侧文案相关
      hasClick: false, // 右侧文案相关
      activeGroup: 0 // 阻止重复点击
    }
  },
  components: {
    UserList // 右侧人员列表
  },
  methods: {
    // 获取分组列表
    getGroupList () {
      this.$common.reqSP('/index.php?model=process&m=contact&a=get_group_tree&time=' + new Date().getTime(), {}, res => {
        this.loadingGroup = false
        this.groupList = res.data.data
        this.updateChecked('group')
      })
    },
    // 根据分组id获取人员
    getUserByGroupId (gid) {
      if (this.activeGroup === gid) { return false }
      this.hasClick = true
      this.loadingUser = true
      this.userList = []
      this.activeGroup = gid
      this.$common.reqSP('/index.php?model=jlnews&m=contact&a=get_user_by_group&time=' + new Date().getTime(), qs.stringify({gid: gid}), res => {
        this.loadingUser = false
        this.userList = res.data.rec
        this.updateChecked('user')
      })
    },
    // 分组和人员选中或者取消选中
    change (data, type) {
      if (data.checked) {
        if (this.max && Object.keys(this.tmpChosen[type]) + 1 > this.max) {
          this.$common.error('最多只能选择' + this.max + '个选项!')
        } else {
          if (!this.tmpChosen[type]) { this.tmpChosen[type] = {} } // 如果没有, 创建一个
          this.tmpChosen[type][data.id] = data
        }
      } else {
        delete this.tmpChosen[type][data.id]
      }
      this.tmpChosen = this.$common.deep(this.tmpChosen)
    },
    // 更新选择状态
    updateChecked (type) {
      const listName = type + 'List'
      const list = this[listName]
      for (let index in list) {
        const targ = this.chosen[type]
        list[index].checked = Boolean(targ && targ[list[index].id])
      }
      this[type + 'List'] = this.$common.deep(list)
    }
  },
  watch: {
    'chosen': function (val) {
      this.tmpChosen = val
      this.updateChecked('user')
      this.updateChecked('group')
    },
    'tmpChosen': {
      deep: true,
      handler: function (val) {
        this.$emit('updateChosen', val)
      }
    }
  },
  created () {
    this.getGroupList()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#group{
  .left, .right{
    padding: 0 15px;
    height: 225px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.group{
  cursor: pointer;
  padding: 5px;
  .el-checkbox{
    float: right;
  }
  .name{
    position: relative;
    margin-left: 3px;
    top: -5px;
  }
}
.group.active{
  background: #efefef;
}
</style>
