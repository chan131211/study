import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import { reqCheckUser } from '../../api/index'
const { Item } = Form 
const { Option } = Select
class UserForm extends Component {

    static propTypes = {
        getForm: PropTypes.func.isRequired
    }

    //自定义用户名验证器 验证用户是否已存在
    validateUsername = async (rule, value,  callback) => {
        if (!value) {
            callback()
        } else if (value) {
            const result = await reqCheckUser(value)
            if (result.status === 0) {
                callback('当前用户已存在')
            }
        } else {
            callback()
        }
    }
    
    //自定义权限验证器
    validateRole = (rule, value, callback) => {
        if (!value) {
            callback()
        } else if (value === '0') {
            callback('请选择权限等级')
        } else {
            callback()
        }
    }

    //自定义密码验证器
    validatePassword = (rule, value, callback) => {
        if (!value ) {
            callback()
        } else if(value.length < 6 || value.length > 12) {
            callback('密码不能小于6位，且不能大于12位')
        } else {
            callback()
        }
    }

    //自定义二次密码验证器
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form
        if (!value) {
            callback()
        } else if(value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致')
        } else {
            callback()
        }
    }

    render() {
        //将子组件的form转递给父组件
        this.props.getForm(this.props.form)
        const { roles, flag } = this.props
        const { getFieldDecorator } = this.props.form
        const formConfig = {
            labelCol: { span: 4},
            wrapperCol: { span: 15}
        }
        if (flag === 2) {
            const { user } = this.props
            let arr = Object.keys(user)
            if (arr.length > 0) {
                return (
                    <Form {...formConfig}>
                        <Item style={{display: 'none'}}>
                            {getFieldDecorator('_id', {
                                initialValue: user._id,
                                rules: [],
                            })(
                                <Input type="hidden"/>
                            )}
                        </Item>
                        <Item label={'用户名'}>
                            {getFieldDecorator('username', {
                                initialValue: user.username,
                                rules: [],
                            })(
                                <Input placeholder="请填写用户名" disabled />
                            )}
                        </Item>
                        <Item label={'权限等级'}>
                            {getFieldDecorator('roleId', {
                                initialValue: user.roleId,
                                rules: [
                                    { required: true, message: '必须选择权限等级' },
                                    { validator: this.validateRole }
                                ],
                            })(
                                <Select>
                                    <Option value="0">---请选择---</Option>
                                    {
                                        roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
                                    }
                                </Select>
                            )}
                        </Item>
                        <Item label={'密码'}>
                            {getFieldDecorator('password', {
                                initialValue: user.password,
                                rules: [
                                    { required: true, message: '必须填写密码' },
                                    { validator: this.validatePassword }
                                ],
                            })(
                                <Input type="password" placeholder="请填写密码" />
                            )}
                        </Item>
                        <Item label={'确认密码'}>
                            {getFieldDecorator('secondPass', {
                                initialValue: user.password,
                                rules: [
                                    { required: true, message: '必须填写密码' },
                                    { validator: this.compareToFirstPassword }
                                ],
                            })(
                                <Input type="password" placeholder="请再次填写密码" />
                            )}
                        </Item>
                    </Form>
                )
            }
        }
        
        return (
            <Form {...formConfig}>
                <Item label={'用户名'}>
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: '必须填写用户名' },
                            { validator: this.validateUsername }
                        ],
                    })(
                        <Input placeholder="请填写用户名" />
                    )}
                </Item>
                <Item label={'权限等级'}>
                    {getFieldDecorator('roleId', {
                        initialValue: '0',
                        rules: [
                            { required: true, message: '必须选择权限等级' },
                            { validator: this.validateRole }
                        ],
                    })(
                        <Select>
                            <Option value="0">---请选择---</Option>
                            {
                                roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )}
                </Item>
                <Item label={'密码'}>
                    {getFieldDecorator('password', {
                        rules: [
                            { required: true, message: '必须填写密码' },
                            { validator: this.validatePassword }
                        ],
                    })(
                        <Input type="password" placeholder="请填写密码" />
                    )}
                </Item>
                <Item label={'确认密码'}>
                    {getFieldDecorator('secondPass', {
                        rules: [
                            { required: true, message: '必须填写密码' },
                            { validator: this.compareToFirstPassword }
                        ],
                    })(
                        <Input type="password" placeholder="请再次填写密码" />
                    )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)
