<!--快捷标签-->
<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
      >
        <router-link :to="item.path" class="tags-li-title">
          {{ item.title }}
        </router-link>
        <span  v-if="tagsList.length>1" class="tags-li-icon" @click="closeTags(index)"
          ><i class="el-icon-close"></i
        ></span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tagsList: [],
    }
  },
  methods: {
    isActive(path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTags(index) {
      //从指定位置开始删除1个元素,并取删除的元素列表第1个
      const delItem = this.tagsList.splice(index, 1)[0]

      //如果当前快捷标签数量大于0，则不处理或路由到最后一个标签；否则路由到项目首页
      if(this.tagsList.length>0){
        if(delItem.path == this.$route.fullPath){
          this.$router.push(this.tagsList[this.tagsList.length-1].path)
        }
      }else{
        this.$router.push('/')
      }
      
    },
    // 关闭全部标签
    closeAll() {
      this.$store.commit('setTagsList',[])
      this.$router.push('/')
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter((item) => {
        return item.path === this.$route.fullPath
      })
      this.$store.commit('setTagsList',curItem)
    },
    //设置标签
    setTags(route) {
      //查看当前路由是否在标签中
      const isExist = this.tagsList.some((item) => {
        return item.path === route.fullPath
      })
      //不存在，添加
      if (!isExist) {
        //保持最多8个标签
        if (this.tagsList.length >= 8) {
          this.tagsList.shift()  //删除数组中的第1个元素
        }
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath
        })
      }
    },
    handleTags(command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    },
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0
    },
    tagsList(){
      return this.$store.getters.getTagsList
    }
  },
  watch: {
    //监听路由
    $route(newValue) {
      this.setTags(newValue)
    },
  },
  created() {
    //初始时，一般在页面刷新时，会调用
    this.setTags(this.$route)
  },
}
</script>


<style>
.tags {
  position: relative;
  height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
