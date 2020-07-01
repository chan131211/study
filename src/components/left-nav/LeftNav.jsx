import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import  './leftnav.less'
import {Link, withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.jpg'
import {menuList} from '../../config/menu'
import memUtils from '../../utils/memUtils'
import { reqCheckRole } from '../../api/index'

const { SubMenu } = Menu;

class LeftNav extends Component {
    state = {
        collapsed: false,
        menus: [] //角色权限
    };
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    };

    //遍历数组配置文件
    showMenu = (menuList) => {
        const { menus } = this.state.menus
        if (menus) {   
            return menuList.map(item => {  
                return menus.map( role => {
                    if (role === item.key) {
                        //判断是否包含子菜单
                        if(!item.childMenu) {
                            return (
                                <Menu.Item key={item.key}>
                                    <Link to={item.key}>
                                        <Icon type={item.icon}/>
                                        <span>{item.title}</span>
                                    </Link>
                                </Menu.Item>
                            )
                        }
                        return(
                            <SubMenu
                                key={item.key}
                                title={
                                    <span>
                                        <Icon type={item.icon}/>
                                        <span>{item.title}</span>
                                    </span>
                                }
                            >
                                {this.showMenu(item.childMenu)}
                            </SubMenu>
                        )
                    }  
                }) 
            })
        }
    }

    componentWillMount() {
        this.checkRoles()
    }

    //查找用户的权限
    checkRoles = async () => {
        const { roleId } = memUtils.isLogin
        const result = await reqCheckRole(roleId)
        if (result.status === 0) {
            this.setState({ menus: result.data }, () => {
                const myMenu = this.showMenu(menuList)
                this.setState({ myMenu })
            })
        }
    }

    render() {
        const { myMenu } = this.state
        const pathKey = this.props.location.pathname
        return (
            <div className="left-nav">
                <Link className="left-nav-link" to="/home">
                    <img src={ logo } alt=""/>
                    <h1>商城后台</h1>
                </Link>
                <Menu
                    selectedKeys={[pathKey]}
                    defaultOpenKeys={['/goods']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    { myMenu }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)