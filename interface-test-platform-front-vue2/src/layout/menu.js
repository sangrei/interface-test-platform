// 定义菜单项
export const menu = [{
		icon: 'el-icon-s-home',
		index: '/project',
		title: '项目首页',
		roles:['admin','staff']
	},
	{
		icon: 'el-icon-folder',
		index: '/testcase',
		title: '用例管理',
		roles:['admin','staff']
	},
	{
		icon: 'el-icon-s-order',
		index: '/interface',
		title: '接口管理',
		roles:['admin','staff']
	},
	{
		icon: 'el-icon-s-flag',
		index: '/task',
		title: '任务管理',
		roles:['admin','staff']
	},
	{
		icon: 'el-icon-pie-chart',
		index: '/testrecord',
		title: '运行记录',
		roles:['admin','staff']
	},
	{
		icon: 'el-icon-s-platform',
		index: '/dataanalysis',
		title: '数据分析',
		roles:['admin','staff']
	},
	{
		icon: 'el-icon-user',
		index: '/user',
		title: '用户管理',
		roles:['admin']
	},
]
