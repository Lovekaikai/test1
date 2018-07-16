<template>
  <section class="h100 taskMan" @click="timePicker=false;showRight = false">
    <h2 class="main-title">
      任务管理
    </h2>
    <div class="condition" style="display:flex;align-items:center;">
      <span style="margin: 0 5px;white-space: nowrap">分类 </span>
      <el-select v-model="classify" placeholder="请选择分类" @change="changeClassify">
        <el-option label="全部" value="0"></el-option>
        <el-option v-for="item in classifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">危险源名称 </span>
      <el-select v-model="dangerName" placeholder="请选择危险源名称" @change="changeDanger">
        <el-option label="全部" value="0" v-if="dangers.length>0"></el-option>
        <el-option v-for="item in dangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="margin: 0 5px;white-space: nowrap">岗位角色 </span>
      <el-select v-model="role" placeholder="请选择岗位角色" @change="changeUser">
        <el-option label="全部" value="0" v-if="roles.length>0"></el-option>
        <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div style="flex:1"></div>
      <div class="btn-area" style="display:flex;">
        <el-button type="primary" size="small" style="margin-left: 10px;font-size:13px;" @click="newTask">新建</el-button>
      </div>
    </div>
    <!-- end cond -->
    <div class="table">
      <template>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="selection" width="40">
            </el-table-column>
            <el-table-column prop="danger_type_name" label="分类">
            </el-table-column>
            <el-table-column prop="danger_name" label="危险源名称">
            </el-table-column>
            <el-table-column prop="position_name" label="巡查人(岗位角色)">
            </el-table-column>
            <el-table-column prop="mission_times" label="巡逻时间点">
            </el-table-column>
            <el-table-column prop="patrol_num" label="每时间点巡查次数">
            </el-table-column>
            <el-table-column prop="alarm_receive_users" label="报警消息接收人">
            </el-table-column>
            <el-table-column prop="alarm_receive_user" v-if="false" label="报警消息接收人">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native.prevent="look(scope.row)">查看</el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="modify(scope.row)">修改</el-dropdown-item>
                    <el-dropdown-item @click.native.prevent="del(scope.row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
</template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- end table -->
    <Pagi :page="page" :pageSize="pageSize" :count="info.count" @pageChange="pageChange" />
    <!-- end page -->
    <el-dialog :title="dialogInfo.title" width="600px" :visible.sync="dialogInfo.show" id="build-edit">
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>分类</el-col>
        <el-col :span="18">
          <el-select v-model="newClassify" placeholder="请选择分类" style="min-width:150px;width:150px;" @change="newClassifiesEvent">
            <el-option v-for="item in newClassifies" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>危险源</el-col>
        <el-col :span="18">
          <el-select v-model="newDangerName" placeholder="请选择危险源名称" style="min-width:250px;width:250px;" @change="newDangerNameEvent">
            <el-option v-for="item in newDangers" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>巡查岗位角色</el-col>
        <el-col :span="18">
          <el-select v-model="newUser" placeholder="请选择岗位角色" style="min-width:250px;width:250px;">
            <el-option v-for="item in newRoles" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>班次配置</el-col>
        <el-col :span="18">
          <div class="boxT">
            <el-tag :key="tag" v-for="tag in tagsArr" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-button @click.native.stop="addTime">添加时间点 </el-button>
        <template class="timePick" v-if="timePicker" @click.native.stop="timePicker=true">
          <el-time-picker @change="confirmTimePicker" @click.native.stop="timePicker=true" is-range value-format='HH:mm' v-model="value4" format='HH:mm' range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
          </el-time-picker>
        </template>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>每时间点巡逻次数</el-col>
        <el-col :span="18">
          <el-input type="number" placeholder="" v-model="patrol_number" style="min-width:250px;width:250px;"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>报警接收人</el-col>
        <el-col :span="18">
          <div style="margin-bottom: 10px;">
<template v-for="(person, index) in editInfo.member">
  <User style="margin: 0 5px 5px 0;" :key="person.id" :item="person" type="user" @removeTag="removeTag(index)" />
