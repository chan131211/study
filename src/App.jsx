import React, { Component } from 'react'
import {Button, message, Calendar} from 'antd'
export default class App extends Component {
    clickHandler = () => {
        message.success('添加成功')
    }
    onPanelChange = (value, mode) => {
        console.log(value, mode)
    }
    render() {
        return (
            <div>
                <h1>后台首页</h1>
                <Button type="primary" onClick={this.clickHandler}>Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="danger">Danger</Button>
                <Button type="link">Link</Button>
                <Calendar onPanelChange={this.onPanelChange} />
            </div>
        )
    }
}
