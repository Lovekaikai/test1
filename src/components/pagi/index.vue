<template>
  <section v-if="count > 0">
    <div id="page-info">第{{(page - 1) * pageSize + 1}} ~ {{Math.min(page * pageSize, count)}}条记录，共{{count}}条记录</div>
    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="count" @current-change="pageChange">
    </el-pagination>
  </section>
</template>
<script>
export default {
  props: [
    'page',
    'pageSize',
    'count'
  ],
  methods: {
    pageChange (val) {
      this.$emit('pageChange', val)
    }
  }
}
</script>
<style lang="less" scoped>
#page-info {
  float: left;
  color: #727272;
  font-size: 12px;
  padding-top: 5px;
}
.el-pagination {
  text-align: right;
  padding: 0;
  padding-bottom: 10px;
}
</style>
