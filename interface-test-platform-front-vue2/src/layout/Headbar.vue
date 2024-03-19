<template>
  <div class="header">
    <!-- 【左侧】折叠按钮，使用Vuex状态切换；而且，如果是项目选择页，不显示按钮 -->
    <div
      class="collapse-btn"
      @click="$store.commit('toggleCollapse')"
      v-if="$route.path.toLowerCase() != '/allproject'"
    >
      <i v-if="!$store.getters.getCollapse" class="el-icon-notebook-2"></i>
      <i v-else class="el-icon-notebook-1"></i>
    </div>
    <!--【中间】软件标题-->
    <div class="logo">柠檬班接口自动化测试平台</div>
    <!--【右侧】登录人信息-->
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip
            effect="dark"
            :content="fullscreen ? `取消全屏` : `全屏`"
            placement="bottom"
          >
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="@/assets/img/logo.png" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="operate">
          <span class="el-dropdown-link">
            {{ $store.getters.getCurrentUser.name }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="changeProject"
              >切换项目</el-dropdown-item
            >
            <el-dropdown-item divided command="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import * as accountApi from "@/api/account"
export default {
  name: "Header",
  data() {
    return {
      fullscreen: false,
      message: 2
    };
  },
  methods: {
    //下拉菜单操作
    operate(command) {
      if (command == "changeProject") {
        //切换项目，跳转到所有项目页面
        this.$router.push("/allProject");
      } else if (command == "logout") {
        accountApi.logout().then((response) => {
          let result = response.data;
          //登出失败
          if (result.code !== 0) {
            this.$message({
              message: result.message,
              type: "error",
            });
            return;
          }
          //如果登出成功，则作以下操作
          //1、清除当前用户前端登录票据
          this.$store.commit("removeCurrentUser");
          //2、跳转到登录页
          this.$router.push("/login");
        });
      }
    },
    // 全屏
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background: #000000;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  width: 350px;
  line-height: 70px;
}

.logo {
  position: absolute;
  left: 50%;
  margin-left: -125px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>