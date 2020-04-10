<template>
  <div class="test">
    <div class="side" style="width: 300px">
      <el-menu class="el-menu-vertical-demo" :collapse="isCollapse">
          <Menu :menuList="this.menuList"></Menu>
          <el-link @click="isCollapse = !isCollapse" style="font-size: 30px; margin-top: 30px; margin-left: 40%"  
              :underline="false" icon="el-icon-s-fold" > </el-link>
      </el-menu>
    </div>
  </div>
</template>

<script>
import Menu from '../components/common/Menu.vue'
export default {
  components: {
    Menu: Menu
  },
  data () {
    return {
      isCollapse: false,
      menuList: [{
        'i': 'el-icon-s-order',
        'l': '#/f/user/home',
        'o': '_self',
        't': '用户查书'
      },
      {
        'c': [{
          'i': 'el-icon-s-order',
          'l': '/#/f/myBorrow',
          'o': '_self',
          't': '我的借阅信息'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/personInfo',
          'o': '_self',
          't': '个人信息'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/modifyPwd',
          'o': '_self',
          't': '密码修改'
        }],
        'i': 'el-icon-s-order',
        'o': '_self',
        't': '我的面板',
        'l': '#/f/我的面板'
      },
      {
        'i': 'el-icon-s-order',
        'l': '#/f/borrowList',
        'o': '_self',
        't': '借阅管理'
      },
      {
        'i': 'el-icon-s-order',
        'l': '#/f/admin/home',
        'o': '_self',
        't': '图书管理'
      },
      {
        'i': 'el-icon-s-order',
        'l': '#/wf/taskHandle?menuCode=register',
        'o': '_self',
        't': '注册审核'
      },
      {
        'i': 'el-icon-s-order',
        'l': '#/f/statistics',
        'o': '_self',
        't': '统计管理'
      },
      {
        'i': 'el-icon-s-order',
        'l': '/#/f/userMain',
        'o': '_self',
        't': '读者管理'
      },
      {
        'c': [{
          'c': [{
            'i': 'el-icon-s-order',
            'l': '#/f/orgMain',
            'o': '_self',
            't': '机构管理'
          },
          {
            'i': 'el-icon-s-order',
            'l': '#/f/userMain',
            'o': '_self',
            't': '用户管理'
          },
          {
            'i': 'el-icon-s-order',
            'l': '#/f/roleMain',
            'o': '_self',
            't': '角色管理'
          },
          {
            'i': 'el-icon-s-order',
            'l': '#/f/resMain',
            'o': '_self',
            't': '资源维护'
          },
          {
            'i': 'el-icon-s-order',
            'l': '#/f/dictMain',
            'o': '_self',
            't': '字典管理'
          }],
          'i': 'el-icon-s-order',
          'o': '_self',
          't': '系统设置',
          'l': '#/f/系统设置'
        },
        {
          'c': [{
            'i': 'el-icon-s-order',
            'l': '#/f/logQueryMain',
            'o': '_self',
            't': '日志查询'
          }],
          'i': 'el-icon-s-order',
          'o': '_self',
          't': '日志管理',
          'l': '#/f/日志管理'
        },
        {
          'c': [{
            'i': 'el-icon-s-order',
            'l': '#/f/sysInfoMain',
            'o': '_self',
            't': '全局参数配置'
          }],
          'i': 'el-icon-s-order',
          'o': '_self',
          't': '平台管理',
          'l': '#/f/平台管理'
        }],
        'i': 'el-icon-s-order',
        'o': '_self',
        't': '系统管理',
        'l': '#/f/系统管理'
      },
      {
        'c': [{
          'i': 'el-icon-s-order',
          'l': '#/f/procTypeManage',
          'o': '_self',
          't': '流程定义管理'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/moduleBind',
          'o': '_self',
          't': '流程配置'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/taskConfig',
          'o': '_self',
          't': '任务配置'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/taskList',
          'o': '_self',
          't': '任务处理'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/processInstanceMonitor',
          'o': '_self',
          't': '流程实例监控'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/userProcessInstanceMonitor',
          'o': '_self',
          't': '用户流程实例监控'
        },
        {
          'c': [{
            'i': 'el-icon-s-order',
            'l': '#/f/myDelegate',
            'o': '_self',
            't': '我委托的事项'
          },
          {
            'i': 'el-icon-s-order',
            'l': '#/f/myReceivedTask',
            'o': '_self',
            't': '委托给我的'
          }],
          'i': 'el-icon-s-order',
          'o': '_self',
          't': '事项委托',
          'l': '#/f/事项委托'
        },
        {
          'i': 'el-icon-s-order',
          'l': '#/f/processLog',
          'o': '_self',
          't': '流程日志'
        }],
        'l': '#/f/工作流管理',
        'i': 'el-icon-s-order',
        'o': '_self',
        't': '工作流管理'
      }]
    }
  },
  methods: {
    menuSelected () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
