import React, { Component } from 'react'
import {Card, Button, Table, Modal, message, Popconfirm} from 'antd'
import CategoryFrom from './CategoryFrom'
import {reqAddCategory, reqGetCategorys, reqUpdateCategory, reqAllCategorys, reqdelCategory} from '../../api/index'
import MyButton from '../../components/my-button/MyButton'
export default class Categorys extends Component {
    state = {
        loading: false, //是否在请求
        categorys: [], //顶级分类
        // subCategorys: [], //所有子分类
        allCategorys: [], //所有的分类
        showStatus: 0, // 0：不显示 1：显示添加 2：显示修改
        parentId: '0', //父级分类id
        parentName: '', //父类名称
        name: '', //要修改的分类名
        _id : '', //要修改的分类id
        

    }

    //组件挂载前
    componentWillMount() {
        this.getColumns()
    }

    componentDidMount() {
        this.getCategorys()
        this.getAllCategorys()
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

    //获取子分类列表
    getSubCategorys = (category) => {
        //修改状态中的parentId和parentName
        //因为这里的setState也是异步，不能立刻拿到结果。所有写一个回调函数来执行
        this.setState({
            parentId: category._id,
            parentName: category.name
        },() => {
            this.getCategorys()
        })
    }

    //获取所有的的分类
    getAllCategorys = async () => {
        const result = await reqAllCategorys()
        if (result.status === 0) {
            // //获取分类列表
            // let allCategorys  = result.data
            //写入状态中的allCategory
            this.setState({ allCategorys: result.data })
        }
    }

    //根据_id查询子分类
    checkSubCategory = _id => {
        //获取所有分类
        let { allCategorys} = this.state
        this.isSubCate = false
        allCategorys.forEach(item => {
            if (item.parentId === _id) {
                this.isSubCate= true
                return
            }
        })

    }

    //显示修改分类框
    showUpdate = (category) => {
        let { _id, name } = category

        //修改状态中的showStatus _id name
        this.setState({
             showStatus: 2,
             _id,
             name
            })
    }

    //分类下是否含有子分类
    hasSubCategory = category => {
        let { _id } = category
        this.checkSubCategory(_id)
        if (this.isSubCate) {
            return (
                <span>
                    <MyButton onClick={() => {this.showUpdate(category)}}>修改</MyButton>
                    <MyButton onClick={() => {this.getSubCategorys(category)}}>查看子分类</MyButton>
                </span>
            )
        } else {
            return (
                <span>
                    <MyButton onClick={() => {this.showUpdate(category)}}>修改</MyButton>
                    
                    <Popconfirm
                        title="确定删除该分类吗?"
                        onConfirm={() => {this.delCategory(category)}}
                        okText="删除"
                        cancelText="取消"
                    >
                        <MyButton style={{color: '#F00'}}>删除</MyButton>
                    </Popconfirm>
                </span>  
            )
        } 
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
                render: this.hasSubCategory
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

    //删除分类
    delCategory = async (category) => {
        //查询该分类下是否有商品，有则无法删除。要先删除商品或修改商品分类

        const result = await reqdelCategory(category._id)
        if (result.status === 0) {
            this.getCategorys()
            message.success(result.mes)

        } else {
            message.error('删除分类失败')
        }
    }
    
    //取消添加/修改操作
    handleCancel = () => {
        this.setState({ showStatus: 0})
        //清空表单数据
        this.form.resetFields()
    }

    //返回顶级分类
    showTopCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        }, () => {
            //获取顶级分类列表
            this.getCategorys()
        })
    }

    render() {
        let {loading, categorys, showStatus, parentId, parentName} = this.state
        let {_id, name} = this.state
        const extraButton = (
            <Button type="primary" onClick={() => {
                this.Categorys = {}
                this.setState({ showStatus: 1 })
            }}>添加分类</Button>
        )

        const title = parentId === '0' ? '一级分类' : (
            <span>
                <MyButton onClick={this.showTopCategorys}>一级分类</MyButton>&nbsp;&nbsp;&gt;&nbsp;&nbsp;
                <span>{parentName}</span>  
            </span>
        )
        return (
            <Card extra={extraButton} title={title}>
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
