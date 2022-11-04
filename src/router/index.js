import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import React from 'react'
import Login from '../view/login/Login'
import Sidebar from '../view/sidebar/Sidebar'

export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/' render={()=>{
                    return(
                    localStorage.getItem("token")?
                    <Sidebar></Sidebar> :
                    <Redirect to='/login'/>
                    )
                }}/>
            </Switch>
        </HashRouter>
    )
}
