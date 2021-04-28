const brMessageBoard = [
  {
    path: 'brMessageBoard',
    name: '留言板',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-message-board-index')
  }
]
export default brMessageBoard
