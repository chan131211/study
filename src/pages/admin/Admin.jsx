import React, { Component } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
// import localUtils from '../../utils/localUtils'
import memUtils from '../../utils/memUtils'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav/LeftNav'
import Header from '../../components/header/Header'
import Home from '../home/Home'
import Goods from '../goods/Goods'
import Category from '../categorys/Category'
import './admin.less'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        //获取用户登陆信息
        // const userData = localUtils.getLoginData()
        const userData = memUtils.isLogin
        if (!userData._id) {
            return <Redirect to="/login"/>
        }
        return (
            <Layout>
                <Sider ><LeftNav/></Sider>
                <Layout>
                    <Header/>
                    <Content>
                        <Switch>
                            <Route path="/admin/home" component={Home}/>
                            <Route path="/admin/goods" component={Goods}/>
                            <Route path="/admin/category" component={Category}/>

                            <Redirect to="/admin/home"/>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#000', borderTop: '1px solid #37DFBC'}}>本系统推荐使用最新版谷歌浏览器以获得最佳浏览效果</Footer>
                </Layout>
            </Layout>
        )
    }
}
