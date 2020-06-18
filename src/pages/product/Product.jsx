import React, { Component } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import ProductHome from './Home'
import ProductAdd from './Add'

export default class Product extends Component {
    render() {
        return (
                <Switch>
                    <Route path="/admin/product" exact component={ProductHome}/>
                    <Route path="/admin/product/add" component={ProductAdd}/>
                    <Redirect to="/admin/product"/>
                </Switch>  
        )
    }
}
