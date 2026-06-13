export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/movies/index',
    'pages/discover/index',
    'pages/growth/index',
    'pages/mine/index',
    'pages/child-profile/index',
    'pages/movie-detail/index',
    'pages/add-movie/index',
    'pages/share-card/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '亲子观影日记',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8F9FE'
  },
  tabBar: {
    color: '#636E72',
    selectedColor: '#FF6B9D',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/movies/index',
        text: '观影'
      },
      {
        pagePath: 'pages/discover/index',
        text: '发现'
      },
      {
        pagePath: 'pages/growth/index',
        text: '成长'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
