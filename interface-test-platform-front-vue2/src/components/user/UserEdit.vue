<template>
  <div id="user-edit">
    <el-form ref="user" :model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.username" placeholder="用输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" style="text-align: left">
        <el-input
          v-model="user.password"
          placeholder="用输入密码"
          v-if="!user.id"
        ></el-input>
        <el-button type="primary" @click="isShowReset = true" v-if="id && !isShowReset"
          >重置密码</el-button
        >
        <el-input
          v-model="resetPassword"
          placeholder="用输入密码"
          v-if="isShowReset"
        ></el-input>
        <el-button type="primary" @click="reset" v-if="isShowReset"
          >确定</el-button
        >
        <el-button @click="isShowReset = false" v-if="isShowReset"
          >取消</el-button
        >
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name" placeholder="用输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" placeholder="用输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="user.mobile" placeholder="用输入电话"></el-input>
      </el-form-item>
      <el-form-item label="角色" style="text-align: left">
        <el-checkbox-group v-model="user.roles">
          <el-checkbox label="admin">管理员</el-checkbox>
          <el-checkbox label="staff">普通员工</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="user.description"
          placeholder="用输入描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
				<el-button @click="cancel" size='mini'>取 消</el-button>
				<el-button type="primary" @click="save" size='mini'>保存</el-button>
			</div>
  </div>
</template>
<script>
import { getById, create, modify, reset } from '@/api/user'
export default {
  name: 'UserEdit',
  props: {
    id: Number,
  },
  data() {
    return {
      user: {
        roles: [],
      },
      isShowReset: false,
      resetPassword: null,
    }
  },
  created: function () {
    //获取初始数据
    this.getInitData()
  },
  methods: {
    //获取数据
    getInitData() {
      //如果参数id不为空，则获取需要修改的数据
      if (this.id !== null) {
        let _id = this.id
        getById(_id).then((response) => {
          let result = response.data
          this.user = result.data
        })
      }
    },
    //保存
    save() {
      //如果id为空，新增；如果不为空，则为更新
      if (this.user.id === null || this.user.id === undefined) {
        create(this.user).then((response) => {
          let result = response.data
          if (result.code == 0) {
            //成功提示
            this.$message({
              message: '保存成功。',
              type: 'success',
            })
            //触发父组件的保存成功事件
            this.$emit('callbackForSave')
          } else {
            //业务异常处理
            this.$message({
              message: result.message,
              type: 'warning',
            })
          }
        })
      } else {
        modify(this.user).then((response) => {
          let result = response.data
          if (result.code == 0) {
            //成功提示
            this.$message({
              message: '保存成功。',
              type: 'success',
            })
            //触发父组件的保存成功事件
            this.$emit('callbackForSave')
          } else {
            //业务异常处理
            this.$message({
              message: result.message,
              type: 'warning',
            })
          }
        })
      }
    },
    //回调
    callbackChangeRoles(data) {
      this.user.roles = data
    },
    //取消
    cancel() {
      //触发父组件的取消事件
      this.$emit('callbackForCancel')
    },
    //重置密码
    reset() {
      let loginUser = {
        id: this.user.id,
        username: this.user.username,
        password: this.resetPassword,
      }
      reset(loginUser).then((response) => {
        let result = response.data
        if (result.code == 0) {
          //成功提示
          this.$message({
            message: '重置成功。',
            type: 'success',
          })
          this.isShowReset = false
          //触发父组件的保存成功事件
          this.$emit('callbackForSave')
        } else {
          //业务异常处理
          this.$message({
            message: result.message,
            type: 'warning',
          })
        }
      })
    },
  },
}
</script>