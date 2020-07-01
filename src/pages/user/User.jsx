import React, { Component } from 'react'
import { Card, Table, Button, Modal, message, Popconfirm, Form, Select, Input, Icon } from 'antd'
import UserForm from './UserForm'
import { reqGetRoles, reqAddUser, reqGetUsers, reqUpdateUser, reqDeleteUser } from '../../api/index'
import memUtils from '../../utils/memUtils' 

const Item = Form.Item
const Option = Select.Option
export default class User extends Component {

    state = {
        isAdd: false, //是否显示添加框
        isUpdate: false, //是否显示添加框
        users: [], //所有用户
        roles: [], //所有角色
        user: {}, //选中的用户
        flag: '', // 1 添加  2 修改
    }

    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.getRoles()
        this.getUsers()
    }

    //初始化表头信息
    initColumns = () => {
        this.columns = [
            {
                title: '用户名称',
                dataIndex: 'username'
            },
            {
                title: '权限等级',
                dataIndex: 'roleId',
                render: this.getRoleName
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            },
            {
                title: '创建人',
                dataIndex: 'create_name'
            },
            {
                title: '修改时间',
                dataIndex: 'update_time'
            },            {
                title: '修改人',
                dataIndex: 'update_name'
            },
            {
                title: '操作',
                width: 180,
                render: user => {
                    return (
                        <span>
                            <Button type="primary" onClick={() => {   
                                this.setState({
                                    isUpdate: true,
                                    flag: 2,
                                    user
                                })
                            }}>修改</Button>&nbsp;&nbsp;
                            <Popconfirm
                                title="确认删除此用户吗？"
                                onConfirm={() => {this.deleteUser(user._id)} }
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </span>
                    )
                }
            }

        ]
    }

    //根据权限id获取权限名
    getRoleName = (roleId) => {
        const { roles } = this.state
        return roles.map(role => {
            if (role._id === roleId) {
                return (
                    <span key={roleId}>{role.name}</span>
                )
            }
        })
    }

    //获取用户列表
    getUsers = async () => {
        const result = await reqGetUsers()
        if (result.status === 0) {
            this.setState({ users: result.data})
        }
    }

    //获取所有权限等级
    getRoles = async () => {
        const result = await reqGetRoles()
        if (result.status === 0) {
            this.setState({ roles: result.data })
        }
    }

    //添加用户
    handleAdd = () => {
        this.form.validateFields( async (err, values) => {
            if (!err) {
                const { username, password, roleId } = values
                //添加人
                let create_name = memUtils.isLogin.username
                const user = { username, password, roleId, create_name}
                const result = await reqAddUser(user)
                if (result.status === 0) {
                    message.success(result.mes)
                    this.setState( state => ({
                        users: [...state.users, result.data],
                        isAdd: false
                    }))
                } else {
                    message.error(result.mes)
                }
                this.form.resetFields()
            }
          });
    }

    //更新用户
    handleUpdate = () => {
        this.form.validateFields( async (err, values) => {
            if (!err) {
                const { _id, password, roleId } = values
                //添加人
                let update_name = memUtils.isLogin.username
                const user = { _id, password, roleId, update_name}
                const result = await reqUpdateUser(user)
                if (result.status === 0) {
                    message.success(result.mes)
                    this.setState({isUpdate: false})
                    this.getUsers()
                } else {
                    message.error(result.mes)
                }
                this.form.resetFields()
            }
          });
    }

    //删除用户
    deleteUser = async (_id) => {
        const result = await reqDeleteUser(_id)
        if (result.status === 0) {
            message.success(result.mes)
            this.getUsers()
        } else {
            message.error(result.mes)
        }
    }

    //取消添加操作
    handleAddCancel = () => {
        this.setState({ isAdd: false })
        this.form.resetFields()
    }

    //取消修改操作
    handleUpdateCancel = () => {
        this.setState({ isUpdate: false })
        this.form.resetFields()
    }

    render() {
        const { users, isAdd, isUpdate, roles, user, flag } = this.state
        const title = (
            <span>
            <Form layout="inline" onSubmit={this.handleSubmit} >
                <Item>

                        <Select style={{width: 100}} >
                            <Option value="0" >按名称</Option>
                            <Option value="1" >按描述</Option>
                        </Select>   
                </Item>
                <Item>
                        <Input style={{ width: 160}} placeholder="请输入关键字..." />
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">搜索</Button>
                </Item>
            </Form>
        </span>
        )
        const extraButton = (
            <Button  onClick={ () => {this.setState({ isAdd: true, flag: 1})}}><Icon type="plus" />添加用户</Button>
        )
        return (
            <Card title={title} extra={extraButton}>
                <Table
                    bordered={true}
                    rowKey="_id"
                    // loading={loading}
                    columns={this.columns}
                    dataSource={users}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />
                 <Modal
                    title="添加用户"
                    visible={isAdd}
                    onOk={this.handleAdd}
                    onCancel={this.handleAddCancel}
                >  
                    <UserForm roles={roles} getForm={userForm => this.form = userForm} flag={flag}/>
                </Modal>
                <Modal
                    title="修改用户"
                    visible={isUpdate}
                    onOk={this.handleUpdate}
                    onCancel={this.handleUpdateCancel}
                >  
                    <UserForm roles={roles} getForm={userForm => this.form = userForm} user={user} flag={flag}/>
                </Modal>
            </Card>
        )
    }
}
