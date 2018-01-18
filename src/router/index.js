import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name:index,
      path: '/catch',
      component: index
    },
    {
      path: '/404',
      component: r => require.ensure([], () => r(require('@/components/notcomponent')))
    },
    {
      path:'/',
      redirect:index
    }
  ]
})
