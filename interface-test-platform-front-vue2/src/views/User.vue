<template>
  <div id="user">
    <el-card class="box-card" style="min-height: 700px">
      <!--标题及查询区域-->
      <el-card
        shadow="hover"
        :body-style="{ padding: '0px' }"
        style="border-bottom: solid #eff7ff 3px"
      >
        <div class="grid-content grid-con-1">
          <span class="grid-con-icon">用户管理</span>
          <div class="grid-cont-right">
            <el-row :gutter="20">
              <el-col :span="4"
                ><div style="line-height: 2.5rem">用户名</div>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="search.username"
                  autocomplete="off"
                  placeholder="请输入用户名"
                >
                </el-input>
              </el-col>
              <el-col :span="4"
                ><div style="line-height: 2.5rem">姓名</div>
              </el-col>
              <el-col :span="6">
                <el-input
                  v-model="search.name"
                  autocomplete="off"
                  placeholder="请输入姓名"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <div class="grid-cont-right">
                  <!-- 添加项目的按钮 -->
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="getInitData"
                    plain
                  >
                    查询
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="width:200px;text-align:right;margin-right:20px;">
            <!-- 添加项目的按钮 -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="showEdit(null)"
              plain
            >
              添加用户
            </el-button>
          </div>
        </div>
      </el-card>
      <!--数据列表区域-->
      <el-card style="margin-top: 20px">
        <!--  接口列表 -->
        <el-table
          :data="users"
          style="width: 100%; margin-top: 20px"
          size="mini"
        >
          <el-table-column prop="id" label="ID" width="60"> </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100" align="center">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="100" align="center">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="roles" label="角色" width="140">
            <template slot-scope="scope">
              <el-tag
                type="info"
                v-for="item in scope.row.roles"
                :key="item"
                style="margin-right: 2px"
                >{{ item }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="createByName"
            label="创建人"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="135"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="updateByName"
            label="修改人"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            width="135"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="showEdit(scope.row.id)"
                plain
                icon="el-icon-edit-outline"
                >编辑</el-button
              >
              <!-- <el-button
                size="mini"
                type="danger"
                @click="remove(scope.row.id)"
                plain
                icon="el-icon-delete"
                >删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
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
    <el-dialog title="人员信息" :visible="editVisible" center>
      <user-edit
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="editVisible"
      ></user-edit>
    </el-dialog>
  </div>
</template>
<script>
import * as userApi from '@/api/user'
import UserEdit from '@/components/user/UserEdit'
export default {
  name: 'users',
  components: {
    UserEdit,
  },
  data() {
    return {
      editVisible: false,
      users: [],
      search: {
        pageIndex: 1,
        pageSize: 10,
      },
      total: 0, //记录总数
      currentId: null,
    }
  },
  created() {
    this.getInitData()
  },
  methods: {
    //获取数据
    getInitData() {
      userApi.query(this.search).then((response) => {
        let result = response.data
        this.users = result.data
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
    //保存成功回调
    callbackForSave() {
      //隐藏弹窗
      this.editVisible = false
      //重新获取数据列表
      this.getInitData()
    },
    //取消回调
    callbackForCancel() {
      //隐藏弹窗
      this.editVisible = false
      //重新获取数据列表
      this.getInitData()
    },
    //删除
    remove(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          userApi.remove(id).then((response) => {
            let result = response.data
            if (result.code == 0) {
              //成功提示
              this.$message({
                message: '删除成功。',
                type: 'success',
              })
              //重新加载数据
              this.getInitData()
            } else {
              //业务异常处理
              this.$message({
                message: result.message,
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
      this.search.pageSize = val
      //重新加载数据
      this.getInitData()
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      //重新加载数据
      this.getInitData()
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