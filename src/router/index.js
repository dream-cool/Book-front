import Vue from 'vue'
import Router from 'vue-router'
import FrontIndex from '@/components/FrontIndex.vue'
import BackIndex from '@/components/BackIndex.vue'
import AddBook from '../components/back/AddBook'
import AddCategory from '../components/back/AddCategory'
import AddReader from '../components/back/AddReader.vue'
import BookDetail from '../components/back/BookDetail.vue'
import BookList from '../components/back/BookList.vue'
import BorrowingList from '../components/back/BorrowingList.vue'
import BorrowingStatistics from '../components/back/BorrowingStatistics.vue'
import CategoryDetail from '../components/back/CategoryDetail.vue'
import CategoryList from '../components/back/CategoryList.vue'
import CategoryStatistics from '../components/back/CategoryStatistics.vue'
import GrantPrivilege from '../components/back/GrantPrivilege.vue'
import HandleBorrowing from '../components/back/HandleBorrowing.vue'
import ReaderDetail from '../components/back/ReaderDetail.vue'
import ReaderList from '../components/back/ReaderList.vue'
import RecoveryPrivilege from '../components/back/RecoveryPrivilege.vue'
import StorageStatistics from '../components/back/StorageStatistics.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/front',
      name: 'FrontIndex',
      component: FrontIndex
    },
    {
      path: '/back',
      name: 'BackIndex',
      component: BackIndex,
      children: [
        {path: '/back/addBook', component: AddBook},
        {path: '/back/addCategory', component: AddCategory},
        {path: '/back/addUser', component: AddReader},
        {path: '/back/bookDetail/:id', component: BookDetail},
        {path: '/back/booksManager', component: BookList},
        {path: '/back/borrowingManager', component: BorrowingList},
        {path: '/back/borrowingStatistics', component: BorrowingStatistics},
        {path: '/back/categoryDetail/:id', component: CategoryDetail},
        {path: '/back/categoryManager', component: CategoryList},
        {path: '/back/categoryStatistics', component: CategoryStatistics},
        {path: '/back/grantPrivilege', component: GrantPrivilege},
        {path: '/back/handleBorrowing', component: HandleBorrowing},
        {path: '/back/userDetail/:id', component: ReaderDetail},
        {path: '/back/userManager', component: ReaderList},
        {path: '/back/recoveryPrivilege', component: RecoveryPrivilege},
        {path: '/back/storageStatistics', component: StorageStatistics}
      ]
    }
  ]
})
