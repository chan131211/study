import React, { Component } from 'react'
import logo from '../../assets/images/logo.jpg'
import {Form, Input, Button,Icon, message} from 'antd'
import './login.less'
import {loginRequest} from '../../api'
const Item = Form.Item

class Login extends Component {
    handleSubmit = e => {
        e.preventDefault()
        const form = this.props.form
        // const values = form.getFieldsValue()
        // console.log(form)
        // console.log(values)


        // 进行表单的统一验证
        form.validateFields(async (err, {username, password}) => {
            if(!err) {
                let resData = await loginRequest(username, password)
                // console.log(resData)
                if (resData.status == 0) {
                    message.success('登陆成功')
                } else {
                    message.error(resData.msg)
                }
            }
        })
    }

    // 验证密码
    pwdHandler = (rule, value, callback) => {
        value = value.trim()
        if (!value) {
            callback('必须输入密码!')
        } else if (value.length < 5) {
            callback('密码长度必须大于等于6位!')
        } else if (value.length > 17) {
            callback('密码长度必须小于等于16位!')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是字母、数字、下划线组成!')
        } else {
            callback()
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt=""/>
                    <h1>点赞商城后台管理系统</h1>
                </div>
                <div className="login-content">
                    <h2>后台登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                    <Item>
                        {
                        getFieldDecorator('username', {
                            rules: [
                                { required: true, message: '必须填写用户名!' },
                                { min: 5, message: '用户名不能小于5位!' },
                                { max: 20, message: '用户名不能大于20位!' },
                                { pattern: /^[a-zA-Z][a-zA-Z0-9_]+$/, message: '用户名必须为字母数字或下划线，以字母开头!' }
                            ]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            /> 
                        )
                        }
                    </Item>
                    <Item>
                        {
                        getFieldDecorator('password', {
                            rules: [
                                { validator: this.pwdHandler}
                            ]
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                autoComplete="off"
                            />                
                        )
                        }
                    </Item>
                    <Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">登陆</Button>
                    </Item>
                </Form>
                </div>
            </div>
        )
    }
}

const   WrappedLogin = Form.create()(Login)

export default WrappedLogin
