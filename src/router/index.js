import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/query/:query',
      name: 'Query1',
      component: Home
    },
    {
      path: '/date/:date',
      name: 'Date',
      component: Home
    },
    {
      path: '/date/:date/query/:query',
      name: 'Query2',
      component: Home
    }
  ]
})
