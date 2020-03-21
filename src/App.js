import React,{Suspense} from 'react';
import './App.css';
// 引入字体图标
import './assets/fonts/iconfont.css'
// 导入虚拟化长列表的样式
import 'react-virtualized/styles.css'

import {HashRouter as Router,Route,Switch,Redirect} from 'react-router-dom'

// 自己封装的权限校验的子组件
import AuthRoute from './components/AuthRoute'

// import { isLogin } from './utils/token'

// 导入子组件
// import Layout from './views/Layout'
// import Login from './views/Login'
// import CityList from './views/CityList'
// import Map from './views/Map'
// import Detail from './views/Detail'
// import Rent from './views/Rent'
// import RentAdd from './views/Rent/Add'
// import RentSearch from './views/Rent/Search'
// import NotFound from './views/NotFound'
const Layout = React.lazy(() => import('./views/Layout'))
const Login = React.lazy(() => import('./views/Login'))
const CityList = React.lazy(() => import('./views/CityList'))
const Map = React.lazy(() => import('./views/Map'))
const Detail = React.lazy(() => import('./views/Detail'))
const Rent = React.lazy(() => import('./views/Rent'))
const RentAdd = React.lazy(() => import('./views/Rent/Add'))
const RentSearch = React.lazy(() => import('./views/Rent/Search'))
const NotFound = React.lazy(() => import('./views/NotFound'))

function App() {
  return (
    <Router>
      {/* 设置路由规则 */}
      <div style={{height:'100%'}}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/layout" component={Layout}/>
            <Route path="/login" component={Login}/>
            <Route path="/citylist" component={CityList}/>
            <Route path="/map" component={Map}/>
            <Route path="/detail/:id" component={Detail}/>

            {/* 下面是需要权限验证的 */}
            <AuthRoute path="/rent" exact component={Rent}/>
            <AuthRoute path="/rent/add" component={RentAdd}/>
            <AuthRoute path="/rent/search" component={RentSearch}/>
            {/* 未经过抽取
            <Route path="/rent" exact render={() => {
              // 做逻辑处理
              if (isLogin()) { // 登录了
                return <Rent />
              } else { // 未登录
                return <Redirect to={{pathname:'/login',state:{to:'/rent'}}}/>
              }
            }}/>
            <Route path="/rent/add" render={() => {
              // 做逻辑处理
              if (isLogin()) {
                return <RentAdd />
              } else { // 未登录
                return <Redirect to={{pathname:'/login',state:{to:'/rent/add'}}} />
              }
            }}/>
            <Route path="/rent/search" render={() => {
              // 做逻辑处理
              if (isLogin()) {
                return <RentSearch />
              } else { // 未登录
                return <Redirect to={{pathname:'/login',state:{to:'/rent/search'}}} />
              }
            }}/>
            */}
            {/* 重定向要写在已有路径规则后面 */}
            <Redirect exact from="/" to="/layout"/>
            {/* 404一定要写在最后 */}
            <Route component={NotFound}/>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
