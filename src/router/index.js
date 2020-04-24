/* eslint-disable standard/object-curly-even-spacing */
import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)

const BackIndex = resolve => require(['@/components/BackIndex.vue'], resolve)
const Book = resolve => require(['@/components/back/book/Book.vue'], resolve)
const Borrowing = resolve => require(['@/components/back/borrowing/Borrowing.vue'], resolve)
const Category = resolve => require(['@/components/back/category/Category.vue'], resolve)
const User = resolve => require(['@/components/back/user/User.vue'], resolve)
const Statistics = resolve => require(['@/components/back/statistics/Statistics.vue'], resolve)
const AddBook = resolve => require(['@/components/back/book/AddBook'], resolve)
const AddCategory = resolve => require(['@/components/back/category/AddCategory'], resolve)
const AddReader = resolve => require(['@/components/back/user/AddReader.vue'], resolve)
const BookDetail = resolve => require(['@/components/back/book/BookDetail.vue'], resolve)
const BookList = resolve => require(['@/components/back/book/BookList.vue'], resolve)
const BookInfo = resolve => require(['@/components/back/book/BookInfo.vue'], resolve)
const BorrowingList = resolve => require(['@/components/back/borrowing/BorrowingList.vue'], resolve)
const BorrowingStatistics = resolve => require(['@/components/back/statistics/BorrowingStatistics.vue'], resolve)
const CategoryList = resolve => require(['@/components/back/category/CategoryList.vue'], resolve)
const CategoryStatistics = resolve => require(['@/components/back/statistics/CategoryStatistics.vue'], resolve)
const GrantPrivilege = resolve => require(['@/components/back/GrantPrivilege.vue'], resolve)
const DictionaryList = resolve => require(['@/components/back/DictionaryList.vue'], resolve)
const DictionaryDataList = resolve => require(['@/components/back/DictionaryDataList.vue'], resolve)
const HandleBorrowing = resolve => require(['@/components/back/borrowing/HandleBorrowing.vue'], resolve)
const HandleReturn = resolve => require(['@/components/back/borrowing/HandleReturn.vue'], resolve)
const ReaderDetail = resolve => require(['@/components/back/user/ReaderDetail.vue'], resolve)
const ReaderList = resolve => require(['@/components/back/user/ReaderList.vue'], resolve)
const UserInfo = resolve => require(['@/components/back/user/UserInfo.vue'], resolve)
const StorageStatisticsByTime = resolve => require(['@/components/back/statistics/StorageStatisticsByTime.vue'], resolve)
const UserStatisticsByTime = resolve => require(['@/components/back/statistics/UserStatisticsByTime.vue'], resolve)
const EbookRead = resolve => require(['@/components/front/EbookRead.vue'], resolve)
const UpdateBook = resolve => require(['@/components/back/book/UpdateBook.vue'], resolve)
const UpdateEbook = resolve => require(['@/components/back/book/UpdateEbook.vue'], resolve)
const Login = resolve => require(['@/components/Login.vue'], resolve)
const NoAuthority = resolve => require(['@/components/403.vue'], resolve)
const NotFound = resolve => require(['@/components/404.vue'], resolve)
const MessageInfo = resolve => require(['@/components/MessageInfo.vue'], resolve)
const UpdatePassword = resolve => require(['@/components/front/UpdatePassword.vue'], resolve)
const Home = resolve => require(['@/components/back/Home.vue'], resolve)
const Personal = resolve => require(['@/components/Personal.vue'], resolve)
const Index = resolve => require(['@/components/front/Index.vue'], resolve)
const UserCollection = resolve => require(['@/components/front/UserCollection.vue'], resolve)
const Ebook = resolve => require(['@/components/front/Ebook.vue'], resolve)
const LendBook = resolve => require(['@/components/front/LendBook.vue'], resolve)
const RecommendBook = resolve => require(['@/components/front/RecommendBook.vue'], resolve)
const PopularBook = resolve => require(['@/components/front/PopularBook.vue'], resolve)
const MyBorrowing = resolve => require(['@/components/front/MyBorrowing.vue'], resolve)
const Test = resolve => require(['@/components/Test.vue'], resolve)
const Test1 = resolve => require(['@/components/Test1.vue'], resolve)
const FrontIndex = resolve => require(['@/components/FrontIndex.vue'], resolve)
const RecoverPassword = resolve => require(['@/components/RecoverPassword.vue'], resolve)
const SendMessage = resolve => require(['@/components/back/SendMessage.vue'], resolve)
const Scheduling = resolve => require(['@/components/back/Scheduling.vue'], resolve)
const SysLog = resolve => require(['@/components/back/SysLog.vue'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/404', component: NotFound},
    {path: '/login', component: Login},
    {path: '/recoverPasswor', component: RecoverPassword},
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
        {path: '/front/test1',
          component: Test1,
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
          path: '/front/collection',
          component: UserCollection,
          name: '我的收藏',
          meta: { requireAuth: true }
        },
        {
          path: '/front/myborrowing',
          component: MyBorrowing,
          name: '我的借阅',
          meta: { requireAuth: true }
        },
        {
          path: '/front/updatePassword',
          component: UpdatePassword,
          name: '修改密码',
          meta: { requireAuth: true }
        },
        {
          path: '/front/ebook',
          component: Ebook,
          name: '电子书',
          meta: {}
        },
        { 
          path: '/front/popularBook',
          component: PopularBook,
          name: '热门',
          meta: {}
        },
        { 
          path: '/front/recommendBook',
          component: RecommendBook,
          name: '推荐',
          meta: { requireAuth: true }
        },
        { 
          path: '/front/lendBook',
          component: LendBook,
          name: '借出',
          meta: {}
        }
      ]
    },
    {
      
      path: '/',
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
          children: [
            {path: '/back/statistics/categoryStatistics',
              component: CategoryStatistics,
              name: '占比统计',
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
        {
          path: '/back/sys',
          component: Book,
          name: '系统管理',
          meta: {requireAuth: true},
          children: [
            {
              path: '/back/sys/sendMessage',
              component: SendMessage,
              name: '消息推送',
              meta: {requireAuth: true}
            },
            {
              path: '/back/sys/scheduling',
              component: Scheduling,
              name: '定时任务',
              meta: {requireAuth: true}
            },
            {
              path: '/back/sys/log',
              component: SysLog,
              name: '日志记录',
              meta: {requireAuth: true}
            },
            {
              path: '/back/sys/dictionary',
              component: DictionaryList,
              name: '字典管理',
              meta: {requireAuth: true}
            },
            {
              path: '/back/sys/dictionary/data/:type',
              component: DictionaryDataList,
              name: '字典数据',
              meta: {requireAuth: true}
            }
          ]
        },
        {path: '/back/grantPrivilege',
          component: GrantPrivilege,
          name: '授权',
          meta: {requireAuth: true, permissions: 'privilege' }
        }
      ]
    }
  ]
})
