<template>
  <section class="h100">
    <h2 class="main-title">
      其他配置
    </h2>
    <div class="form">
      <!-- <el-row :gutter="30">
        <el-col :span="3">
          <p style="line-height: 24px;text-align:right;">填表时间段</p>
        </el-col>
        <el-col :span="21">
          每月
          <el-input type="number" placeholder="请输入" style="width: 100px;" size="mini"></el-input>
          号 ~ 每月
          <el-input type="number" placeholder="请输入" style="width: 100px;" size="mini"></el-input>
          号
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="3">
          <p style="text-align:right;">系统推送时间</p>
        </el-col>
      </el-row> -->
      <el-row :gutter="30">
        <el-col :span="3">
          <p style="text-align:right;">巡检注意事项</p>
        </el-col>
        <el-col :span="21">
          <el-input style="width: 600px;" type="textarea" :rows="5" placeholder="巡检注意事项">
          </el-input>
          <div style="text-align: right;width:600px;margin-top:30px;">
            <el-button type="primary">应用</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="line"></div>
    <div class="holiday">
      <div>
        <span>法定节假日 </span>
        <el-date-picker style="width:110px;" v-model="year" type="year" placeholder="选择年">
        </el-date-picker>
        <el-button type="primary" plain>获取最新</el-button>
        <el-button type="primary" plain>手动添加</el-button>
      </div>
      <div>
        <span>放假</span>
        <div class="day-box">
          <span v-for="(day,index) in holiday" :key="index" class="days">
            {{day}}
            <span class="el-icon-error" @click="holiday.splice(index,1)"></span>
          </span>
        </div>
        <el-button type="primary" plain>手动添加</el-button>

      </div>
      <div>
        <span>补班</span>
        <div class="day-box">
          <span v-for="(day,index) in missRest" :key="index" class="days">
            {{day}}
            <span class="el-icon-error" @click="missRest.splice(index,1)"></span>
          </span>
        </div>
        <el-button type="primary" plain>手动添加</el-button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      year: new Date(),
      holiday: ['2018-10-01', '2018-12-30', '2018-9-10', '2018-11-12', '2018-10-38'],
      missRest: ['2018-10-01', '2018-12-30', '2018-9-10', '2018-11-12', '2018-10-38']
    }
  },
  components: {
  },
  methods: {
  },
  created () {
  },
  computed: {
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin: 25px 0;
}
.line {
  border-top: 1px solid #ccc;
  margin-top: 30px;
}
.form {
  width: 85%;
}
.holiday {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  & > div {
    height: 50px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    & > span:first-child {
      white-space: nowrap;
      margin-right: 20px;
    }
    .el-button {
      margin-left: 10px;
    }
    .day-box {
      display: flex;
      .days {
        color: grey;
        position: relative;
        display: block;
        padding-right: 10px;
        margin-right: 20px;
        box-sizing: border-box;
        .el-icon-error {
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
          display: none;
        }
        &:hover .el-icon-error {
          display: inline-block;
        }
      }
    }
  }
}
</style>
