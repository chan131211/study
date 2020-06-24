import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
class RoleForm extends Component {
    static propTypes = {
        getForm: PropTypes.func.isRequired
    }

    render() {
        //将高阶组件form传递给父组件
        this.props.getForm(this.props.form)
        const { getFieldDecorator } = this.props.form

        const formConfig = {
            labelCol: { span: 4},
            wrapperCol: { span: 15}
        }
        return (
            <Form>
                <Item label={'角色名称'} {...formConfig}>
                    {getFieldDecorator('name', {
                        initialValue: '',
                        rules: [
                            { required: true, message: '必需输入角色名称!'}
                        ]
                    })(
                        <Input type="text" placeholder="请输入角色名称"/>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(RoleForm)