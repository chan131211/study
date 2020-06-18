import React, { Component } from 'react'
import { Card, Table, Button, Input, Select, Popconfirm, message } from 'antd'
import { reqGetProducts, reqUpdateProductStatus, reqDelProduct } from '../../api/index'
const Option = Select.Option
export default class Home extends Component {
    state = {
        loading: false,
        products: [], //所有商品
    }

    constructor(props) {
        super(props)
        //创建搜索的对象
        this.selectRef = React.createRef()
        this.inputRef = React.createRef()
        
    }

    componentWillMount() {
        this.getColumns()
    }

    componentDidMount() {
        this.getProducts()
    }

    //异步获取商品
    getProducts = async () => {
        this.setState({ loading: true})
        const result = await reqGetProducts()
        if (result.status === 0) {
            this.setState({
                loading: false,
                products: result.data
            })
        } else {
            this.setState({ loading: false })
        }
    }

    //设置商品状态样式
    productStatusStyle = (status, product) => {
        let btnValue = '下架'
        let statusText = '在售'

        if (status === 1) {
            btnValue = '上架'
            statusText = '停售'
        }

        return (
            <span>
                <Button onClick={() => {this.productStatus(product)}}>{btnValue}</Button>&nbsp;
                <span>{statusText}</span>
            </span>
        )
    }

    //设置商品状态
    productStatus = async (product) => {
        this.setState({ loading: true })
        const { _id, status} = product
        const result = await reqUpdateProductStatus(_id, status)
        
        if (result.status === 0) {
            this.setState({ loading: false })
            this.getProducts()
        } else {
            this.setState({ loading: false })
        }
    }

    //删除商品
    delProduct = async (_id) => {
        const result = await reqDelProduct(_id)
        if (result.status === 0) {
            this.getProducts()
            message.success(result.mes)
        } else {
            message.error(result.mes)
        }
    }

    //搜索框操作
    ckeckProduct = () => {
        const result = this.selectRef.current
        const condition = this.inputRef.current.state.value
        console.log(result,condition)
    }

    //商品的操作
    productManage = (product) => {
        return(
            <span>
                <Button type="primary">详情</Button>&nbsp;&nbsp;
                
                
                <Popconfirm
                    title="确定删除该商品吗?"
                    onConfirm={() => {this.delProduct(product._id)}}
                    okText="是"
                    cancelText="否"
                >
                    <Button type="danger">删除</Button>
                </Popconfirm>
            </span>
        )
    }

    //获取table-columns
    getColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '商品价格',  
                dataIndex: 'price',
                render: price => '￥' + price
            },
            {
                title: '商品状态',
                dataIndex: 'status',
                width: 130,
                render: this.productStatusStyle
            },
            
            {
                title: '操作',
                width: 200,
                render: this.productManage
            }
        ]
    }

    //添加商品按钮
    addProduct = () => {
        this.props.history.push('/admin/product/add')
    }

    render() {
        let { loading, products } = this.state
        const extraButton = (
            <Button type="primary" onClick={this.addProduct}>添加商品</Button>
        )
        const title = (
            <span>
                <Select style={{width: 100}} ref={this.selectRef}>
                    <Option value="1" >按名称</Option>
                    <Option value="2" ref={this.selectRef}>按描述</Option>
                </Select>
                &nbsp; &nbsp; 
                <Input style={{ width: 160}} placeholder="请输入关键字..." ref={this.inputRef}/>
                <Button type="primary" onClick={this.ckeckProduct}>搜索</Button>
            </span>
        )
        return (
            <div>
                 <Card extra={extraButton} title={title}>
                    <Table
                        bordered={true}
                        rowKey="_id"
                        loading={loading}
                        columns={this.columns}
                        dataSource={products}
                        pagination={{defaultCurrent: 1, defaultPageSize: 5, showQuickJumper: true}}
                    />   
                </Card>
            </div>
        )
    }
}
