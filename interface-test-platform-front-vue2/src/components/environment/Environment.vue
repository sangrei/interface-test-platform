<template>
  <div class="environment">
    <el-card
      class="box-card"
      style="height: 450px; box-shadow: 0 0 5px rgb(85, 170, 255)"
    >
      <el-row :gutter="20" style="line-height: 40px">
        <el-col :span="12">
          <h4>项目环境</h4>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="showEdit(null)"
            plain
          >
            添加环境
          </el-button>
        </el-col>
      </el-row>
      <div class="scro">
        <el-collapse>
          <el-collapse-item
            :title="env.name"
            :name="env.id"
            v-for="env in environments"
            :key="env.id"
          >
            <template slot="title">
              <span style="font-weight: bold; width: 150px">{{
                env.name
              }}</span>
              <span style="font-weight: bold; color: #20a0ff">{{
                env.host
              }}</span>
            </template>
            <!-- 此处可定义展开显示的内容 -->
            <el-card style="box-shadow: 0 0 5px rgb(85, 170, 255); width: 90%">
              <el-row :gutter="20">
                <el-col :span="16">
                  <div>
                    <b
                      >服务器地址 :
                      <span style="color: #797979">{{ env.host }}</span></b
                    >
                  </div>
                  <div><b>数据库配置:</b></div>
                  <div
                    style="text-indent: 40px; font-weight: bold; color: #797979"
                  >
                    <div>host : {{ JSON.parse(env.dbConfig).host }}</div>
                    <div>user : {{ JSON.parse(env.dbConfig).user }}</div>
                    <div>
                      password : {{ JSON.parse(env.dbConfig).password }}
                    </div>
                    <div>db : {{ JSON.parse(env.dbConfig).db }}</div>
                    <div>charset : {{ JSON.parse(env.dbConfig).charset }}</div>
                    <div>
                      autocommit : {{ JSON.parse(env.dbConfig).autocommit }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div style="text-align: center">
                    <div style="margin: 20px auto">
                      <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="showEdit(env.id)"
                        >修改环境</el-button
                      >
                    </div>
                    <div>
                      <el-button
                        type="danger"
                        plain
                        size="mini"
                        @click="remove(env.id)"
                        >删除环境</el-button
                      >
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="editVisible"
      :title="currentId ? '编辑项目环境' : '添加项目环境'"
      center
    >
      <environment-edit
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="editVisible"
      ></environment-edit>
    </el-dialog>
  </div>
</template>

<script>
import EnvironmentEdit from '@/components/environment/EnvironmentEdit'
import * as environmentApi from '@/api/environment'

export default {
  name: 'Environment',
  components: {
    EnvironmentEdit,
  },
  data() {
    return {
      environments: [],
      editVisible: false,
      currentId: null,
    }
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentUserProject
    },
  },
  created() {
    //获取初始化数据
    this.getInitData()
  },
  methods: {
    //获取初始化数据
    getInitData() {
      //获取所有项目环境
      environmentApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.environments = result.data
        this.$emit('callback',this.environments.length)
      })
    },
    //显示详情弹窗
    showEdit(id) {
      //设置传递的id
      this.currentId = id
      //显示弹出对话框
      this.editVisible = true
    },
    //隐藏用户详情弹窗
    hideDetail() {
      this.editVisible = false
    },
    //保存成功回调
    callbackForSave() {
      //隐藏弹窗
      this.hideDetail()
      //重新获取数据列表
      this.getInitData()
    },
    //取消回调
    callbackForCancel() {
      //隐藏弹窗
      this.hideDetail()
    },
    //删除
    remove(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          environmentApi.remove(id).then((response) => {
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
  },
}
</script>

<style scoped>
</style>