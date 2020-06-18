import React, { Component } from 'react'
import { Card, Form, Input, Select, Button, message } from 'antd'
import { reqAllCategorys, reqAddProduct, reqCheckProduct } from '../../api/index'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RicheEditor'
const Item = Form.Item
const Option = Select.Option
class Add extends Component {
    state = {
        categorys: [], //所有分类
    }

    constructor(props) {
        super(props)
        //创建商品图片的ref对象
        this.picRef = React.createRef()
        //创建商品详情的ref对象
        this.detRef = React.createRef()
    }

    componentDidMount() {
        this.getCategorys()
    }

    //异步获取所有分类
    getCategorys = async () => {
        const result = await reqAllCategorys()
        if (result.status === 0) {
            this.setState({
                categorys: result.data
            })
        }
    }

    //根据name来查询数据库
    checkProduct = async (name) => {
        const result = await reqCheckProduct(name)
        if (result.status === 0) {
           
            return result.result
        }
    }

    // 自定义商品名称验证器
    validateName = (rule, value, callback) => {
        
        const result = this.checkProduct(value)
        result.then(res => {
            this.isName = res
        })
        if (value === '') {
            callback('')
        } else {
            const result = this.checkProduct(value)
            result.then(res => {
                if (res) {
                    callback('当前用户已存在!')
                } else {
                    callback()
                }
            })
            
        }
        
    

        
    }

    // 自定义商品价格验证器
    validatePrice = (rule, value, callback) => {
        console.log(parseInt(value))
       if (value === '') {
             callback()
        }else  if(value * 1 <= 0) {
            callback('价格必须大于0')
        }else {
            callback()
        }
    }

    //提交表单统一验证
    handleSubmit = (event) => {
        
        event.preventDefault()  

        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                const {name, desc, price, categoryId} = values
                const images = this.picRef.current.getImgs()
                const detail = this.detRef.current.getDetail()

                //封装发送的数据
                const product = { name, desc, price, categoryId, images, detail}
                //向后台发送请求
                const result = await reqAddProduct(product)
                if (result.status === 0) {
                    this.props.history.replace('/admin/product')
                    message.success('添加商品成功')
                } else {
                    message.error('添加商品失败')
                }

            }
        })
    }
    

    render() {
        const title = (
            <span>添加商品</span>
        )
        const { getFieldDecorator } = this.props.form;
        const formConfig = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }
        const { categorys } = this.state

        return (
           <Card title={title}>
               <Form {...formConfig} onSubmit={this.handleSubmit}>
                    <Item label="商品名称:">
                        {getFieldDecorator('name', {
                            initialvalue: '',
                            rules: [
                                { required: true, message: '必须填写商品名称!' },
                                { validator: this.validateName}
                            ]
                        })(
                            <Input placeholder="商品名称"/> 
                        )}
                    </Item>
                    <Item label="商品描述:">
                        {getFieldDecorator('desc', {
                            initialvalue: '',
                            rules: [
                                { required: true, message: '必须填写商品描述!' },
                            ]
                        })(
                            <Input placeholder="商品描述"/> 
                        )}
                    </Item>
                    <Item label="商品价格:">
                        {getFieldDecorator('price', {
                            initialvalue: '',
                            rules: [
                                { required: true, message: '必须填写商品价格!' },
                                { validator: this.validatePrice }
                            ]
                        })(
                            <Input type="number" style={{width: 140}} placeholder="商品价格" addonAfter="元"/> 
                        )}
                    </Item>
                    <Item label="商品分类:">
                        {getFieldDecorator('categoryId', {
                            initialvalue: '',
                            rules: [
                                { required: true, message: '必须填写商品分类!' },
                                
                            ]
                        })(
                            <Select style={{width: 200}}>
                                <Option value="0">---请选择---</Option>
                                {
                                    categorys.map(cate => <Option value={cate._id} key={cate._id}>{cate.name}</Option>)
                                }
                            </Select>
                        )}
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.picRef} />
                    </Item>
                    <Item label="商品详情" wrapperCol={{ span: 18}} >
                        <RichTextEditor ref={this.detRef} />
                    </Item>
                    <Item >
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
               </Form>
           </Card> 
        )
    }
}
export default Form.create()(Add)
