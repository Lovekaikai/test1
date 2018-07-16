<template>
  <section class="h100" @click="hideRight;showRight = false">
    <h2 class="main-title">
      巡检记录
    </h2>
    <div class="condition" style="display:flex;align-items:center;">
      <span style="margin: 0 5px;white-space: nowrap">分类 </span>
      <el-select v-model="classify" placeholder="请选择分类" @change="changeClassify">
        <el-option label="全部" value="0"></el-option>
        <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">危险源名称 </span>
      <el-select v-model="dangerName" placeholder="请选择危险源名称" @change="changeDanger">
        <el-option label="全部" value="0" v-if="dangers.length>0"></el-option>
        <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">岗位角色 </span>
      <el-select v-model="role" placeholder="请选择岗位角色" @change="changeUser">
        <el-option label="全部" value="0" v-if="roles.length>0"></el-option>
        <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">状态 </span>
      <el-select v-model="status" placeholder="请选择状态" @change="changeStatus">
        <el-option v-for="item in statuses" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">日期 </span>
     <el-date-picker
      v-model="date"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期" @change="datePicker" value-format="yyyy-MM-dd">
    </el-date-picker>
      </div>
    <!-- end cond -->
    <div class="table">
      <template>
        <el-table :data="info.list" border style="width: 100%">
          <el-table-column type="selection" width="40">
          </el-table-column>
          <el-table-column prop="danger_type_name" label="分类">
          </el-table-column>
          <el-table-column prop="danger_name" label="危险源名称">
          </el-table-column>
          <el-table-column prop="patrol_time" label="巡检日期">
          </el-table-column>
          <el-table-column prop="mission_time" label="任务时间">
          </el-table-column>
          <el-table-column prop="patrol_time2" label="巡检时间">
          </el-table-column>
          <el-table-column prop="patrol_location" label="地理位置">
          </el-table-column>
          <el-table-column prop="position_name" label="岗位角色">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click.native.stop="recordDetail(scope.row)">记录详情</el-button>
              <el-button type="text" @click.native.stop="textDetail(scope.row)">内容详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <Right :show="showRight" @hideRight="hideRight" :title="title">
      <template slot="content" v-if="!flag">
            <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">分类</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                  {{recordObj.danger_type_name}}
              </el-col>
            </el-row>
               <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">危险源名称</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{recordObj.danger_name}}
              </el-col>
            </el-row>
               <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">巡检日期</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{recordObj.patrol_time}}
              </el-col>
            </el-row>
               <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">巡检时间</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{recordObj.patrol_time2}}
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">任务时间</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                {{recordObj.mission_time}}
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">巡检员</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                <template v-if="patrol_user_info.length>0">
                  {{patrol_user_info[2]}} ({{patrol_user_info[1]}} 工号：{{patrol_user_info[0]}})
                </template>
              </el-col>
            </el-row>
                <el-row :gutter="20">
              <el-col style="text-align: right;color:#9b9b9b;" :span="8">巡检照片</el-col>
              <el-col style="color:#4a4a4a;" :span="16">
                <template v-if="recordObj.files&&recordObj.files.length>0">
                    <img :src="item" alt="" srcset="" v-for="(item,index) in recordObj.files" :key="index" >
                </template>
              </el-col>
            </el-row>
      </template>
      <template slot="content" v-if="flag">
      </template>
    </Right>
    <!-- end table -->
    <Pagi :page="page" :pageSize="pageSize" :count="count" @pageChange="pageChange" />
    <!-- end page -->
  </section>
</template>
<script>
import Pagi from '@/components/pagi/'
import common from '@/common/http'
import Right from '@/components/right/'
export default {
  data () {
    return {
      date: '',
      classify: '',
      classifies: [],
      dangerName: '',
      dangers: [],
      role: '',
      roles: [],
      status: '',
      statuses: [{ label: '全部', value: -1 }, { label: '正常', value: 1 }, { label: '异常', value: 0 }],
      info: {
        list: [],
        count: 0
      },
      page: 1,
      pageSize: 10,
      count: 10,
      showRight: false,
      recordObj: {},
      flag: 0,
      patrol_user_info: [],
      title: '记录详情'
    }
  },
  components: {
    Pagi,
    Right
  },
  methods: {
    recordDetail (row) {
      this.title = '记录详情'
      this.flag = 0
      this.showRight = true
      this.recordObj = row
      this.patrol_user_info = this.recordObj.patrol_user_info
      console.log(row)
    },
    textDetail (row) {
      this.title = '内容详情'
      this.flag = 1
      this.showRight = true
    },
    hideRight () {
      this.showRight = false
    },
    datePicker (dateArr) {
      if (dateArr === null) {
        this.b_time = ''
        this.e_time = ''
        this.getTableList()
      } else {
        this.b_time = this.$common.changeDateTime(dateArr[0])
        this.e_time = this.$common.changeDateTime(dateArr[1])
        this.getTableList()
      }
    },
    changeClassify (val) {
      if (val === '0') {
        this.dangerName = ''
        this.dangers = []
        this.role = ''
        this.roles = []
        this.getTableList()
      } else {
        this.dangerName = ''
        this.dangers = []
        this.role = ''
        this.roles = []
        this.getTableList()
        this.dangerList(val)
      }
    },
    dangerList (val) {
      let that = this
      let data = {
        danger_type_id: val,
        danger_id: 0,
        page: 1,
        page_size: 100000
      }
      this.$common.req(
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
    changeDanger (val) {
      if (val === '0') {
        this.role = ''
        this.roles = []
        this.getTableList()
      } else {
        this.role = ''
        this.roles = []
        this.getTableList()
        this.userList(val)
      }
    },
    userList (val) {
      let that = this
      let data = {
        danger_type_id: this.classify,
        danger_id: val,
        page: 1,
        page_size: 100000
      }
      this.$common.req(
        '/index.php?model=jlsafe&m=position&a=index&cmd=104',
        data).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.info.data
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].position_name,
              value: data[index].position_id
            }
            arr.push(obj)
          }
          that.roles = arr
        }
      })
    },
    // 获取分类列表
    getDangerType () {
      let that = this
      this.$common.reqS(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=101', {}).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.data
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].danger_type_name,
              value: data[index].danger_type_id
            }
            arr.push(obj)
          }
          that.classifies = arr
          that.newClassifies = arr
        }
      })
    },
    changeUser (val) {
      if (!val) {
        return false
      }
      this.getTableList()
    },
    changeStatus (val) {
      this.status = val
      this.getTableList()
    },
    pageChange (page) {
      this.page = page
    },
    getTableList () {
      let data = {
        danger_type_id: this.classify,
        danger_id: this.dangerName,
        position_id: this.role,
        patrol_state: this.status,
        b_time: this.b_time,
        e_time: this.e_time,
        page: 1,
        page_size: 10
      }
      common.req('/index.php?model=jlsafe&m=patrol&a=index&cmd=101', data, (res) => {
        if (res.data.errcode === '0') {
          this.info = res.data.data
          console.log(this.info)
        }
      })
    }
  },
  watch: {

  },
  created () {
    this.getTableList()
    this.getDangerType()
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
.el-row .el-checkbox-group {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
