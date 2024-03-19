<template>
  <div class="AllProject">
    <headbar></headbar>
    <el-card style="min-height: calc(100vh - 110px)">
      <div style="margin: 0 50px">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8" v-for="project in projects" :key="project.id">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-7">
                <i class="el-icon-monitor grid-con-icon"></i>
                <div class="grid-cont-right">
                  <a href="javascript:void(0)">
                    <div class="grid-num" @click.stop="selectProject(project)">
                      {{ project.name }}
                    </div>
                  </a>
                  <div style="border-top: solid 1px #d8dee5">
                    <el-row :gutter="20">
                      <el-col :span="14">
                        <div style="text-indent: 10px; font-weight: bold">
                          负责人:{{ project.leaderName }}
                        </div>
                      </el-col>
                      <el-col :span="10" style="text-align:right;padding-right:20px;">
                        <el-dropdown
                          @command="handleItem(project, $event)"
                          placement="bottom" v-if="checkOperationRight(project)"
                        >
                          <span class="el-dropdown-link"> 更多操作 </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              icon="el-icon-edit-outline"
                              command="edit"
                              >编辑
                            </el-dropdown-item>
                            <el-dropdown-item
                              icon="el-icon-delete-solid"
                              style="color: crimson"
                              command="delete"
                              >删除
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <a href="javascript:void(0)">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-4" @click="showEdit(null)">
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      <i class="el-icon-plus" style="font-size: 60px"></i>
                    </div>
                  </div>
                </div>
              </el-card>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!--编辑对话框-->
    <el-dialog
      :visible.sync="editVisible"
      :title="currentId ? '编辑项目' : '添加项目'"
      center
    >
      <project-edit
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="editVisible"
      ></project-edit>
    </el-dialog>
  </div>
</template>

<script>
import Headbar from '@/layout/Headbar.vue'
import * as projectApi from '@/api/project'
import ProjectEdit from '../components/project/ProjectEdit.vue'
export default {
  name: 'AllProject',
  components: {
    Headbar,
    ProjectEdit,
  },
  data() {
    return {
      projects: [],
      editVisible: false,
      currentId: null,
    }
  },
  created() {
    //获取初始化数据
    this.getInitData()
  },
  methods: {
    getInitData() {
      //获取所有项目
      projectApi.queryAll().then((response) => {
        let result = response.data
        this.projects = result.data
      })
    },
    //更多操作下拉菜单事件
    handleItem(project, cmd) {
      if (cmd === 'edit') {
        this.showEdit(project.id)
      } else if (cmd === 'delete') {
        this.remove(project.id)
      }
    },
    //显示详情弹窗
    showEdit(id) {
      //设置传递的id
      this.currentId = id
      //显示弹出对话框
      this.editVisible = true
    },
    //隐藏用户详情弹窗
    hideEdit() {
      this.editVisible = false
    },
    //保存成功回调
    callbackForSave() {
      //隐藏弹窗
      this.hideEdit()
      //重新获取数据列表
      this.getInitData()
    },
    //取消回调
    callbackForCancel() {
      //隐藏弹窗
      this.hideEdit()
    },
    //删除
    remove(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          projectApi.remove(id).then((response) => {
              if (response.data.code === 0) {
                //成功提示
                this.$message({
                  message: '删除成功。',
                  type: 'success',
                })
                //重新加载数据
                this.getInitData()
              } else {
                //错误提示
                this.$message({
                  message: response.data.message,
                  type: 'warning',
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //选择当前项目
    selectProject(project) {
      //获取当前用户
      let user = this.$store.getters.getCurrentUser
      //将当前用户名设置到当前选中项目，即当前用户选中项目
      project.username = user.username
      //保存到Vuex
      this.$store.commit('setCurrentUserProject', project)
      //跳转到项目首页
      this.$router.push('/project')
    },
    //验证项目操作权限
    checkOperationRight(project){
      let result = false
      let user = this.$store.getters.getCurrentUser
      if(project.createById == user.id || project.leaderId == user.id){
        result = true
      }

      return result
    }
  },
}
</script>

<style scoped>
.el-col {
  margin-top: 20px;
}

.title {
  text-align: right;
  font: bold 30px/60px 'microsoft sans serif';
  border-bottom: solid 2px #bebebe;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 120px;
}

.grid-cont-right {
  flex: 1;
  font-size: 14px;
  color: #999;
}

.grid-num {
  height: 50px;
  line-height: 50px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}

.grid-con-icon {
  font-size: 100px;
  width: 180px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(110, 177, 240);
}

.grid-con-1 .grid-num {
  color: rgb(110, 177, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(126, 204, 132);
}

.grid-con-2 .grid-num {
  color: rgb(126, 204, 132);
}

.grid-con-3 .grid-con-icon {
  background: rgb(239, 168, 52);
}

.grid-con-3 .grid-num {
  color: rgb(239, 168, 52);
}

.grid-con-4 .grid-con-icon {
  background: rgb(255, 255, 255);
}

.grid-con-4 .grid-num {
  background: rgb(255, 255, 255);
}

.grid-con-5 .grid-con-icon {
  background: rgb(134, 198, 180);
}

.grid-con-5 .grid-num {
  color: rgb(134, 198, 180);
}

.grid-con-6 .grid-con-icon {
  background: rgb(127, 132, 179);
}

.grid-con-6 .grid-num {
  color: rgb(127, 132, 179);
}

.grid-con-7 .grid-con-icon {
  background: rgb(179, 181, 144);
}

.grid-con-7 .grid-num {
  color: rgb(179, 181, 144);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.el-dialog__header {
  padding: 0px 20px 20px;
}
</style>