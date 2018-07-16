<template>
  <section id="dept-container" @click="search.show = false">
    <el-dialog title="人员选择器" :visible.sync="innerVisible">
      <div id="d-search">
        <template>
          <div class="dept" @click.stop>
            <template v-for="(items, key) in chosen">
              <template v-for="item in items">
                <User :item="item" :key="item.id" :type="key" @removeTag="removeTag(key, item.id)"/>
              </template>
            </template>
            <el-input v-model="search.keyword" placeholder="请输入关键字" @focus="search.show = true" class="h24"></el-input>
            <div class="res" v-show="search.show && search.keyword">
              <div style="text-align:center;" v-show="search.loading"><i class="el-icon-loading fs16"></i></div>
              <div style="text-align:center;font-size: 12px;" v-show="search['result'].length == 0 && !search.loading">没有找到条件下的人员</div>
              <template v-for="item in search['result']">
                <div class="item" :key="item.id">
                  <el-checkbox v-model="item.checked" @change="searchCheckedChange(item)">
                    <img style="padding-left: 5px;" class="tag-ava" :src="item.icon || 'static/img/face.png'" alt="">
                    {{item.name}}
                  </el-checkbox>
                </div>
              </template>
            </div>
          </div>
          <!-- end search -->
        </template>
      </div>
      <div id="d-menu">
        <el-tabs v-model="active">
          <el-tab-pane label="分组" name="group" v-if="model == 'user' || model == 'group' || model == 'both'">
            <Group
              ref="group"
              :max="max"
              :chosen.sync="chosen"
              :model="model"
              @updateChosen="updateChosen"
            />
          </el-tab-pane>
          <!-- group -->
          <el-tab-pane label="组织架构" name="org" v-if="model == 'user' || model == 'org' || model == 'both'">
            <Org
              ref="org"
              :max="max"
              :chosen.sync="chosen"
              :model="model"
              @orgChange="orgChange"
              @updateChosen="updateChosen"
            />
          </el-tab-pane>
          <!-- org -->
          <el-tab-pane label="批量搜索" name="bacth" v-if="model == 'user' || model == 'both'">
            <Batch :max="max" @batchConfirm="batchConfirm"/>
          </el-tab-pane>
          <!-- batch -->
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import qs from 'querystring'
import Batch from './batch.vue'
import Group from './group.vue'
import User from './user.vue'
import Org from './organization.vue'

export default {
  props: {
    'visible': {
      type: Boolean,
      default: false
    },
    'max': {
      type: Number,
      default: 0
    },
    'model': {
      type: String,
      default: 'both' // org group user
    },
    'selected': {
      type: Object,
      default: function () {
        return {
          org: [],
          user: [],
          group: []
        }
      }
    }
  },
  data () {
    return {
      innerVisible: false,
      active: '',
      search: {
        show: false,
        keyword: '',
        loading: false,
        result: []
      },
      chosen: {},
      count: 1
    }
  },
  components: {
    Batch,
    Group,
    Org,
    User
  },
  methods: {
    remoteMethod () {
      this.search['result'] = []
      this.search['loading'] = true
      let date = new Date()
      this.$common.reqSP('/index.php?model=process&m=contact&a=get_search_tree&time=' + date.getTime(), qs.stringify({ q: this.search.keyword }), res => {
        this.search['result'] = res.data.rec.map((val) => {
          val.checked = this.chosen.user[val.id] && this.chosen.user[val.id].id === val.id
          return val
        })
        console.log(this.search['result'])
        this.search['loading'] = false
      })
    },
    batchConfirm (data) {
      for (let key in data) {
        this.chosen.user[data[key].id] = data[key]
      }
      this.forceUpdate()
    },
    orgChange (nodes) {
      this.chosen.org = nodes
    },
    updateChosen (data) {
      this.chosen = data
    },
    getChosenLength (data) {
      let count = 0
      for (let key in data) {
        console.log(data[key])
        count = count + Object.keys(data[key]).length
      }
      return count
    },
    searchCheckedChange (item) {
      if (item.checked) {
        this.chosen.user[item.id] = item
      } else if (this.chosen.user[item.id]) {
        delete this.chosen.user[item.id]
      }
    },
    removeTag (key, id) {
      delete this.chosen[key][id]
      this.forceUpdate()
    },
    confirm () {
      this.innerVisible = false
      let obj = {}
      let tmp = this.$common.deep(this.chosen)
      for (let key in tmp) {
        obj[key] = []
        for (let index in tmp[key]) {
          obj[key].push(tmp[key][index])
        }
      }
      this.$emit('confirm', obj)
    },
    transferSelectedToObj () {
      console.log(this.selected)
      for (let key in this.selected) {
        const selected = this.selected[key]
        this.chosen[key] = {}
        selected.map(val => {
          this.chosen[key][val.id] = val
        })
      }
    },
    forceUpdate () {
      this.chosen = this.$common.deep(this.chosen)
    }
  },
  watch: {
    'search.keyword': function (val) {
      if (val) {
        this.remoteMethod()
      }
    },
    'visible': function (val) {
      this.innerVisible = val
    },
    'innerVisible': function (val) {
      if (!val) {
        this.search.keyword = ''
        this.search.result = []
      }
      this.$emit('updateVisible', val)
      this.forceUpdate()
    },
    'selected': function (val) {
      this.transferSelectedToObj()
    }
  },
  created () {
    this.active = this.model === 'both' || this.model === 'user' ? 'group' : this.model ? this.model : 'group'
    // this.active = 'org'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.ava{
  position: relative;
  top: 5px;
}
.res{
  position: absolute;
  width: calc(100% - 100px);
  background: #fff;
  z-index: 9999;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 3px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  .item{
    padding: 3px 0;
  }
}
</style>
<style lang="less">
#dept-container{
  .el-dialog__body{
    padding: 15px 20px;
    margin-bottom: 5px;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
  }
  .tag-ava{
    position: relative;
    width: 18px;
    height: 18px;
    top: 4px;
    margin-left: -5px;
  }
  .el-tabs__nav>div[role="tab"]{
    padding: 0 25px;
  }
  .is-active{
    border-bottom: 2px solid;
  }
  .el-input__inner{
    border: 0;
  }
  .h24 input{
    height: 24px;
  }
}
.dept{
  .el-tag{
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .el-input{
    width: 50%;
  }
}
</style>
