import React, { Component } from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class CategoryFrom extends Component {

    static propTypes = {
        getForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        //将子组件中的form对象传递给父组件
        this.props.getForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form

        return (
            <Form>
                <Item>
                {getFieldDecorator('categoryName', {
                    rules: [{ required: true, message: '分类名称必填!' }],
                })(
                    <Input type="text"placeholder="请输入分类名称"/>
                )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(CategoryFrom)
