import React, { Component } from 'react'
import {Button, Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import './header.less'
import memUtils from '../../utils/memUtils'
import localUtils from '../../utils/localUtils'

class Header extends Component {
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

    render() {
        return (
            <div className="header">
                <div className="header-top">
                    欢迎， {memUtils.isLogin.username} &nbsp; &nbsp;
                    <Button onClick={this.logoutHandler}>退出</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-botton-left">
                        首页
                    </div>
                    <div className="header-bottom-right"></div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
