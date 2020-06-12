import React, { Component } from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import CategoryFrom from './CategoryFrom'
import {reqAddCategory, reqGetCategorys, reqUpdateCategory} from '../../api/index'
import MyButton from '../../components/my-button/MyButton'
export default class Categorys extends Component {
    state = {
        loading: false, //是否在请求
        categorys: [], //所有分类
        showStatus: 0, // 0：不显示 1：显示添加 2：显示修改
        parentId: '0', //父级分类id
        name: '', //要修改的分类名
        _id : '', //要修改的分类id

    }

    //组件挂载前
    componentWillMount() {
        this.getColumns()
    }

    componentDidMount() {
        this.getCategorys()
    }

    //异步获取分类列表
    getCategorys = async () => {
        this.setState({loading: true})
        const { parentId } = this.state
        const result = await reqGetCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            this.setState({ loading: false, categorys })
        } else {
            this.setState({ loading: false })
        }

    }

    //显示修改分类框
    showUpdate = (manage) => {
        let { _id, name } = manage

        //修改状态中的showStatus _id name
        this.setState({
             showStatus: 2,
             _id,
             name
            })
    }

    //获取table-columns
    getColumns = () => {
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 200,
                render: manage => (
                    <span>
                        <MyButton onClick={ () => {this.showUpdate(manage)} }>修改</MyButton>|
                        <MyButton>查看子分类</MyButton>
                    </span>
                )
            }
        ]
    }

    //确认添加/修改操作
    handleOk = () => {
        //读取用户输入的数据
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { name, parentId } = values
                const { showStatus } = this.state
                let result = ''
                if (showStatus === 1) {
                    //发送添加分类请求
                    result = await reqAddCategory(name, parentId)
                }
                // 重置所有表单数据
                this.form.resetFields()
                // 重置父组件的showStatus
                this.setState({ showStatus: 0 })    

                if (result.status === 0) {
                    this.getCategorys()
                    message.success('添加分类成功')
                } else {
                    message.error('添加分类失败')
                }
            }
        })
    }

    //修改分类名操作
    updateCategory = () => {
        //读取用户输入的数据
        this.form.validateFields( async (err, values) => {
            if (!err) {
                const { _id, name } = values
                const { showStatus } = this.state
                let result = ''
                if (showStatus === 2) {
                    //发送更新分类请求
                    result = await reqUpdateCategory(_id, name) 
                }
                // 重置所有表单数据
                this.form.resetFields()
                // 重置父组件的showStatus
                this.setState({ showStatus: 0 })
                
                if (result.status === 0) {
                    this.getCategorys()
                    message.success(result.mes)
                } else {
                    message.error(result.mes)
                }
            }
        })
    }
    
    //取消添加/修改操作
    handleCancel = () => {
    this.setState({ showStatus: 0})
    }

    render() {
        let {loading, categorys, showStatus, parentId} = this.state
        let {_id, name} = this.state
        const extraButton = (
            <Button type="primary" onClick={() => {
                this.Categorys = {}
                this.setState({ showStatus: 1 })
            }}>添加分类</Button>
        )
        return (
            <Card extra={extraButton}>
                <Table
                    bordered={true}
                    rowKey="_id"
                    loading={loading}
                    columns={this.columns}
                    dataSource={categorys}
                    pagination={{defaultCurrent: 1, defaultPageSize: 5, showQuickJumper: true}}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <CategoryFrom getForm={CategoryFrom => this.form = CategoryFrom} parentId={parentId} categorys={categorys}/>
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <CategoryFrom getForm={CategoryFrom => this.form = CategoryFrom} _id={_id} name={name} flag={{f: true}}/>
                </Modal>
            </Card>
        )
    }
}
