<template>
  <div class="interface">
    <el-card class="box-card" style="min-height: 700px">
      <el-card
        shadow="hover"
        :body-style="{ padding: '0px' }"
        style="border-bottom: solid #eff7ff 3px"
      >
        <div class="grid-content grid-con-1">
          <span class="grid-con-icon">接口列表</span>
          <div class="grid-cont-right">
            <el-row :gutter="20">
              <el-col :span="7"
                ><div style="line-height: 2.5rem">选择模块</div>
              </el-col>
              <el-col :span="12">
                <el-select v-model="search.moduleId" placeholder="请选择模块">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in modules"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <div class="grid-cont-right">
                  <!-- 添加项目的按钮 -->
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="getInterfaces"
                    plain
                  >
                    查询
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="grid-cont-right">
            <!-- 添加项目的按钮 -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showEdit(null)"
              plain
            >
              添加接口
            </el-button>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 20px">
        <!--  接口列表 -->
        <el-table
          :data="interfaces"
          style="width: 100%; margin-top: 20px"
          size="mini"
        >
          <el-table-column prop="id" label="ID" width="60"> </el-table-column>
          <el-table-column
            prop="name"
            label="接口名称"
            min-width="130"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="path"
            label="接口地址"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="requestMethod"
            label="请求方法"
            min-width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="responseType"
            label="响应类型"
            min-width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="developerName"
            label="开发人员"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="module.name"
            label="所属模块"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" min-width="120" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="showEdit(scope.row.id)"
                plain
                icon="el-icon-edit-outline"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="remove(scope.row.id)"
                plain
                icon="el-icon-delete"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.pageIndex"
          :page-sizes="[5, 10, 15, 20, 25]"
          :page-size="search.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </el-card>
    <!--编辑对话框-->
    <el-dialog
      :visible.sync="editVisible"
      :title="currentId ? '编辑接口' : '添加接口'"
      center
    >
      <interface-edit
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="editVisible"
      ></interface-edit>
    </el-dialog>
  </div>
</template>

<script>
import InterfaceEdit from '@/components/interface/InterfaceEdit'
import * as interfaceApi from '@/api/interface'
import * as moduleApi from '@/api/module'

export default {
  name: 'Interface',
  components: {
    InterfaceEdit,
  },
  data() {
    return {
      editVisible: false,
      modules: [],
      interfaces: [],
      search: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0,
      currentId: null,
    }
  },
  computed: {
    //获取当前项目
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
    async getInitData() {
      //获取所有模块
      await moduleApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.modules = result.data
      })
      //获取所有接口
      await this.getInterfaces()
    },
    //获取所有接口
    getInterfaces() {
      this.search.projectId = this.project.id
      interfaceApi.query(this.search).then((response) => {
        let result = response.data
        this.interfaces = result.data
        this.total = result.total
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
          interfaceApi.remove(id).then((response) => {
            if (response.data.code == 0) {
              this.$message({
                message: '删除成功。',
                type: 'success',
              })
              //重新加载数据
              this.getInitData()
            } else {
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
    handleSizeChange(val) {
      this.pageSize = val
      //重新加载数据
      this.getInterfaces()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      //重新加载数据
      this.getInterfaces()
    },
  },
}
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 80px;
}

.grid-cont-right {
  flex: 1;
  font-size: 16px;
  color: #000;
  font-weight: bold;
  text-align: right;
  margin-right: 20px;
}

.grid-con-icon {
  font-size: 24px;
  width: 400px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #409eff;
  font-weight: bold;
}

.grid-con-1 .grid-con-icon {
  background: #eff7ff;
}
</style>
