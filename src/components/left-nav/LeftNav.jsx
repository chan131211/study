import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import  './leftnav.less'
import {Link, withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.jpg'
import {menuList} from '../../config/menu'

const { SubMenu } = Menu;

class LeftNav extends Component {
    state = {
        collapsed: false,
    };
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    };

    //遍历数组配置文件
    showMenu = (menuList) => {
        return menuList.map(item => {
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
            
        })
    }

    componentWillMount() {
        this.myMenu = this.showMenu(menuList)
    }

    render() {
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
                    { this.myMenu }
                {
                    // <Menu.Item key="/home">
                    //     <Link to="/home">
                    //         <Icon type="home" />
                    //         <span>首页</span>
                    //     </Link>
                    // </Menu.Item>

                  
                    // <SubMenu
                    //     key="/goods"
                    //     title={
                    //         <span>
                    //             <Icon type="mail" />
                    //             <span>商品</span>
                    //         </span>
                    //     }
                    // >
                    //     <Menu.Item key="/goods">
                    //         <Link to="/goods">
                    //             <Icon type="shop" />
                    //             <span>商品管理</span>
                    //         </Link>
                    //     </Menu.Item>
                    //     <Menu.Item key="/category">
                    //         <Link to="/category">
                    //             <Icon type="apartment" />
                    //             <span>分类管理</span>
                    //         </Link>
                    //     </Menu.Item>
                    // </SubMenu>
                    }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)