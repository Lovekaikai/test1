<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@media print {
  #main {
    min-width: auto;
    max-width: auto;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
  }
}
* {
  margin: 0;
  padding: 0;
}
.fs12 {
  font-size: 12px;
}
.fs14 {
  font-size: 14px;
}
.fs16 {
  font-size: 16px;
}
#app {
  width: 100%;
  min-height: calc(100vh - 50px);
  background: rgb(234, 234, 234);
  padding: 25px 0;
  #main {
    position: relative;
    min-width: 1200px;
    max-width: 1480px;
    min-height: calc(100vh - 50px);
    margin: 0px auto;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
h2 {
  font-size: 20px;
  color: #4a4a4a;
  font-weight: normal;
  padding: 25px 0 15px 0;
}
.el-table .el-table__header-wrapper tr,
.el-table .el-table__header-wrapper th {
  color: #fff;
  background-color: rgb(96, 193, 254) !important;
}
.el-table__row {
  cursor: pointer;
}
.el-table--medium td {
  padding: 5px 0;
}
.el-table--medium th {
  padding: 5px 0;
}
.h100 {
  min-height: calc(100vh - 50px);
  height: 100%;
}
.el-dialog__header {
  border-bottom: 1px solid #eee;
}
.el-dialog__body {
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
}
.el-loading-mask {
  z-index: 3000 !important;
}
.blue {
  color: #60c1fe;
  font-size: 12px;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.dept {
  border: 1px solid #dcdfe6;
  min-height: 30px;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
}
.err {
  z-index: 2999;
}
.condition {
  height: 36px;
}
.table {
  height: calc(100vh - 300px);
  overflow-y: auto;
}
.red {
  color: red;
}
.tar {
  text-align: right;
  margin-right: 10px;
}
</style>
