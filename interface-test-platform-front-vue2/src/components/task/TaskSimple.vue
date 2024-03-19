<template>
  <div class="task-simple">
    <el-card
      class="box-card"
      style="height: 450px; box-shadow: 0 0 5px rgb(85, 170, 255)"
    >
      <el-row :gutter="20" style="line-height: 40px">
        <el-col :span="12">
          <h4>测试任务</h4>
        </el-col>
      </el-row>
      <div class="scro">
        <el-table :show-header="false" :data="tasks" style="width: 100%">
          <el-table-column prop="name" label="模块名" min-width="160">
          </el-table-column>
          <el-table-column label="操作" min-width="60">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-view"
                @click="$router.push('/dataAnalysis/'+scope.row.id)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as taskApi from '@/api/task'

export default {
  name: 'TaskSimple',
  data() {
    return {
      tasks: [],
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
      //获取所有任务
      taskApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.tasks = result.data
        this.$emit('callback',this.tasks.length)
      })
    },
  },
}
</script>

<style scoped>
</style>