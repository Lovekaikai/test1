<template>
  <div class="checkbox-item">
    <el-checkbox size="medium" v-model="item.checked" @change="change()">
      <img class="ava" :src="user.icon || userIcon" width="20" height="20">
      <span class="name">{{user.name}}</span>
    </el-checkbox>
  </div>
</template>
<script>
export default {
  props: ['item', 'type'],
  methods: {
    change () {
      this.$emit('change', this.item)
    }
  },
  data () {
    return {
      userIcon: '/static/img/face.png'
    }
  }
}
</script>
<style scoped lang="less">
.ava{
  position: relative;
  top: 5px;
}
</style>
<style lang="less">
.tag-ava{
  position: relative;
  width: 18px;
  height: 18px;
  top: 4px;
  margin-left: -5px;
}
</style>
