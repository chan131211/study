import React, { Component } from 'react'
import { Form, Input, Tree} from 'antd'
import { menuList } from '../../config/menu'
import PropTypes from 'prop-types'
const{ Item } = Form
const{ TreeNode } = Tree
export default class AuthForm extends Component {

    constructor(props) {
        super(props)

        //拿到传入角色的初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    static propTypes = {
        role: PropTypes.object
    }

    componentWillMount() {
        this.treeNode = this.getTreeNode(menuList)
    }

    componentWillReceiveProps(nextProps) {
        const { menus } = nextProps.role
        this.setState({ checkedKeys: menus })
    }

    //自动生成权限树形结构
    getTreeNode = menuList => {
        return menuList.map( item => {
            // 判断是否含有子菜单 
            if (item.childMenu) {
                return (
                    <TreeNode title={item.title} key={item.key}>
                        {this.getTreeNode(item.childMenu)}
                    </TreeNode>
                )
            } else {
                return (
                    <TreeNode title={item.title} key={item.key}></TreeNode>
                )
            }
        })
    }

    //获取设置的权限
    getMenus = () => this.state.checkedKeys

    onCheck = (checkedKeys) => {
        console.log(checkedKeys)
        this.setState({ checkedKeys })
    };

    render() {
        const { checkedKeys } = this.state
        const { role } = this.props
        const formConfig = {
            labelCol: { span: 4},
            wrapperCol: { span: 15}
        }
        return (
            <div>
                <Item label={'角色名称'} {...formConfig}>
                    <Input value={ role.name } disabled/>
                </Item>
                <Item>
                    <Tree
                        checkable
                        checkedKeys={checkedKeys}
                        defaultExpandAll={true}
                        onCheck={this.onCheck}
                    >
                        <TreeNode title="管理权限" key="0-0">
                            {this.treeNode}
                        </TreeNode> 
                    </Tree>
                </Item>
            </div>
        )
    }
}
