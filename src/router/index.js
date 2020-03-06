import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/back/Home.vue'
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
import BorrowingList from '../components/back/borrowing/BorrowingList.vue'
import BorrowingStatistics from '../components/back/statistics/BorrowingStatistics.vue'
import CategoryList from '../components/back/category/CategoryList.vue'
import CategoryStatistics from '../components/back/statistics/CategoryStatistics.vue'
import GrantPrivilege from '../components/back/GrantPrivilege.vue'
import HandleBorrowing from '../components/back/borrowing/HandleBorrowing.vue'
import HandleReturn from '../components/back/borrowing/HandleReturn.vue'
import ReaderDetail from '../components/back/user/ReaderDetail.vue'
import ReaderList from '../components/back/user/ReaderList.vue'
import RecoveryPrivilege from '../components/back/RecoveryPrivilege.vue'
import StorageStatisticsByTime from '../components/back/statistics/StorageStatisticsByTime.vue' 
import UserStatisticsByTime from '../components/back/statistics/UserStatisticsByTime.vue'
import EbookRead from '../components/front/EbookRead.vue'
import UpdateBook from "../components/back/book/UpdateBook.vue"
import UpdateEbook from "../components/back/book/UpdateEbook.vue"

Vue.use(Router)

export default new Router({
  routes: [
    
    {path: '/front/ebookRead/:id', component: EbookRead},
    {
      path: '/front',
      name: 'FrontIndex',
      component: FrontIndex,
      children: [
      ]
    },
    {
      path: '/back',
      name: 'BackIndex',
      component: BackIndex,
      children: [
        {path: '/back/home', component: Home},
        {
          // 书籍
          path: '/back/book', 
          component: Book,
          children: [
            {path: '/back/book/addBook', component: AddBook},
            {path: '/back/book/updateBook/:id', component: UpdateBook},
            {path: '/back/book/updateEbook/:id', component: UpdateEbook},
            {path: '/back/book/bookDetail/:id', component: BookDetail},
            {path: '/back/book/bookList', component: BookList},
          ]
        },
        {
          // 类别
          path: '/back/category', 
          component: Category,
          children: [
            {path: '/back/category/addCategory', component: AddCategory},
            {path: '/back/category/categoryList', component: CategoryList},
          ]
        },
        {
          // 用户
          path: '/back/user', 
          component: User,
          children: [
            {path: '/back/user/addUser', component: AddReader},
            {path: '/back/user/userDetail/:id', component: ReaderDetail},
            {path: '/back/user/userList', component: ReaderList},
          ]
        },
        {
          // 借阅
          path: '/back/borrowing', 
          component: Borrowing,
          children: [
            {path: '/back/borrowing/borrowingList', component: BorrowingList},
            {path: '/back/borrowing/handleBorrowing', component: HandleBorrowing},
            {path: '/back/borrowing/handleReturn', component: HandleReturn},
          ]
        },

        {
          // 统计
          path: '/back/statistics', 
          component: Statistics,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          },
          children: [
            {path: '/back/statistics/borrowingStatistics', component: BorrowingStatistics},
            {path: '/back/statistics/categoryStatistics', component: CategoryStatistics},
            {path: '/back/statistics/storageStatisticsByTime', component: StorageStatisticsByTime},
            {path: '/back/statistics/userStatisticsByTime', component: UserStatisticsByTime}
          ]
        },
        {path: '/back/grantPrivilege', component: GrantPrivilege},      
        {path: '/back/recoveryPrivilege', component: RecoveryPrivilege}        
      ]
    }
  ]
})
