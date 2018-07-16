<template>
  <el-tag size="medium" :closable="closable" disable-transitions @close="removeTag">
    <img class="tag-ava" :src="'/static/img/' + type + '.png'" alt="" v-if="type == 'org' || type == 'group'">
    <img class="tag-ava" style="margin-right: 3px;" :src="item.icon || item.pic_url || userIcon" alt="" v-if="type == 'user' || type == 'batch'">
    {{type == 'batch' ? item.name + item.deptName : item.name}}
  </el-tag>
</template>
<script>
export default {
  props: {
    'item': {
    },
    'type': {
    },
    'closable': {
      type: Boolean,
      default: true,
      required: false
    }
  },
  methods: {
    removeTag () {
      this.$emit('removeTag', this.item)
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
