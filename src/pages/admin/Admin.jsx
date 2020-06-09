import React, { Component } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
// import localUtils from '../../utils/localUtils'
import memUtils from '../../utils/memUtils'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav/LeftNav'
import Header from '../../components/header/Header'
import Home from '../home/Home'
import Goods from '../goods/Goods'
import Categorys from '../categorys/Categorys'
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
                            <Route path="/home" component={Home}/>
                            <Route path="/goods" component={Goods}/>
                            <Route paht="/categorys" component={Categorys}/>
                            <Redirect to="/home"/>
                        </Switch>
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
        )
    }
}
