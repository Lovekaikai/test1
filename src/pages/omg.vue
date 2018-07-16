<!--  -->
<template>
  <div class='content'>
    <img class="omg-bg" src="static/img/omg_bg.jpg">
    <div class="omg">
      <img src="static/img/omg.png">
      <ul>
        <li>可能的原因:</li>
        <li>无权限进行此操作</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  methods: {}
}

</script>
<style lang='less' scoped>
.content {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  img.omg-bg {
    width: 100%;
    height: 100%;
  }
  .omg {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    ul {
      list-style: none;
      position: absolute;
      right: 20%;
      bottom: 20%;
      width: 32%;
      font-size: 20px;
      li:last-child {
        margin-top: 10px;
        text-align: right;
      }
    }
  }
}
</style>
