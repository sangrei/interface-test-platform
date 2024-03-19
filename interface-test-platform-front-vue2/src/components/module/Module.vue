<template>
  <div class="module">
    <el-card
      class="box-card"
      style="height: 450px; box-shadow: 0 0 5px rgb(85, 170, 255)"
    >
      <el-row :gutter="20" style="line-height: 40px">
        <el-col :span="12">
          <h4>功能模块</h4>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="showEdit(null)"
            plain
          >
            添加模块</el-button
          >
        </el-col>
      </el-row>
      <div class="scro">
        <el-table :show-header="false" :data="modules" style="width: 100%">
          <el-table-column prop="name" label="模块名" min-width="200">
          </el-table-column>
          <el-table-column label="操作" min-width="130">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-edit-outline"
                @click="showEdit(scope.row.id)"
              >
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-delete"
                @click="remove(scope.row.id)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="editVisible"
      :title="currentId ? '编辑模块' : '添加模块'"
      center
    >
      <module-edit
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="editVisible"
      ></module-edit>
    </el-dialog>
  </div>
</template>

<script>
import ModuleEdit from '@/components/module/ModuleEdit'
import * as moduleApi from '@/api/module'

export default {
  name: 'Module',
  components: {
    ModuleEdit,
  },
  data() {
    return {
      modules: [],
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
      //获取所有模块
      moduleApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.modules = result.data
        this.$emit('callback',this.modules.length)
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
          moduleApi.remove(id).then((response) => {
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