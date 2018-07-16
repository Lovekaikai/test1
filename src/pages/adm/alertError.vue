<template>
  <section class="h100">
    <h2 class="main-title">
      报警异常记录
    </h2>
    <div class="condition" style="display:flex;align-items:center;">
      <span style="margin: 0 5px;white-space: nowrap">分类 </span>
      <el-select v-model="classify" placeholder="请选择分类">
        <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">危险源名称 </span>
      <el-select v-model="dangerName" placeholder="请选择危险源名称">
        <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">岗位角色 </span>
      <el-select v-model="role" placeholder="请选择岗位角色">
        <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">日期 </span>
      <el-date-picker v-model="date" align="right" type="date" placeholder="选择日期">
      </el-date-picker>
    </div>
    <!-- end cond -->
    <div class="table">
      <template>
        <el-table :data="info.data" border style="width: 100%">
          <el-table-column prop="classify" label="分类">
          </el-table-column>
          <el-table-column prop="place" label="危险源名称">
          </el-table-column>
          <el-table-column prop="danger_name" label="巡检日期">
          </el-table-column>
          <el-table-column prop="danger_code" label="异常指标">
          </el-table-column>
          <el-table-column prop="danger_code" label="异常指标值">
          </el-table-column>
          <el-table-column prop="danger_code" label="巡检时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text">查看详情</el-button>
            </template>
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

export default {
  data () {
    return {
      classify: '',
      classifies: [{ label: '分类1', value: 1 }, { label: '分类2', value: 2 }, { label: '分类3', value: 3 }],
      dangerName: '',
      dangers: [{ label: '危险源1', value: 1 }, { label: '危险源2', value: 2 }, { label: '危险源3', value: 3 }],
      role: '',
      roles: [{ label: '角色1', value: 1 }, { label: '角色2', value: 2 }, { label: '角色3', value: 3 }],
      info: {
        data: [
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' }
        ],
        count: 20
      },
      page: 1,
      pageSize: 10,
      date: new Date()
    }
  },
  components: {
    Pagi
  },
  methods: {
    pageChange (page) {
      this.page = page
    }
  },
  watch: {

  },
  created () {
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
