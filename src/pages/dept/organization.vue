<template>
  <section id="dept-tree">
    <el-row :gutter="24">
      <el-col :span="model == 'org' ? 24 : 12" class="left">
        <el-tree
          ref="tree"
          :props="defaultProps"
          :load="loadNode"
          lazy
          node-key="id"
          @check-change="checkChange"
          @node-click="getUser"
          :expand-on-click-node="false"
          :show-checkbox="model == 'org' || model == 'both'"
          :check-strictly="true"
          :check-on-click-node="model == 'org'"
          :default-expand-all="false"
          empty-text="加载中...">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="12" style="border-left: 1px solid #eee;" v-if="model != 'org'">
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
  components: {
    UserList
  },
  data () {
    return {
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      initTreeData: [],
      userList: [],

      activeDept: 0,
      tmpChosen: this.chosen,
      loadingUser: false,
      hasClick: false
    }
  },
  methods: {
    // 获取节点方法
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.getTree(data => {
          this.initTreeData = data
          return resolve(data)
        })
      }
      if (node.level === 1) {
        let child = this.initTreeData[0]['children']
        this.basepaName = this.initTreeData[0]['name']

        return resolve(this.setLeaf(child))
      }
      if (node.level > 1) {
        if (node.data.isParent) {
          this.getTreeOver2(node.data, data => {
            return resolve(data)
          })
        } else {
          return resolve([])
        }
      }
      if (node.level === 3) {
        return resolve([])
      }
    },
    // 获取根树
    getTree (cb) {
      this.$common.lock()
      this.$common.reqSP('/index.php?model=member&m=ajax&cmd=125&target=main-tree', {}, res => {
        this.$common.unlock()
        cb(res.data.rec)
      })
    },
    // 获取超过2层的树
    getTreeOver2 (obj, cb) {
      this.$common.lock()
      this.$common.reqSP('/index.php?model=member&m=ajax&cmd=126', qs.stringify({
        id: obj.id,
        name: obj.name,
        level: obj.lev
      }), res => {
        this.$common.unlock()
        console.log(this.setLeaf(res.data.rec))
        cb(this.setLeaf(res.data.rec))
      })
    },
    // 设置是否为叶子还是树枝
    setLeaf (arr) {
      for (var index in arr) {
        if (arr[index].isParent) {
          arr[index].leaf = false
        } else {
          arr[index].leaf = true
        }
      }
      return arr
    },
    // 获取人员
    getUser (obj, node) {
      this.getUserByDeptId(obj.id)
    },
    // 根据id获取人员
    getUserByDeptId (id) {
      if (this.activeDept === id) { return false }
      this.hasClick = true
      this.loadingUser = true
      this.activeDept = id
      this.userList = []
      this.$common.reqSP('/index.php?model=jlnews&m=contact&a=get_user_tree&time=' + new Date().getTime(), qs.stringify({dept_id: id}), res => {
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
    },
    // 更新树的checkbox的选中
    updateTreeChecked () {
      let arr = []
      if (this.tmpChosen.org) {
        for (let deptId in this.tmpChosen.org) {
          arr.push(deptId)
        }
      }
      this.$refs.tree.setCheckedKeys(arr)
    },
    checkChange () {
      let list = this.$refs.tree.getCheckedNodes()
      this.tmpChosen['org'] = {}
      for (let index in list) {
        this.tmpChosen['org'][list[index].id] = list[index]
      }
      this.tmpChosen = this.$common.deep(this.tmpChosen)
    }
  },
  watch: {
    'chosen': function (val) {
      this.tmpChosen = val
      this.updateChecked('user')
      this.updateTreeChecked()
    },
    'tmpChosen': {
      deep: true,
      handler: function (val) {
        this.$emit('updateChosen', val)
      }
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#dept-tree{
  overflow-y: auto;
  overflow-x: hidden;
  .el-tree-node__content{
    position: relative;
    .el-checkbox{
      position: absolute;
      right: 0;
    }
  }
  .el-checkbox__inner{
    width: 16px;
    height: 16px;
    border: 1px solid #aaa;
  }
  .el-checkbox__inner::after{
    top: 2px;
    left: 5px;
  }
  .left, .right{
    padding: 0 15px;
    height: 225px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
