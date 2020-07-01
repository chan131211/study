import React, { Component } from 'react'
import { Card, Form, Input, Select, Button, message } from 'antd'
import { reqAllCategorys, reqAddOrUpdateProduct, reqCheckProduct, reqGetProduct } from '../../api/index'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RicheEditor'
import lodash from 'lodash'
// import { Debounce } from '../../utils/debounceUtil'

const Item = Form.Item
const Option = Select.Option
const { debounce } = lodash
class Add extends Component {
    state = {
        categorys: [], //所有分类
        _id: '', //商品_id
        product: [], //商品信息
        flag: 0 // 0 为添加商品 1 为更新商品
    }

    constructor(props) {
        super(props)
        //创建商品图片的ref对象
        this.picRef = React.createRef()
        //创建商品详情的ref对象
        this.detRef = React.createRef()
    }

    componentWillMount() {
        this.checkProductId()
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

    //是否有_id
    checkProductId = () => {
        const result = this.props.location.state
        if(result) {
            const { _id } = result
            this.setState({ _id })
            this.getUpdateProduct(_id)
        } else {
            this.setState({ 
                _id: '',
                product: [],
                flag: 0
            })
        }
    }
    //获取更新的商品信息
    getUpdateProduct = async (_id) => {
        const result = await reqGetProduct(_id)
        if (result.status === 0) {
            const product = result.data
            this.setState({
                product,
                flag: 1
            })
        }
    }

    // 自定义商品名称验证器 加 函数防抖
    validateName = debounce ((rule, value, callback) => {
        //根据name来查询数据库
        reqCheckProduct(value).then(result => {
            if (result.status === 1){
                callback('商品已存在!')
            } else {
                callback()
            }  
        })   
    }, 500)

    // 自定义商品价格验证器
    validatePrice = (rule, value, callback) => {
       if (value * 1 <= 0) {
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
                const product = { name, desc, price, categoryId, images, detail }
                //向后台发送请求
                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    this.props.history.replace('/admin/product')
                    message.success('添加商品成功')
                } else {
                    message.error('添加商品失败')
                }

            }
        })
    }

    //更新商品信息
    handleUpdate =  (event) => {
        event.preventDefault()
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                
                const { _id, name, desc, price, categoryId} = values
                const images = this.picRef.current.getImgs()
                const detail = this.detRef.current.getDetail()
                //封装发送的数据
                const product = { name, desc, price, categoryId, images, detail}
                //向后台发送请求
                const result = await reqAddOrUpdateProduct(product, _id)
                if (result.status === 0) {
                    this.props.history.replace('/admin/product')
                    message.success('更新商品成功')
                } else {
                    message.error('更新商品失败')
                }

            }
        })
    }
    

    render() {
        const { _id, flag } = this.state
        const { getFieldDecorator } = this.props.form;
        const formConfig = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }
        const { categorys } = this.state
        let title = (
            <span>添加商品</span>
        )
        if (_id) {
            title = (
                <span>更新商品</span>
            )
        } 
        if (flag === 1) {
            const { name, desc, price, categoryId, images, detail} = this.state.product[0]
            return (
                <Card title={title}>
                    <Form {...formConfig} onSubmit={this.handleUpdate} >
                         <Item style={{display: 'none'}}>
                             {getFieldDecorator('_id', {
                                  initialValue: _id
                             })(
                                 <Input type="hidden" /> 
                             )}
                         </Item>
                         <Item label="商品名称:">
                             {getFieldDecorator('name', {
                                  initialValue: name,
                                 rules: [
                                     { required: true, message: '必须填写商品名称!' },
                                    //  { validator: this.validateName}
                                 ]
                             })(
                                 <Input placeholder="商品名称" disabled/> 
                             )}
                         </Item>
                         <Item label="商品描述:">
                             {getFieldDecorator('desc', {
                                 initialValue: desc,
                                 rules: [
                                     { required: true, message: '必须填写商品描述!' },
                                 ]
                             })(
                                 <Input placeholder="商品描述"/> 
                             )}
                         </Item>
                         <Item label="商品价格:">
                             {getFieldDecorator('price', {
                                 initialValue: price,
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
                                 initialValue: categoryId,
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
                             <PicturesWall ref={this.picRef} images={images} />
                         </Item>
                         <Item label="商品详情" wrapperCol={{ span: 18}} >
                             <RichTextEditor ref={this.detRef} detail={detail} />
                         </Item>
                         <Item >
                             <Button type="primary" htmlType="submit">更新</Button>
                         </Item>
                    </Form>
                </Card> 
            )
        }
        return (
           <Card title={title}>
               <Form {...formConfig} onSubmit={this.handleSubmit} >
                    <Item label="商品名称:">
                        {getFieldDecorator('name', {
                            initialValue: '',
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
                            initialValue: '',
                            rules: [
                                { required: true, message: '必须填写商品描述!' },
                            ]
                        })(
                            <Input placeholder="商品描述"/> 
                        )}
                    </Item>
                    <Item label="商品价格:">
                        {getFieldDecorator('price', {
                            initialValue: '',
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
                            initialValue: '0',
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
