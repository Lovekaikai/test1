<template>
  <section class="h100">
    <h2 class="main-title">
      巡检异常项目
    </h2>
    <div class="condition" style="display:flex;align-items:center;">
      <span style="margin: 0 5px;white-space: nowrap">分类 </span>
      <el-select v-model="classify" placeholder="请选择分类" @change="changeClassify">
          <el-option label="全部" value="0"></el-option>
         <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>n>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">危险源名称 </span>
      <el-select v-model="dangerName" placeholder="请选择危险源名称" @change="changeDanger">
        <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          <el-table-column prop="danger_type_name" label="分类">
          </el-table-column>
          <el-table-column prop="danger_name" label="危险源名称">
          </el-table-column>
          <el-table-column prop="mission_time" label="巡检日期">
          </el-table-column>
          <el-table-column prop="patrol_mark" label="异常指标">
          </el-table-column>
          <el-table-column prop="patrol_mark_value" label="异常指标值">
          </el-table-column>
          <el-table-column prop="patrol_time" label="巡检时间">
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- end table -->
    <Pagi :page="page" :pageSize="pageSize" :count="info.count" @pageChange="pageChange" />
    <!-- end page -->
  </section>
</template>
<script>
import Pagi from '@/components/pagi/'
import common from '@/common/http'
export default {
  data () {
    return {
      classify: '',
      classifies: [],
      dangerName: '',
      dangers: [],
      role: '',
      info: {
        list: [],
        count: 20
      },
      date: '',
      page: 1,
      pageSize: 10,
      b_time: '',
      e_time: ''
    }
  },
  components: {
    Pagi
  },
  methods: {
    pageChange (page) {
      this.page = page
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
    changeDanger () {
      this.getTableList()
    },
    datePicker (dateArr) {
      if (dateArr === null) {
        this.b_time = ''
        this.e_time = ''
        this.getTableList()
      } else {
        this.b_time = common.changeDateTime(dateArr[0])
        this.e_time = common.changeDateTime(dateArr[1])
        this.getTableList()
      }
    },
    getTableList () {
      let data = {
        danger_type_id: this.classify,
        danger_id: this.dangerName,
        b_time: this.b_time,
        e_time: this.e_time,
        page: 1,
        page_size: 10
      }
      this.$common.req('/index.php?model=jlsafe&m=patrol&a=index&cmd=102', data, (res) => {
        if (res.data.errcode === '0') {
          console.log(res)
          this.info = res.data.data
        }
      })
    },
    getType () {
      let that = this
      this.$common.req(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=101', {},
        res => {
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
          }
        }
      )
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
    }
  },
  watch: {

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
.el-row .el-checkbox-group {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
