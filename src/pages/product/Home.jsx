import React, { Component } from 'react'
import { Form, Card, Table, Button, Input, Select, Popconfirm, Icon, message } from 'antd'
import { reqGetProducts, reqUpdateProductStatus, reqDelProduct, reqSearchProduct } from '../../api/index'
const Item = Form.Item
const Option = Select.Option
class Home extends Component {
    state = {
        loading: false,
        products: [], //所有商品
        total: '' // 商品总条数

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
    getProducts = async (pageNum, pageSize = 2) => {
        this.setState({ loading: true})
        //向后台发送请求
        const result = await reqGetProducts(pageNum, pageSize)
        if (result.status === 0) {
            //获取后台返回的数据
            const { total, list} = result.data
            //更新状态
            this.setState({
                loading: false,
                products: list,
                total
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
            return (
            <span>
                <Button  onClick={() => {this.productStatus(product)}}>{btnValue}</Button>&nbsp;
                <span style={{color: '#F00'}}>{statusText}</span>
            </span>
        )
        }
        return (
            <span>
                <Button style={{color: '#F00'}} onClick={() => {this.productStatus(product)}}>{btnValue}</Button>&nbsp;
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

    //修改商品
    // updateProduct = (product) => {
        
    //     this.props.history.push({ pathname: '/admin/product/add', state: { _id }})
    // }

    //删除商品
    delProduct = async (product) => {
        let { _id, images, detail } = product
        const result2 = detail.split('"')
        result2.forEach(item => {
            const reg = /http:\/\/+/
            if(reg.test(item)) {
                images.push(item.substr(item.lastIndexOf('/') + 1))
            } 
        })
        const result = await reqDelProduct(_id, images)
        if (result.status === 0) {
            this.getProducts()
            message.success(result.mes)
        } else {
            message.error(result.mes)
        }
    }

    //搜索框操作
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                this.setState({ loading: true})
                const { search, condition } = values
                const result = await reqSearchProduct(search, condition)
                if (result.status === 0) {
                    const products = result.data
                    this.setState({
                        products,
                        loading: false
                    })
                } else {
                    this.setState({ loading: false})
                }
            }
        })
    }

    //商品的操作
    productManage = (product) => {
        return(
            <span>
                <Button type="default">详情</Button>&nbsp;&nbsp;
                <Button type="primary" onClick={() => {
                    const { _id } = product
                    this.props.history.push({ pathname: '/admin/product/add', state: { _id }})
                }}>修改</Button>&nbsp;&nbsp;
                
                <Popconfirm
                    title="确定删除该商品吗?"
                    onConfirm={() => {this.delProduct(product)}}
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
                width: 250,
                render: this.productManage
            }
        ]
    }

    //添加商品按钮
    addProduct = () => {
        this.props.history.push('/admin/product/add')
    }

    render() {
        let { loading, products, total } = this.state
        const { getFieldDecorator } = this.props.form
        const extraButton = (
            
            <Button onClick={this.addProduct}><Icon type="plus" />添加商品</Button>
        )
        const title = (
            <span>
                <Form layout="inline" onSubmit={this.handleSubmit} >
                    <Item>
                        {getFieldDecorator('search', {
                            initialValue: '0',
                        })(
                            <Select style={{width: 100}} >
                                <Option value="0" >按名称</Option>
                                <Option value="1" >按描述</Option>
                            </Select>   
                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('condition', {
                                initialValue: '',
                        })(
                            <Input style={{ width: 160}} placeholder="请输入关键字..." />
                        )}
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Item>
                </Form>
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
                        pagination={{ total, defaultPageSize: 2, showQuickJumper: true, onChange: this.getProducts}}
                    />   
                </Card>
            </div>
        )
    }
}

export default  Form.create()(Home)
