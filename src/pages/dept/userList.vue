<template>
  <section id="user-list">
    <template v-for="user in userList">
      <div class="user" :key="user.id">
        <el-checkbox size="medium" v-model="user.checked" @change="change(user)">
          <img class="ava" :src="user.icon || userIcon" width="20" height="20">
          <span class="name">{{user.name}}</span>
        </el-checkbox>
      </div>
    </template>
    <div>
      <div class="right-empty" v-show="loadingUser">
        加载中...
      </div>
      <div class="right-empty" v-show="!hasClick && userList.length == 0 && !loadingUser ">
        请点击左侧目录，加载成员数据
      </div>
      <div class="right-empty" v-show="hasClick && userList.length == 0 && !loadingUser">
        暂无成员
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: ['userList', 'loadingUser', 'hasClick'],
  data () {
    return {
      userIcon: '/static/img/face.png'
    }
  },
  methods: {
    change (data) {
      this.$emit('change', data, 'user')
    }
  }
}
</script>
<style lang="less" scoped>
#user-list{
  .el-checkbox__input{
    float:right;
    position: relative;
    // top: 2px;
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
  .right-empty{
    text-align: center;
  }
  .user{
    cursor: pointer;
    margin: 5px 0;
    .el-checkbox{
      width: 100%;
    }
    .name{
      position: relative;
      margin-left: 3px;
      top: -5px;
    }
  }
}
</style>
<style lang="less">
.right{
  .el-checkbox__input{
    float:right;
    position: relative;
    // top: 2px;
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
}
</style>
