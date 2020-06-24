import React, { Component } from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class CategoryFrom extends Component {

    static propTypes = {
        getForm: PropTypes.func.isRequired

    }

    componentWillMount() {
        //将子组件中的form对象传递给父组件
        this.props.getForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { categorys } = this.props
        const { _id, name, flag } = this.props

        if (flag) {
            return (
                <Form>
                    <Item>
                    {getFieldDecorator('_id', {
                        initialValue: _id,
                        rules: [],
                    })(
                        <Input type="hidden"/>
                    )}
                    </Item>
                    <Item>
                    {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [{ required: true, message: '分类名称必填!' }],
                    })(
                        <Input type="text" placeholder="请输入分类名称"/>
                    )}
                    </Item>
                </Form>
            ) 
        }
        return (
            <Form>
                <Item>
                {getFieldDecorator('parentId', {
                    initialValue: '0',
                    rules: [],
                })(
                    <Select>
                        <Option value='0' >顶级分类</Option>
                        {
                            categorys.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                        }
                    </Select>
                )}
                </Item>
                <Item>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '分类名称必填!' }],
                })(
                    <Input type="text" placeholder="请输入分类名称"/>
                )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(CategoryFrom)
