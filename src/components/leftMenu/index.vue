<template>
  <section id="left-menu">
    <div class="title">
      <img class="icon" src="../../assets/img/menu.png" style="width:30px;height:30px;" alt="">{{title}}
    </div>
    <div class="content">
      <template v-for="menu in menuList">
        <div class="item" :key="menu.link">
          <template v-if="menu.link">
            <router-link :to=" menu.link ">{{menu.label}}</router-link>
          </template>
          <template v-if="!menu.link">
            <el-tree :data="childrenTree" :props="defaultProps" default-expand-all @node-click="handleNodeClick">
              <span class="custom-tree-node " slot-scope="{ node, data } ">
                <router-link :to="data.link ">{{data.label}}</router-link>
              </span>
            </el-tree>
          </template>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'el-icon-message'
    },
    title: {
      type: String,
      default: ''
    },
    menuList: {
      type: Array
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      power: [],
      isSuper: false,
      childrenTree: [
        {
          children: []
        }
      ]
    }
  },
  methods: {
  },
  created () {
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
#left-menu {
  position: absolute;
  left: 0;
  width: 260px;
  border-right: 1px solid #ececec;
  height: 100%;
  min-height: calc(100vh - 50px);
  background: rgb(245, 245, 245);
}
.title {
  font-size: 20px;
  color: #4a4a4a;
  text-align: center;
  padding: 15px 0;
  border-bottom: 1px solid #e4e1e1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  text-align: center;
  .item {
    margin: 15px 0;
  }
  .router-link-active,
  a.router-link-exact-active {
    color: #5ec6ff;
  }
  a {
    font-size: 14px;
    text-decoration: none;
    // color: #5EC6FF;
    color: #4a4a4a;
  }
}
.el-tree {
  background: transparent;
  margin-left: 64px;
}
.icon {
  position: relative;
  margin-right: 5px;
  top: 1px;
}
</style>
<style lang="less">
#left-menu {
  .el-tree-node {
    margin: 10px 0;
    .el-tree-node__label {
      color: #4a4a4a;
    }
  }
}
</style>
