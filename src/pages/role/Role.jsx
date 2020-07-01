import React, { Component } from 'react'
import { Card, Button, Table, Modal, message} from 'antd'
import RoleForm from './RoleForm'
import AuthForm from './AuthForm'
import { reqAddRole, reqGetRoles, reqUpdateRole } from '../../api/index'
import memUtils from '../../utils/memUtils' 
export default class Role extends Component {
    state = {
        loading: false,
        isShow: false, //添加角色框 
        isShowAuth: false, //设置权限框
        roles: [], //所有角色
        role: {}, //选中的角色
    }

    constructor(props) {
        super(props)

        //创建一refs个对象
        this.authRef = React.createRef()
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    //初始化表头
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time'
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    //获取所有角色
    getRoles = async () => {
        const result = await reqGetRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    //添加角色
    addRole = () => {
        this.form.validateFields( async (err, values) => {
            if (!err) {
                const { name } =  values
                //向后台发送添加角色请求
                const result =  await reqAddRole(name)
                if (result.status === 0) {
                    message.success('添加角色成功')
                    //关闭添加框
                    this.setState({ isShow: false})
                    this.setState(state =>({
                        roles: [...state.roles, result.data]
                    }))

                }else {
                    message.error(result.mes)
                }
                this.form.resetFields()
            }
          });
    }

    //设置权限
    setAuth = () => {
        const { role } = this.state
        let arr = Object.keys(role)
        if (arr.length === 0) {
            message.error('请选中要设置的角色')
        } else {
            this.setState({ isShowAuth: true})
        }
    }

    //选中行
    onRow = role => {
        return {
            onClick: event => {
                this.setState({ role })

            }
        }
    }

    //更新权限
    updateRole = async () => {
        //获取原角色权限
        const { role } = this.state
        //获取子组件提交的新权限
        const menus = this.authRef.current.getMenus()
        //新权限覆盖原权限
        role.menus = menus

        //更新授权人
        role.auth_name = memUtils.isLogin.username

        //更新操作
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            this.setState({ isShowAuth: false })
            message.success('角色权限更新成功')
            // 重新获取状态
            this.getRoles() 
        } else {
            message.error(result.mes)
        }
    }

    //取消添加角色操作
    handleCancel = () => {
        this.setState({ isShow: false })
        this.form.resetFields()
    }

    //取消设置权限操作
    handleAuthCancel = () => {
        this.setState({ isShowAuth: false})
        
    }


    render() {
        const { loading, roles, isShow, isShowAuth, role } = this.state
        const title = (
            <span>
                <Button type="primary" onClick={() => { this.setState({ isShow: true})}}>添加角色</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={this.setAuth}>设置权限</Button>
            </span>
        )
        return (
            <div>
               <Card title={title}>
                   <Table
                      bordered={true}
                      rowKey="_id"
                      loading={loading}
                      columns={this.columns}
                      dataSource={roles}
                      pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                      rowSelection={{ type: 'radio', selectedRowKeys: [role._id]}}
                      onRow={this.onRow}

                   />
                   <Modal
                        title="添加角色"
                        visible={isShow}
                        onOk={this.addRole}
                        onCancel={this.handleCancel}
                   >
                     <RoleForm getForm={roleForm => this.form = roleForm}/>  
                   </Modal>
                   <Modal
                        title="设置权限"
                        visible={isShowAuth}
                        onOk={this.updateRole}
                        onCancel={this.handleAuthCancel}
                   >
                       <AuthForm role={role} ref={this.authRef}/>
                   </Modal>
               </Card>
            </div>
        )
    }
}
