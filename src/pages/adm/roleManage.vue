<template>
  <section @click="hideRight;showRight = false" class="h100">
    <h2 class="main-title">
      岗位角色管理
    </h2>
    <div class="condition" style="display:flex;align-items:center;">
      <span style="margin: 0 5px;white-space: nowrap">分类 </span>
      <el-select v-model="classify" placeholder="请选择分类" style="min-width:130px;width:180px;" @change="changeClassify">
          <el-option label="全部" value="0"></el-option>
         <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">危险源名称 </span>
      <el-select v-model="dangerName" placeholder="请选择危险源名称"  @change="changeDanger">
        <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div style="flex:1"></div>
      <div class="btn-area" style="display:flex;">
        <el-button type="primary" size="small" style="margin-left: 10px;font-size:13px;" @click="newTask">新建</el-button>
      </div>
    </div>
    <!-- end cond -->
    <div class="table">
      <template>
        <el-table :data="info.data" border style="width: 100%">
          <el-table-column type="selection" width="40">
          </el-table-column>
          <el-table-column prop="danger_type_name" label="分类">
          </el-table-column>
          <el-table-column prop="danger_name" label="危险源名称">
          </el-table-column>
          <el-table-column prop="position_name" label="岗位角色">
          </el-table-column>
          <el-table-column prop="user_lists" label="人员">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.native.stop="openRight(scope.row)">查看详情</el-button>
              <el-button type="text" @click.native.stop="modify(scope.row)">修改</el-button>
              <el-button type="text" @click.native.stop="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- end table -->
    <Pagi :page="page" :pageSize="pageSize" :count="info.count" @pageChange="pageChange" />
    <!-- end page -->
    <el-dialog :title="dialogInfo.title" width="500px" :visible.sync="dialogInfo.show" id="build-edit">
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>分类</el-col>
        <el-col :span="18">
          <el-select v-model="newClassify" placeholder="请选择分类" style="min-width:150px;width:150px;" @change="newClassifiesEvent">
             <el-option v-for="item in newClassifiecs" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>危险源</el-col>
        <el-col :span="18">
          <el-select v-model="newDangerName" placeholder="请选择危险源名称" style="min-width:250px;width:250px;" >
                <el-option v-for="item in newDangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>岗位角色名称</el-col>
        <el-col :span="18">
          <el-input type="text" placeholder="请输入岗位角色名称" v-model="position_name" style="min-width:250px;width:250px;"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>人员</el-col>
        <el-col :span="18">
               <div style="margin-bottom: 10px;">
              <template v-for="(person, index) in editInfo.member">
                <User style="margin: 0 5px 5px 0;" :key="person.id" :item="person" type="user" @removeTag="removeTag(index)" />
              </template>
          </div>
          <div style="margin-bottom: 15px;">
            <el-button type="primary" size="mini" @click="showDept = true">添加人员</el-button>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.show = false">取 消</el-button>
        <el-button type="primary" data-id='1' v-if="flag" @click="modifyNewRole">确 定</el-button>
        <el-button type="primary" data-id='2' v-if="!flag" @click="confirmNewRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end dialong -->
    <Right :show="showRight" @hideRight="hideRight" title="任务详情">
      <template slot="content">
          <div class="item">
            <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">分类</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{detail.danger_type_name}}
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">危险源名称</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{detail.danger_name}}
              </el-col>
            </el-row>
            <el-row>
              <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">岗位角色</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{detail.position_name}}
              </el-col>
            </el-row>
             </el-row>
              <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">人员</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{detail.user_lists}}
              </el-col>
            </el-row>
          </div>
      </template>
      <template slot="btn">
        <el-button type="primary" @click.native.stop="modify(detail)">修改</el-button>
        <el-button type="danger" @click.native.stop="del(detail)">删除</el-button>
      </template>
    </Right>
    <!-- end right -->
    <Dept model="user" :visible="showDept" :selected="{user: editInfo.member}"  @confirm="confirm" @updateVisible="updateVisible" />
  </section>
