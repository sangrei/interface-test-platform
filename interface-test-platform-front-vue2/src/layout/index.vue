<template>
  <div class="wrapper">
		<headbar></headbar>
		<sidebar></sidebar>
		<div class="content-box" :class="{'content-collapse':$store.getters.getCollapse}">
			<tags></tags>
			<div class="content">
				<transition name="move" mode="out-in">
					<keep-alive :include="cacheViews">
						<router-view></router-view>
					</keep-alive>
				</transition>
				<el-backtop target=".content"></el-backtop>
			</div>
		</div>
	</div>
</template>
<script>
import Sidebar from './Sidebar'
import Headbar from './Headbar'
import Tags from './Tags.vue';

export default {
  name: "Main",
  components:{
    Headbar,
    Sidebar,
    Tags
  },
  data(){
    return {
    }
  },
  computed: {
    cacheViews(){
      //需要缓存的页面名称，需要与相应页面export中name一致
      let needCacheRouters = ['TestCase']
      return needCacheRouters
    }
  }
}
</script>
<style scoped>
</style>