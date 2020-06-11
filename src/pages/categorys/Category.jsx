import React, { Component } from 'react'
import {Card, Button, Table, Modal} from 'antd'
import CategoryFrom from './CategoryFrom'
import {reqAddCategory} from '../../api/index'
export default class Categorys extends Component {
    state = {
        loading: false, //是否在请求
        Categorys: [], //所有分类
        showStatus: 0 // 0：不显示 1：显示添加 2：显示修改

    }

    //组件挂载前
    componentWillMount() {
        this.getColumns()
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
                width: 200
            }
        ]
    }

    //确认添加/修改操作
    handleOk = () => {
        //读取用户输入的数据
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const {categoryName} = values
                const {showStatus} = this.state
                let result = ''
                if (showStatus == 1) {
                    //发送添加分类请求
                    result = await reqAddCategory(categoryName)
                    console.log(result)
                }
                // 重置所有表单数据
                this.form.resetFields()
                // 重置父组件的showStatus
                this.setState({ showStatus: 0 })
            }
        })
    }
    
    //取消添加/修改操作
    handleCancel = () => {
    this.setState({ showStatus: 0})
    }

    render() {
        let {loading, Categorys, showStatus} = this.state
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
                />
                <Modal
                    title="添加分类"
                    visible={showStatus !== 0}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <CategoryFrom getForm={CategoryFrom => this.form = CategoryFrom}/>
                </Modal>
            </Card>
        )
    }
}