</template>
<script>
import Pagi from '@/components/pagi/'
import Right from '@/components/right/'
import common from '@/common/http'
import Dept from '@/pages/dept/'
import User from '@/pages/dept/user'
export default {
  data () {
    return {
      classify: '',
      newClassify: '',
      classifies: [],
      newClassifiecs: [],
      newDangers: [],
      position_name: '',
      dangerName: '',
      newDangerName: '',
      dangers: [],
      info: {
        data: [],
        count: 20
      },
      page: 1,
      pageSize: 10,
      dialogInfo: {
        title: '新建岗位角色',
        show: false
      },
      detail: '',
      showRight: false,
      showDept: false,
      editInfo: {
        member: []
      },
      flag: 1,
      position_id: ''
    }
  },
  components: {
    Pagi,
    Right,
    Dept,
    User
  },
  methods: {
    updateVisible (val) {
      this.showDept = val
    },
    confirm (choosen) {
      this.editInfo.member = choosen.user
    },
    removeTag (index) {
      this.editInfo.member.splice(index, 1)
    },
    async modify (row) {
      this.dialogInfo = {
        title: '修改巡检任务',
        show: true
      }
      this.dialogInfo.show = true
      let tmp = JSON.parse(JSON.stringify(row))
      console.log(tmp)
      let arr1 = []
      for (let i = 0; i < tmp.user_list.length; i++) {
        arr1.push({
          acct: tmp.user_list[i].acct,
          dept_list: tmp.user_list[i].dept_list,
          user_id: tmp.user_list[i].id,
          name: tmp.user_list[i].name,
          pic_url: tmp.user_list[i].pic_url
        })
      }
      console.log(tmp)
      this.newClassify = tmp.danger_type_id
      await this.addDangerList(tmp.danger_type_id)
      this.newDangerName = tmp.danger_id
      this.position_name = tmp.position_name
      this.position_id = tmp.position_id
      this.editInfo = {
        member: common.transferUserInfo(arr1) || []
      }
    },
    newTask () {
      this.dialogInfo = {
        title: '新建巡检任务',
        show: true
      }
      this.flag = 0
      this.dialogInfo.show = true
    },
    openRight (data) {
      this.detail = data
      console.log(data)
      this.showRight = true
    },
    hideRight () {
      this.showRight = false
    },
    pageChange (page) {
      this.page = page
      this.getTableList()
    },
    changeClassify (val) {
      if (val === '0') {
        this.dangerName = ''
        this.dangers = []
        this.getTableList()
      } else {
        this.getTableList()
        this.dangerList(val)
      }
    },
    newClassifiesEvent (val) {
      this.newDangerName = ''
      this.newDangers = []
      this.addDangerList(val)
    },
    changeDanger () {
      this.getTableList()
    },
    addDangerList (val) {
      let that = this
      let data = {
        danger_type_id: val,
        danger_id: 0,
        page: 1,
        page_size: 100000
      }
      common.reqS(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=105',
        data,
        res => {
          if (res.data.errcode === '0') {
            let data = res.data.data.list
            let arr = []
            for (let index in data) {
              let obj = {
                label: data[index].danger_name,
                value: data[index].danger_id
              }
              arr.push(obj)
            }
            that.newDangers = arr
          }
        }
      )
    },
    confirmNewRole () {
      this.flag = 0
      if (!this.newClassify) {
        this.$message({
          message: '分类不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (!this.newDangerName) {
        this.$message({
          message: '危险源源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (common.trim(this.position_name).length === 0) {
        this.$message({
          message: '岗位角色源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }

      let memberArr = []
      for (let j = 0; j < this.editInfo.member.length; j++) {
        memberArr.push(this.editInfo.member[j].id)
      }
      let data = {
        'danger_type_id': this.newClassify,
        'danger_id': this.newDangerName,
        'position_name': this.position_name,
        'user_ids': memberArr
      }
      common.req('/index.php?model=jlsafe&m=position&a=index&cmd=100', data, (res) => {
        if (res.data.errcode === '0') {
          this.$message({
            message: '新建成功',
            type: 'success',
            duration: 1000
          })
          this.not_empty()
          this.getTableList()
          this.dialogInfo.show = false
        } else {
          this.$message({
            message: '新建失败',
            type: 'error',
            duration: 1000
          })
          this.not_empty()
          this.dialogInfo.show = false
        }
      })
    },
    modifyNewRole () {
      this.flag = 1
      if (!this.newClassify) {
        this.$message({
          message: '分类不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (!this.newDangerName) {
        this.$message({
          message: '危险源源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (common.trim(this.position_name).length === 0) {
        this.$message({
          message: '岗位角色源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.editInfo.member.length === 0) {
        this.$message({
          message: '人员不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      let memberArr = []
      for (let j = 0; j < this.editInfo.member.length; j++) {
        memberArr.push(this.editInfo.member[j].id)
      }
      let data = {
        'danger_type_id': this.newClassify,
        'position_id': this.position_id,
        'danger_id': this.newDangerName,
        'position_name': this.position_name,
        'user_ids': memberArr
      }
      common.req('/index.php?model=jlsafe&m=position&a=index&cmd=101', data, (res) => {
        if (res.data.errcode === '0') {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
          this.not_empty()
          this.getTableList()
        } else {
          this.$message({
            message: '修改失败',
            type: 'error',
            duration: 1000
          })
          this.not_empty()
        }
      })
    },
    // 获取列表
    getTableList () {
      let data = {'danger_type_id': this.classify, 'danger_id': this.dangerName, 'page': this.page, 'page_size': 10}
      common.req('/index.php?model=jlsafe&m=position&a=index&cmd=104', data, (res) => {
        if (res.data.errcode === '0') {
          res.data.info['count'] = Number(res.data.info['count'])
          let List = res.data.info.data
          for (let key = 0; key < List.length; key++) {
            let arr = []
            if (List[key].user_list && List[key].user_list.length > 0) {
              for (let index = 0; index < List[key].user_list.length; index++) {
                let element
                for (let j = 0; j < List[key].user_list[index].dept_list.length; j++) {
                  element = '(' + List[key].user_list[index].dept_list[j].name + ', 工号:' + List[key].user_list[index].dept_list[j].id + ')'
                }
                arr.push(List[key].user_list[index].name + element)
              }
            }
            // 装换显示时间
            List[key]['user_lists'] = arr.join(',')
          }
          this.info = res.data.info
          console.log(res)
        }
      }
      )
    },
    // 获取分类
    getType () {
      let that = this
      this.$common.reqS(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=101', {}).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.data
          console.log(res)
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].danger_type_name,
              value: data[index].danger_type_id
            }
            arr.push(obj)
          }
          that.classifies = arr
          that.newClassifiecs = arr
        }
      })
    },
    dangerList (val) {
      let that = this
      let data = {
        danger_type_id: val,
        danger_id: 0,
        page: 1,
        page_size: 100000
      }
      common.req(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=105',
        data,
        res => {
          if (res.data.errcode === '0') {
            let data = res.data.data.list
            let arr = []
            for (let index in data) {
              let obj = {
                label: data[index].danger_name,
                value: data[index].danger_id
              }
              arr.push(obj)
            }
            that.dangers = arr
          }
        }
      )
    },
    not_empty () {
      this.newClassify = ''
      this.newDangerName = ''
      this.tagsArr = []
      this.position_name = ''
      this.dialogInfo.show = false
      this.editInfo = {
        member: []
      }
    },
    del (row) {
      console.log(row)
      this.$confirm('记录删除后将无法恢复!', '提示', {
        // confirmButtonText: '确定',
        // cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        common.req(
          '/index.php?model=jlsafe&m=position&a=index&cmd=102', {
            position_id: row.position_id
          },
          res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getTableList()
            this.showRight = false
          }
        )
      })
    }
  },
  watch: {
    'dialogInfo.show' (val) {
      if (!val) {
        this.not_empty()
      }
    }
  },
  created () {
    this.getTableList()
    this.getType()
  }
}
</script>
<style lang="less" scoped>
.condition {
  font-size: 14px;
  margin-bottom: 10px;
}
.el-input {
  width: 150px;
}
.table {
  margin: 25px 0;
}
.el-row {
  margin: 10px 0;
}
.lh28 {
  line-height: 28px;
}
pre {
  color: inherit;
  // line-height: 18px;
  font-family: inherit;
}
</style>
<style lang="less">
#edit {
  .el-dialog__body {
    padding: 10px 25px;
  }
  .el-input__inner {
    padding: 0 2px;
    font-size: 14px;
  }
}
</style>
