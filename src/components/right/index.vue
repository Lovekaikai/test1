<template>
  <!-- <div class="right-container" v-if="show" @click="hide"> -->
  <section id="right" :class="{ active: show }" @click.stop="() => {}">
    <div class="title">{{this.title}}</div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="btn-area">
      <slot name="btn"></slot>
    </div>
  </section>
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '详情'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'show': function (val) {
      console.log(val)
    }
  },
  data () {
    return {
    }
  },
  methods: {
    hide () {
      this.$emit('hideRight')
    }
  }
}
</script>
<style lang="less" scoped>
.right-container {
  width: 100%;
  min-height: calc(100vh - 50px);
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
#right {
  position: absolute;
  top: 0;
  right: 0px;
  width: 400px;
  min-height: calc(100vh - 50px);
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  border-left: 1px solid #ccc;
  transition: all 0.25s;
  transform: translate(400px, 0);
  z-index: 2;
  overflow-y: hidden;
}
#right.active {
  transform: translate(0px, 0);
}
.title {
  font-size: 18px;
  text-align: center;
  // line-height: 36px;
  padding: 15px 0;
  border-bottom: 1px solid #e4e1e1;
}
.content {
  padding: 25px 15px;
  padding-bottom: 50px;
  padding-top: 15px;
  font-size: 14px;
  // width: 350px;
  word-wrap: break-word;
  max-height: calc(100% - 180px);
  overflow-y: auto;
}
.item {
  margin: 15px 0;
}
.btn-area {
  border-top: 1px solid #ccc;
  background: #f5f5f5;
  position: absolute;
  bottom: 0;
  padding: 10px;
  width: 380px;
  text-align: right;
}
</style>