</template>
          </div>
          <div style="margin-bottom: 15px;">
            <el-button type="primary" size="mini" @click="showDept = true">添加人员</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" style="text-align: right;line-height:40px;">
          <span class="red">* </span>过滤时间段</el-col>
          <el-col :span="18" style="margin-top: 10px;">
            <el-checkbox label="法定节假日" v-model="filt_holiday"></el-checkbox>
            <el-checkbox label="周末" v-model="filt_weekend"></el-checkbox>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.show = false">取 消</el-button>
        <el-button type="primary" v-if="flag" @click="modifyNewTask">确 定</el-button>
        <el-button type="primary" v-if="!flag" @click="confirmNewTask">确 定</el-button>
      </span>
    </el-dialog>
    <Right :show="showRight" @hideRight="showRight = false" title="任务详情">
<template slot="content">
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="8">分类</el-col>
      <el-col style="color:#4a4a4a;" :span="16">{{rightDetail.danger_type_name}}</el-col>
    </el-row>
  </div>
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="8">危险源名称</el-col>
      <el-col style="color:#4a4a4a;" :span="16">{{rightDetail.danger_name}}</el-col>
    </el-row>
  </div>
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="8">巡查人</el-col>
      <el-col style="color:#4a4a4a;" :span="16">{{rightDetail.position_name}}</el-col>
    </el-row>
  </div>
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="8">巡逻时间点</el-col>
      <el-col style="color:#4a4a4a;" :span="16">
        <template>
            {{rightDetail.mission_times}}
      </template>
      </el-col>
    </el-row>
  </div>
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="8">时间点巡逻次数</el-col>
      <el-col style="color:#4a4a4a;" :span="16">
<template>
   {{rightDetail.patrol_num}}
</template>
      </el-col>
    </el-row>
  </div>
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="8">报警消息接收人</el-col>
      <el-col style="color:#4a4a4a;" :span="16">
<template>
   {{rightDetail.alarm_receive_usersArr}}
</template>
      </el-col>
    </el-row>
  </div>
  <div class="item">
    <el-row :gutter="20">
      <el-col style="text-align: right;color:#9b9b9b;" :span="7">过滤时间段</el-col>
      <el-col style="color:#4a4a4a;" :span="16">
<template v-if="Number(rightDetail.filt_holiday)">
   法定节假日
</template>
<template v-if="Number(rightDetail.filt_holiday)&&Number(rightDetail.filt_weekend)">
   /
</template>
<template v-if="Number(rightDetail.filt_weekend)">
   周末
</template>
      </el-col>
    </el-row>
  </div>
</template>
<template slot="btn">
  <el-button type="primary" @click.native.prevent="modify(rightDetail)">
    修改</el-button>
  <el-button type="danger" @click.native.prevent="del(rightDetail)">删除</el-button>
</template>
    </Right>
      <Dept model="user" :visible="showDept" :selected="{user: editInfo.member}"  @confirm="confirm" @updateVisible="updateVisible" />
    <!-- end dialong -->
  </section>
