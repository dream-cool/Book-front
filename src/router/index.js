/* eslint-disable standard/object-curly-even-spacing */
import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)

const BookDetail = resolve => require(['@/components/back/book/BookDetail.vue'], resolve)
const EbookRead = resolve => require(['@/components/front/EbookRead.vue'], resolve)
const Login = resolve => require(['@/components/Login.vue'], resolve)
const NotFound = resolve => require(['@/components/404.vue'], resolve)
const MessageInfo = resolve => require(['@/components/MessageInfo.vue'], resolve)
const UpdatePassword = resolve => require(['@/components/front/UpdatePassword.vue'], resolve)
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

export default new Router({
  mode: 'history',
  routes: [
    {path: '/404', component: NotFound},
    {path: '/login', component: Login},
    {path: '/recoverPasswor', component: RecoverPassword},
    {path: '/ebookRead/:id', component: EbookRead},
    {path: '/oauth/callback', component: Test1 },
    {
      path: '/',
      name: '前台',
      redirect () {
        return '/home'
      },
      component: FrontIndex,
      children: [
        {path: '/home',
          component: Index,
          meta: {}
        },
        {path: '/bookDetail/:id',
          component: BookDetail,
          name: '书籍详情',
          meta: {}},
        {path: '/test',
          component: Test,
          meta: {}
        },

        {
          path: '/messageInfo',
          component: MessageInfo,
          name: '我的信息',
          meta: { requireAuth: true }
        },
        {
          path: '/personal',
          component: Personal,
          name: '个人中心',
          meta: { requireAuth: true }
        },
        {
          path: '/collection',
          component: UserCollection,
          name: '我的收藏',
          meta: { requireAuth: true }
        },
        {
          path: '/myborrowing',
          component: MyBorrowing,
          name: '我的借阅',
          meta: { requireAuth: true }
        },
        {
          path: '/updatePassword',
          component: UpdatePassword,
          name: '修改密码',
          meta: { requireAuth: true }
        },
        {
          path: '/ebook',
          component: Ebook,
          name: '电子书',
          meta: {}
        },
        {
          path: '/popularBook',
          component: PopularBook,
          name: '热门',
          meta: {}
        },
        {
          path: '/recommendBook',
          component: RecommendBook,
          name: '推荐',
          meta: { requireAuth: true }
        },
        {
          path: '/lendBook',
          component: LendBook,
          name: '借出',
          meta: {}
        }
      ]
    }
  ]
})
