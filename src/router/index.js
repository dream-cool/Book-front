import Vue from 'vue'
import Router from 'vue-router'
import FrontIndex from '@/components/FrontIndex.vue'
import BackIndex from '@/components/BackIndex.vue'
import Book from '@/components/back/book/Book.vue'
import Borrowing from '@/components/back/borrowing/Borrowing.vue'
import Category from '@/components/back/category/Category.vue'
import User from '@/components/back/user/User.vue'
import Statistics from '@/components/back/statistics/Statistics.vue'
import AddBook from '../components/back/book/AddBook'
import AddCategory from '../components/back/category/AddCategory'
import AddReader from '../components/back/user/AddReader.vue'
import BookDetail from '../components/back/book/BookDetail.vue'
import BookList from '../components/back/book/BookList.vue'
import BookInfo from '../components/back/book/BookInfo.vue'
import BorrowingList from '../components/back/borrowing/BorrowingList.vue'
import BorrowingStatistics from '../components/back/statistics/BorrowingStatistics.vue'
import CategoryList from '../components/back/category/CategoryList.vue'
import CategoryStatistics from '../components/back/statistics/CategoryStatistics.vue'
import GrantPrivilege from '../components/back/GrantPrivilege.vue'
import HandleBorrowing from '../components/back/borrowing/HandleBorrowing.vue'
import HandleReturn from '../components/back/borrowing/HandleReturn.vue'
import ReaderDetail from '../components/back/user/ReaderDetail.vue'
import ReaderList from '../components/back/user/ReaderList.vue'
import UserInfo from '../components/back/user/UserInfo.vue'
import StorageStatisticsByTime from '../components/back/statistics/StorageStatisticsByTime.vue'
import UserStatisticsByTime from '../components/back/statistics/UserStatisticsByTime.vue'
import EbookRead from '../components/front/EbookRead.vue'
import UpdateBook from '../components/back/book/UpdateBook.vue'
import UpdateEbook from '../components/back/book/UpdateEbook.vue'
import Login from '../components/Login.vue'
import NoAuthority from '../components/403.vue'
import MessageInfo from '../components/MessageInfo.vue'
import UpdatePassword from '../components/front/UpdatePassword.vue'
import Home from '../components/back/Home.vue'
import Personal  from '../components/Personal.vue'
import Index from '../components/front/Index.vue'
import Test from '../components/Test.vue'

Vue.use(Router)