</template>
<script>
import Pagi from '@/components/pagi/'
import Right from '@/components/right/'
// import common from '@/common/http'
import Dept from '@/pages/dept/'
import User from '@/pages/dept/user'
// import moment from 'moment'
export default {
  data () {
    return {
      timePicker: false,
      value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      classify: '',
      newClassify: '',
      new_alarm_receive_user: '',
      classifies: [],
      newClassifies: [],
      dangerName: '',
      dangers: [],
      role: '',
      roles: [],
      newRoles: [],
      newDangers: [],
      info: {},
      tableData: [],
      page: 1,
      pageSize: 10,
      dialogInfo: {
        title: '新建巡检任务',
        show: false
      },
      editData: {
        checkList: []
      },
      newDangerName: '',
      newUser: '',
      tagsArr: [],
      patrol_number: '',
      filt_holiday: '0',
      filt_weekend: '0',
      flag: 0,
      mission_id: '',
      danger_type_id: 0,
      danger_id: 0,
      showDept: false,
      showRight: false,
      editInfo: {
        member: []
      },
      rightDetail: {}
    }
  },
  components: {
    Pagi,
    Dept,
    User,
    Right
  },
  methods: {
    updateVisible (val) {
      this.showDept = val
    },
    confirm (choosen) {
      this.editInfo.member = choosen.user
    },
    removeTag (index) {
      this.editInfo.member.splice(index, 1)
    },
    handleClose (tag) {
      this.tagsArr.splice(this.tagsArr.indexOf(tag), 1)
    },
    addTime () {
      this.timePicker = !this.timePicker
    },
    pageChange (page) {
      this.page = page
      this.getList()
    },
    confirmTimePicker (val) {
      if (val) {
        this.tagsArr.push(this.value4.join('-'))
        this.tagsArr = Array.from(new Set(this.tagsArr))
      }
    },
    // 获取列表
    getList () {
      let that = this
      let data = {
        danger_type_id: this.classify,
        danger_id: this.dangerName,
        position_id: this.role,
        page: this.page,
        page_size: 10
      }
      this.$common.req(
        '/index.php?model=jlsafe&m=mission&a=index&cmd=102',
        data,
        res => {
          if (res.data.errcode === '0') {
            res.data.info['count'] = Number(res.data.info['count'])
            let List = res.data.info.data
            for (let key = 0; key < List.length; key++) {
              let arr = []
              if (List[key].alarm_receive_user && List[key].alarm_receive_user.length > 0) {
                for (let index = 0; index < List[key].alarm_receive_user.length; index++) {
                  let element
                  for (let j = 0; j < List[key].alarm_receive_user[index].dept_list.length; j++) {
                    element = '(' + List[key].alarm_receive_user[index].dept_list[j].name + ', 工号:' + List[key].alarm_receive_user[index].dept_list[j].id + ')'
                  }
                  arr.push(List[key].alarm_receive_user[index].name + element)
                }
              }
              // 装换显示时间
              List[key]['alarm_receive_users'] = arr.join(',')
              let TimeArr = []
              if (List[key].mission_time && List[key].mission_time.length > 0) {
                for (let i = 0; i < List[key].mission_time.length; i++) {
                  TimeArr.push(
                    List[key].mission_time[i].begin_time_text +
                      '-' +
                      List[key].mission_time[i].end_time_text
                  )
                }
              }
              List[key]['mission_times'] = TimeArr.join(' , ')
            }
            that.tableData = List
            that.info = res.data.info
          }
        }
      )
    },
    // 获取分类列表
    getDangerType () {
      this.$common.reqS(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=101', {}).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.data
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].danger_type_name,
              value: data[index].danger_type_id
            }
            arr.push(obj)
          }
          this.classifies = arr
          this.newClassifies = arr
        }
      })
    },
    // 获取危险源的列表
    dangerList (val) {
      let that = this
      let data = {
        danger_type_id: val,
        danger_id: 0,
        page: 1,
        page_size: 100000
      }
      this.$common.reqS(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=105',
        data).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.data.list
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].danger_name,
              value: data[index].danger_id
            }
            arr.push(obj)
          }
          that.dangers = arr
        }
      })
    },
    addDangerList (val) {
      let that = this
      let data = {
        danger_type_id: val,
        danger_id: 0,
        page: 1,
        page_size: 100000
      }

      this.$common.reqS(
        '/index.php?model=jlsafe&m=danger&a=index&cmd=105',
        data).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.data.list
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].danger_name,
              value: data[index].danger_id
            }
            arr.push(obj)
          }
          that.newDangers = arr
        }
      })
    },
    userList (val) {
      let that = this
      let data = {
        danger_type_id: this.classify,
        danger_id: val,
        page: 1,
        page_size: 100000
      }
      this.$common.reqS(
        '/index.php?model=jlsafe&m=position&a=index&cmd=104',
        data).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.info.data
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].position_name,
              value: data[index].position_id
            }
            arr.push(obj)
          }
          that.roles = arr
        }
      })
    },
    adddOrEditUserList (val) {
      let that = this
      let data = {
        danger_type_id: this.newClassify,
        danger_id: val,
        page: 1,
        page_size: 100000
      }
      this.$common.reqS(
        '/index.php?model=jlsafe&m=position&a=index&cmd=104',
        data).then(res => {
        if (res.data.errcode === '0') {
          let data = res.data.info.data
          let arr = []
          for (let index in data) {
            let obj = {
              label: data[index].position_name,
              value: data[index].position_id
            }
            arr.push(obj)
          }
          that.newRoles = arr
        }
      })
    },
    changeClassify (val) {
      if (val === '0') {
        this.dangerName = ''
        this.dangers = []
        this.role = ''
        this.roles = []
        this.getList()
      } else {
        this.dangerName = ''
        this.dangers = []
        this.role = ''
        this.roles = []
        this.getList()
        this.dangerList(val)
      }
    },
    changeDanger (val) {
      if (val === '0') {
        this.role = ''
        this.roles = []
        this.getList()
      } else {
        this.role = ''
        this.roles = []
        this.getList()
        this.userList(val)
      }
    },
    changeUser (val) {
      if (!val) {
        return false
      }
      this.getList()
    },
    newClassifiesEvent (val) {
      if (val === '0') {
        this.newDangerName = ''
        this.newDangers = []
        this.newUser = ''
        this.newRoles = []
      } else {
        this.newDangerName = ''
        this.newDangers = []
        this.newUser = ''
        this.newRoles = []
        this.addDangerList(val)
      }
    },
    newDangerNameEvent (val) {
      if (val === '0') {
        this.newUser = ''
        this.newRoles = []
      } else {
        this.newUser = ''
        this.newRoles = []
        this.adddOrEditUserList(val)
      }
    },
    not_empty () {
      this.newClassify = ''
      this.newUser = ''
      this.newDangerName = ''
      this.tagsArr = []
      this.patrol_number = ''
      this.new_alarm_receive_user = ''
      this.dialogInfo.show = false
      this.filt_holiday = '0'
      this.filt_weekend = '0'
      this.editInfo = {
        member: []
      }
    },
    modifyNewTask () {
      if (!this.newClassify) {
        this.$message({
          message: '分类不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (!this.newUser) {
        this.$message({
          message: '岗位角色源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (!this.newDangerName) {
        this.$message({
          message: '危险源源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.editInfo.member.length === 0) {
        this.$message({
          message: '报警接收人不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.tagsArr.length === 0) {
        this.$message({
          message: '時間不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.patrol_number === 0) {
        this.$message({
          message: '巡逻次数不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      let memberArr = []
      for (let j = 0; j < this.editInfo.member.length; j++) {
        memberArr.push(this.editInfo.member[j].id)
      }
      let arr = []
      for (let key = 0; key < this.tagsArr.length; key++) {
        let childTag = this.tagsArr[key].split('-')
        let crr = []
        for (let i = 0; i < childTag.length; i++) {
          crr.push(childTag[i].split(':').join(''))
        }
        arr.push(crr)
      }
      console.log(arr)
      let data = {
        danger_type_id: this.newClassify,
        danger_id: this.newDangerName,
        position_id: this.newUser,
        mission_time: arr,
        patrol_num: this.patrol_number,
        alarm_receive_user: memberArr,
        filt_holiday: Number(this.filt_holiday),
        filt_weekend: Number(this.filt_weekend),
        mission_id: this.mission_id
      }
      console.log(data)
      this.$common.req(
        '/index.php?model=jlsafe&m=mission&a=index&cmd=103',
        data,
        res => {
          if (res.data.errcode === '0') {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            })
            this.not_empty()
            this.getList()
          } else {
            this.$message({
              message: '修改失败',
              type: 'error',
              duration: 1000
            })
            this.not_empty()
          }
        }
      )
    },
    newTask () {
      this.dialogInfo = {
        title: '新建巡检任务',
        show: true
      }
      this.flag = 0
      this.dialogInfo.show = true
    },
    async  modify (obj) {
      console.log()
      this.dialogInfo = {
        title: '修改巡检任务',
        show: true
      }
      let tmp = JSON.parse(JSON.stringify(obj))
      console.log(tmp)
      let arr1 = []
      for (let i = 0; i < tmp.alarm_receive_user.length; i++) {
        arr1.push({
          acct: tmp.alarm_receive_user[i].acct,
          dept_list: tmp.alarm_receive_user[i].dept_list,
          user_id: tmp.alarm_receive_user[i].id,
          name: tmp.alarm_receive_user[i].name,
          pic_url: tmp.alarm_receive_user[i].pic_url
        })
      }
      await this.addDangerList(tmp.danger_type_id)
      await this.adddOrEditUserList(tmp.danger_id)
      this.flag = 1
      this.dialogInfo.show = true
      this.newClassify = tmp.danger_type_id
      this.newDangerName = tmp.danger_id

      this.newUser = tmp.position_id
      this.editInfo = {
        member: this.$common.transferUserInfo(arr1) || []
      }
      let arr = []
      for (let i = 0; i < obj.mission_time.length; i++) {
        arr.push(
          obj.mission_time[i]['begin_time_text'] +
            '-' +
            obj.mission_time[i]['end_time_text']
        )
      }
      this.tagsArr = arr
      this.patrol_number = obj.patrol_num

      this.filt_holiday = Boolean(Number(obj.filt_holiday))
      this.filt_weekend = Boolean(Number(obj.filt_weekend))
      this.mission_id = obj.mission_id
    },
    look (row) {
      console.log(row)
      this.showRight = true
      let arr = []
      for (let index = 0; index < row.alarm_receive_user.length; index++) {
        let element
        for (let j = 0; j < row.alarm_receive_user[index].dept_list.length; j++) {
          element = '(' + row.alarm_receive_user[index].dept_list[j].name + ', 工号:' + row.alarm_receive_user[index].dept_list[j].id + ')'
        }
        arr.push(row.alarm_receive_user[index].name + element)
      }
      // 装换显示时间
      row['alarm_receive_usersArr'] = arr.join(',')
      let TimeArr = []
      if (row.mission_time && row.mission_time.length > 0) {
        for (let i = 0; i < row.mission_time.length; i++) {
          TimeArr.push(
            row.mission_time[i].begin_time_text +
                      '-' +
                      row.mission_time[i].end_time_text
          )
        }
      }
      row['mission_times'] = TimeArr.join(' , ')
      console.log(row)
      this.rightDetail = row
    },
    confirmNewTask () {
      if (!this.newClassify) {
        this.$message({
          message: '分类不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (!this.newUser) {
        this.$message({
          message: '岗位角色源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (!this.newDangerName) {
        this.$message({
          message: '危险源源不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.editInfo.member.length === 0) {
        this.$message({
          message: '报警接收人不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.tagsArr.length === 0) {
        this.$message({
          message: '时间不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      if (this.patrol_number === 0) {
        this.$message({
          message: '巡逻次数不能为空',
          type: 'warning',
          duration: 1000
        })
        return false
      }
      // 把id转换为数组
      let memberArr = []
      for (let j = 0; j < this.editInfo.member.length; j++) {
        memberArr.push(this.editInfo.member[j].id)
      }
      let arr = []
      for (let key = 0; key < this.tagsArr.length; key++) {
        let childTag = this.tagsArr[key].split('-')
        let crr = []
        for (let i = 0; i < childTag.length; i++) {
          crr.push(childTag[i].split(':').join(''))
        }
        arr.push(crr)
      }
      let data = {
        danger_type_id: this.newClassify,
        danger_id: this.newDangerName,
        position_id: this.newUser,
        mission_time: arr,
        patrol_num: this.patrol_number,
        alarm_receive_user: memberArr,
        filt_holiday: Number(this.filt_holiday),
        filt_weekend: Number(this.filt_weekend)
      }
      this.$common.req(
        '/index.php?model=jlsafe&m=mission&a=index&cmd=100',
        data,
        res => {
          if (res.data.errcode === '0') {
            this.$message({
              message: '新建成功',
              type: 'success',
              duration: 1000
            })
            this.not_empty()
            this.getList()
          } else {
            this.$message({
              message: '新建失败',
              type: 'error',
              duration: 1000
            })
            this.not_empty()
          }
        }
      )
    },
    del (row) {
      console.log(row)
      this.$confirm('记录删除后将无法恢复!', '提示', {
        // confirmButtonText: '确定',
        // cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.$common.req(
          '/index.php?model=jlsafe&m=mission&a=index&cmd=104', {
            mission_id: row.mission_id
          },
          res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
            this.showRight = false
          }
        )
      })
    }
  },
  watch: {
    'dialogInfo.show' (val) {
      if (!val) {
        this.not_empty()
      }
    }
  },
  created () {
    this.danger_type_id = ''
    this.getList()
    this.getDangerType()
  }
}
</script>
<style lang="less" scoped>
  .condition {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .boxT {
    position: relative;
  }
  .el-input {
    width: 150px;
  }
  .table {
    margin: 25px 0;
  }
  .el-row {
    margin: 10px 0;
  }
  .lh28 {
    line-height: 28px;
  }
  pre {
    color: inherit; // line-height: 18px;
    font-family: inherit;
  }
</style>
<style lang="less">
  #edit {
    .el-dialog__body {
      padding: 10px 25px;
    }
    .el-input__inner {
      padding: 0 2px;
      font-size: 14px;
    }
  }
  .el-row .el-checkbox-group {
    height: 40px;
    display: flex;
    align-items: center;
  }
</style>
