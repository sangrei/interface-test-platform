<template>
  <div class="login_context">
    <div class="login_box">
      <el-button
        type="warning"
        plain
        style="width: 20%; float: right; margin-top: 10px; margin-right: 10px"
        @click="$router.push('/register')"
        >注&nbsp;&nbsp;&nbsp;册</el-button
      >
      <div class="title">柠檬班接口自动化测试平台</div>
      <!-- label-width是用占位的 -->
      <el-form
        ref="loginRef"
        class="login_from"
        :model="user"
        :rules="rulesLogin"
      >
        <!-- 账号密码输入框 -->
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="user.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            type="password"
            v-model="user.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-s-goods"
          ></el-input>
        </el-form-item>
        <el-form-item label="记住账号" size="mini">
          <el-switch v-model="status"></el-switch>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            size="medium"
            style="width: 100%"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import * as account from "@/api/account.js";
import * as storage from "@/util/storage.js";

export default {
  data() {
    return {
      // 登录的数据对象
      user: {
        username: "",
        password: "",
      },
      status: false,
      //记住账号Key
      rememberMe: "remeberme",
      rulesLogin: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录用户名", trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    //给window对象绑定keydown事件
    window.addEventListener("keydown", this.keyDown);
    //获取记住的用户名
    const username = storage.get(this.rememberMe);
    if (username) {
      this.user.username = username;
      this.status = true;
    }
  },
  //Vue生命周期销毁钩子
  destroyed() {
    //给window对象移除keydown事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
  methods: {
    //设置当前用户，辅助函数写法，不使用别名
    ...mapMutations([
      "setCurrentUser", // 将 `this.setCurrentUser(currentUser)` 映射为 `this.$store.commit('setCurrentUser', currentUser)`
    ]),
    //设置当前用户，辅助函数写法，使用别名
    ...mapMutations({
      setU: "setCurrentUser", // 将 `this.currentUser(currentUser)` 映射为 `this.$store.commit('setCurrentUser', currentUser)`
    }),
    login() {
      account.login(this.user).then((response) => {
        let result = response.data;
        //登录失败
        if (result.code !== 0) {
          this.$message({
            message: result.message,
            type: "error",
          });
          return;
        }

        //登录成功
        let user = result.data;
        //1、设置当前用户
        // this.$store.commit('setCurrentUser',user)
        //设置当前用户，辅助函数写法
        this.setCurrentUser(user);
        //设置当前用户，辅助函数写法，带别名
        // this.setU(user)
        //2、如果当前有默认选择项目，则跳转到[项目首页]；否则，跳转到[所有项目]页
        let redirect = "/project";
        let currenUserProject = this.$store.getters.getCurrentUserProject
        if (
          !currenUserProject ||
          currenUserProject.username != user.username
        ) {
          redirect = "/allProject";
        }
        this.$router.push(redirect);
        //3、如果勾选了记住登录，则设置到localStorage中；否则，移除
        if (this.status) {
          storage.set(this.rememberMe, this.user.username);
        } else {
          storage.remove(this.rememberMe);
        }
      });
    },
    //按键事件监听
    keyDown(e) {
      //如果按下的是回车键，直接登录
      if (e.keyCode == 13) {
        this.login();
      }
    },
  },
};
</script>

<style scoped>
.title {
  position: absolute;
  left: 50%;
  top: 25%;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #409eff;
}

.login_context {
  background: rgb(255, 255, 255);
  height: 100%;
}
.login_box {
  width: 620px;
  height: 450px;
  box-shadow: 0 0 10px rgb(21, 21, 90);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_from {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 5% 10%;
  box-sizing: border-box;
}

.btns {
  width: 100%;
  position: flex;
  float: right;
  justify-content: flex-end;
}
</style>