export default new Router({
  routes: [

    {path: '/login', component: Login},
    {path: '/front/ebookRead/:id', component: EbookRead},
    {
      path: '/front',
      name: '前台',
      redirect () {
        return '/front/home'
      },
      component: FrontIndex,
      children: [
        {path: '/front/home',
          component: Index,
          meta: {}
        },
        {path: '/front/bookDetail/:id',
          component: BookDetail,
          name: '书籍详情',
          meta: {}},
        {path: '/front/test',
          component: Test,
          meta: {}
        },
        {
          path: '/front/messageInfo',
          component: MessageInfo,
          name: '我的信息',
          meta: { requireAuth: true }
        },
        {
          path: '/front/personal',
          component: Personal,
          name: '个人中心',
          meta: { requireAuth: true }
        },
        {
          path: '/front/updatePassword',
          component: UpdatePassword,
          name: '修改密码',
          meta: { requireAuth: true }
        },
      ]
    },
    {
      path: '/back',
      name: '首页',
      redirect () {
        return '/back/home'
      },
      component: BackIndex,
      meta: {requireAuth: true, permissions: 'admin' },
      children: [
        {path: '/noAuthority', component: NoAuthority},
        {path: '/back/home',
          component: Home,
          meta: {requireAuth: true, permissions: 'admin' }
        },
        {
          path: '/back/messageInfo',
          component: MessageInfo,
          name: '我的信息',
          meta: { requireAuth: true }
        },
        {
          path: '/back/personal',
          component: Personal,
          name: '个人中心',
          meta: { requireAuth: true }
        },
        {
          path: '/back/updatePassword',
          component: UpdatePassword,
          name: '修改密码',
          meta: { requireAuth: true }
        },
        {
          // 书籍
          path: '/back/book',
          component: Book,
          name: '书籍管理',
          children: [
            {path: '/back/book/bookInfo',
              component: BookInfo,
              name: '书籍信息',
              meta: { requireAuth: true, permissions: 'bookR' }},
            {path: '/back/book/addBook',
              component: AddBook,
              name: '新增书籍',
              meta: { requireAuth: true, permissions: 'bookW' }},
            {path: '/back/book/updateBook/:id',
              component: UpdateBook,
              name: '修改纸质书',
              meta: { requireAuth: true, permissions: 'bookW' }},
            {path: '/back/book/updateEbook/:id',
              component: UpdateEbook,
              name: '修改电子书',
              meta: { requireAuth: true, permissions: 'bookW' }},
            
            {path: '/back/book/bookList',
              component: BookList,
              name: '书籍列表',
              meta: { requireAuth: true, permissions: 'bookW' }}
          ]
        },
        {
          // 类别
          path: '/back/category',
          component: Category,
          name: '类别管理',
          meta: {requireAuth: true},
          children: [
            {path: '/back/category/addCategory',
              component: AddCategory,
              name: '新增类别',
              meta: {requireAuth: true, permissions: 'categoryW' }},
            {path: '/back/category/categoryList',
              component: CategoryList,
              name: '类别列表',
              meta: {requireAuth: true, permissions: 'categoryW'}}
          ]
        },
        {
          // 用户
          path: '/back/user',
          component: User,
          name: '用户管理',
          meta: {requireAuth: true},
          children: [
            {path: '/back/user/userInfo',
              component: UserInfo,
              name: '用户信息',
              meta: {requireAuth: true, permissions: 'userR' }},
            {path: '/back/user/addUser',
              component: AddReader,
              name: '新增用户',
              meta: {requireAuth: true, permissions: 'userW' }},
            {path: '/back/user/userDetail/:id',
              component: ReaderDetail,
              name: '用户详情',
              meta: {requireAuth: true, permissions: 'userR' }},
            {path: '/back/user/userList',
              component: ReaderList,
              name: '用户列表',
              meta: {requireAuth: true, permissions: 'userW' }}
          ]
        },
        {
          // 借阅
          path: '/back/borrowing',
          component: Borrowing,
          name: '借阅管理',
          meta: {requireAuth: true},
          children: [
            {path: '/back/borrowing/borrowingList',
              component: BorrowingList,
              name: '借阅列表',
              meta: {requireAuth: true, permissions: 'borrowingR' }},
            {path: '/back/borrowing/handleBorrowing',
              component: HandleBorrowing,
              name: '处理借阅',
              meta: {requireAuth: true, permissions: 'borrowingW' }},
            {path: '/back/borrowing/handleReturn',
              component: HandleReturn,
              name: '处理归还',
              meta: {requireAuth: true, permissions: 'borrowingW' }}
          ]
        },

        {
          // 统计
          path: '/back/statistics',
          component: Statistics,
          name: '统计管理',
          meta: {requireAuth: true},
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          },
          children: [
            {path: '/back/statistics/borrowingStatistics',
              component: BorrowingStatistics,
              name: '书籍状态统计',
              meta: {requireAuth: true, permissions: 'statisticsR' }},
            {path: '/back/statistics/categoryStatistics',
              component: CategoryStatistics,
              name: '书籍分类统计',
              meta: {requireAuth: true, permissions: 'statisticsR' }},
            {path: '/back/statistics/storageStatisticsByTime',
              component: StorageStatisticsByTime,
              name: '书籍新增统计',
              meta: {requireAuth: true, permissions: 'statisticsR' }},
            {path: '/back/statistics/userStatisticsByTime',
              component: UserStatisticsByTime,
              name: '用户新增统计',
              meta: {requireAuth: true, permissions: 'statisticsR' }}
          ]
        },
        {path: '/back/grantPrivilege',
          component: GrantPrivilege,
          name: '授权',
          meta: {requireAuth: true, permissions: 'privilege' }}
      ]
    }
  ]
})
