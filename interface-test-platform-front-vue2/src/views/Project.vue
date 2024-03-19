<template>
  <!--项目首页-->
  <div class="project">
    <el-card style="min-height: calc(100vh - 110px)">
      <div>
        <el-row :gutter="20" class="mgb20">
          <el-col :span="6">
            <!--项目名称-->
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-place grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ project.name }}
                  </div>
                </div>
                <el-button
                  type="text"
                  @click="$router.push('/allProject')"
                  style="position: relative; bottom: -25px; right: 5px"
                  >切换</el-button
                >
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <!--测试任务数量-->
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-s-flag grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ totalOfTask }}
                  </div>
                  <div>测试任务</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <!--项目模块数量-->
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-folder grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ totalOfModule }}
                  </div>
                  <div>项目模块</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <!--运行环境数量-->
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-cloudy grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ totalOfEnvironment }}
                  </div>
                  <div>运行环境</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div></div>
      </div>
      <el-divider content-position="left"
        ><span style="color: #000000; font-weight: bold; font-size: 20px"
          >项目基本信息</span
        ></el-divider
      >
      <el-row :gutter="10">
        <el-col :span="6">
          <!--测试任务列表-->
          <task-simple @callback='callbackOfTask'></task-simple>
        </el-col>
        <el-col :span="8">
          <!--项目模块列表及CRUD-->
          <module @callback='callbackOfModule'></module>
        </el-col>
        <el-col :span="10">
          <!--项目环境列表及CRUD-->
          <environment @callback='callbackOfEnvironment'></environment>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
//使用辅助函数引入
import {mapGetters} from 'vuex'
import Environment from '../components/environment/Environment.vue'
import Module from '../components/module/Module.vue'
import TaskSimple from '../components/task/TaskSimple.vue'
export default {
  name: 'Project',
  components: {
    TaskSimple,
    Module,
    Environment,
  },
  data() {
    return {
      totalOfTask: 0,
      totalOfModule:0,
      totalOfEnvironment:0
    }
  },
  computed: {
    //写法一：获取当前项目
    // project() {
    //   return this.$store.getters.getCurrentUserProject
    // },
    //写法二：获取当前项目，辅助函数写法
    ...mapGetters({
      project:'getCurrentUserProject',
    })
  },
  methods:{
    //任务组件回调
    callbackOfTask(total){
      this.totalOfTask = total
    },
    //模块组件回调
    callbackOfModule(total){
      this.totalOfModule = total
    },
    //模块组件回调
    callbackOfEnvironment(total){
      this.totalOfEnvironment = total
    }
  }
}
</script>

<style scoped>
.name {
  height: 60px;
  text-align: center;
  font: bold 28px/60px 'microsoft sans serif';
  margin-bottom: 10px;
}

.title {
  height: 50px;
}

/* 滑块样式设置 */
.scro {
  overflow: auto;
  width: 100%;
  height: 300px;
  float: left;
  margin: 5px;
  border: none;
}

.scro::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /*高宽分别对应横竖滚动条的尺寸*/
  /* height: 1px; */
}

.scro::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 1px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #a1a1a1;
  border-radius: 10px;
  height: 10px;
}

.scro::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

/* 顶部显示 */
.grid-content {
  display: flex;
  align-items: center;
  height: 80px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 25px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}
</style>