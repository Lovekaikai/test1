<template>
  <section>
    <section v-show="!showResult">
      <div id="batch-search-box">
        <el-input
          type="textarea"
          :rows="8"
          placeholder="多个手机号/工号用请换行"
          v-model="text">
        </el-input>
      </div>
      <div class="btn-area">
        <el-button type="primary" @click="batchSearch" size="mini">搜索</el-button>
      </div>
    </section>
    <section v-show="showResult">
      <div id="batch-result" v-show="showResult">
        <template v-for="(item, index) in rec['fail']">
          <el-row :gutter="24" :key="index">
            <el-col :span="10">{{item}}</el-col>
            <el-col :span="12" style="color:red;">获取失败!</el-col>
          </el-row>
        </template>
        <template v-for="(item, key) in rec['success']">
          <el-row :gutter="24" :key="key">
            <el-col :span="10">{{key}}</el-col>
            <el-col :span="12">{{item.acct}}{{item.deptName}}</el-col>
          </el-row>
        </template>
      </div>
      <div class="btn-area">
        <el-button type="" @click="back" size="mini">返回</el-button>
        <el-button type="primary" @click="confirm" size="mini">确认搜索结果</el-button>
      </div>
    </section>
  </section>
</template>

<script>
import qs from 'querystring'

export default {
  data () {
    return {
      text: '',
      rec: {},
      showResult: false
    }
  },
  methods: {
    batchSearch () {
      this.$common.lock()
      this.$common.reqSP('/index.php?model=jlnews&m=contact&a=get_user_by_acct_or_phone', qs.stringify({ text: this.text }), res => {
        this.showResult = true
        this.$common.unlock()
        this.rec = res.data.rec
      })
    },
    clearData () {
      this.text = ''
      this.rec = {}
    },
    back () {
      this.showResult = false
      // this.clearData()
    },
    confirm () {
      this.back()
      this.$emit('batchConfirm', this.rec['success'])
      this.clearData()
    }
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.btn-area{
  margin-top: 10px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
#batch-result{
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  .el-row{
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    font-size: 14px;
  }
  .red{
    color: red;
  }
}
</style>
