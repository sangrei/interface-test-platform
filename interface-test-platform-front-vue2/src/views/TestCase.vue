<template>
  <div class="test-case">
    <div
      class="left l_float"
      style="box-shadow: 0 0 5px #55aaff; border: solid 1px #55aaff"
    >
      <test-case-list></test-case-list>
    </div>
    <div class="right r_float">
      <el-row>
        <el-col :span="24">
          <el-card>
            <test-case-edit></test-case-edit>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import TestCaseList from '@/components/testcase/TestCaseList.vue'
import TestCaseEdit from '@/components/testcase/TestCaseEdit.vue'

export default {
  name: 'TestCase',
  components: { TestCaseList, TestCaseEdit},
  data() {
    return {
    }
  }
}
</script>

<style scoped>
/*  右侧用例编辑 */
.inter_input {
  width: 80%;
  margin-right: 1%;
}

.inter_btn {
  width: 18%;
}

/* 左侧用例显示 */
#inter_list .el-select {
  width: 100%;
}

#inter_list .el-input__inner {
  border-radius: 8px;
}

.l_float {
  float: left;
}

.r_float {
  float: right;
   height: calc(100vh - 90px);
  overflow: scroll;
}

.main {
  position: relative;
}

.left {
  width: 350px;
  position: fixed;
  background: #fff;
}

.right {
  width: calc(99% - 350px);
  background: #fff;
  margin-left: 1%;
  font-size: 8px;
  position: absolute;
  left: 350px;
}
</style>