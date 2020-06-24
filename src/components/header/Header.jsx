import React, { Component } from 'react'
import {Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import './header.less'
import memUtils from '../../utils/memUtils'
import localUtils from '../../utils/localUtils'
import MyButton from '../my-button/MyButton'
import {getDate} from '../../utils/timeUtils'
import {menuList} from '../../config/menu'

class Header extends Component {

    state = {
        currentTime: getDate(Date.now())
    }

    componentDidMount() {
        //开启定时器
        this.timer = setInterval(() => {
            this.setState({
                currentTime: getDate(Date.now())
            })
        }, 1000)
    }

    componentWillMount() {
        //清除定时器
        clearInterval(this.timer)
    }

    logoutHandler = () => {
        const {confirm} = Modal
        confirm({
            title: '确认退出码?',

            onOk:() => {
                //清空本地、内存的用户登陆信息
                localUtils.removeLoginData()
                memUtils.isLogin = {}

                //跳转到首页
                this.props.history.replace('/')
            },
            onCancel() {},
        });
    }

    // 获取title
    getTitle = menuList => {
        const path = this.props.location.pathname
        menuList.forEach(item => {
            if (item.key === path) {
                this.title = item.title
                return
            } else if (item.childMenu){
                this.getTitle(item.childMenu)
            }
        })
    }

    render() {
        const {currentTime} = this.state   
        this.getTitle(menuList)
        return (
            <div className="header">
                <div className="header-top">
                    欢迎， {memUtils.isLogin.username} &nbsp; &nbsp;
                    <MyButton onClick={this.logoutHandler}>退出</MyButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {this.title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
