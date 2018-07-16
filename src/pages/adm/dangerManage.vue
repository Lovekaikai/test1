<template>
  <section class="h100">
    <h2 class="main-title">
      危险源管理
    </h2>
    <div class="condition" style="display:flex;align-items:center;">
      <span style="margin: 0 5px;white-space: nowrap">分类 </span>
      <el-select v-model="classify" placeholder="请选择分类" style="min-width:130px;width:130px;" @change="changeClassify">
        <el-option label="全部" value="0"></el-option>
        <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">危险源名称 </span>
      <el-select v-model="dangerName" placeholder="请选择危险源名称">
        <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div style="flex:1"></div>
      <div class="btn-area" style="display:flex;">
        <el-button type="primary" size="small" style="margin-left: 10px;font-size:13px;" @click="dialogInfo.show=true">新建</el-button>
      </div>
    </div>
    <!-- end cond -->
    <div class="table">
      <template>
        <el-table :data="info.data" border style="width: 100%">
          <el-table-column type="selection" width="40">
          </el-table-column>
          <el-table-column prop="classify" label="分类">
          </el-table-column>
          <el-table-column prop="place" label="地点">
          </el-table-column>
          <el-table-column prop="danger_name" label="危险源名称">
          </el-table-column>
          <el-table-column prop="danger_code" label="危险源代码">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown trigger="hover" :show-timeout="0" @click.stop>
                <span class="el-dropdown-link blue" style="">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>修改</el-dropdown-item>
                  <el-dropdown-item>绑定表单</el-dropdown-item>
                  <el-dropdown-item>二维码</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- end table -->
    <Pagi :page="page" :pageSize="pageSize" :count="info.count" @pageChange="pageChange" />
    <!-- end page -->
    <el-dialog :title="dialogInfo.title" width="450px" :visible.sync="dialogInfo.show" id="build-edit">
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>分类</el-col>
        <el-col :span="18">
          <el-select v-model="classify" placeholder="请选择分类" style="min-width:150px;width:150px;">
            <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>名称</el-col>
        <el-col :span="18">
          <el-input type="text" placeholder="请输入名称" style="min-width:250px;width:250px;"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>地点</el-col>
        <el-col :span="18">
          <el-input type="text" placeholder="请输入地点" style="min-width:250px;width:250px;"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>危险源代码</el-col>
        <el-col :span="18">
          <el-input type="text" placeholder="请输入源代码" style="min-width:250px;width:250px;"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>备注</el-col>
        <el-col :span="18">
          <el-input type="textarea" placeholder="请输入备注" style="min-width:250px;width:250px;">
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.show = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end dialong -->
  </section>
</template>
<script>
import Pagi from '@/components/pagi/'
import common from '@/common/http'
export default {
  data () {
    return {
      classify: '',
      classifies: [{ label: '分类1', value: 1 }, { label: '分类2', value: 2 }, { label: '分类3', value: 3 }],
      dangerName: '',
      dangers: [{ label: '危险源1', value: 1 }, { label: '危险源2', value: 2 }, { label: '危险源3', value: 3 }],
      info: {
        data: [
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
          { classify: '分类1', place: '地点1', danger_name: '危险源1', danger_code: '1', remark: '备注1' },
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
      dialogInfo: {
        title: '新建危险源',
        show: false
      }
    }
  },
  components: {
    Pagi
  },
  methods: {
    changeClassify (val) {
      if (val === '0') {
      } else {
        this.dangerList(val)
      }
    },
    // 获取危险源的列表
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
            let data = res.data.data
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
    pageChange (page) {
      this.page = page
    },
    getType () {
      let that = this
      common.req(
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
            that.newClassifiecs = arr
          }
        }
      )
    }
  },
  watch: {

  },
  created () {
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
