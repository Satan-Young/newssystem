/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-24 14:52:15
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-01 10:49:34
 * @FilePath: \newssystem2\src\component\sidebar\NewRouters.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../../view/sidebar/home/Home'
import UserList from '../../view/sidebar/user-manage/UserList'
import RightList from '../../view/sidebar/rigth-manage/RightList'
import RoleList from '../../view/sidebar/rigth-manage/RoleList'
import NoPermission from '../../view/sidebar/nopermission/NoPermission'
import NewsAdd from '../../view/sidebar/news/NewsAdd'
import NewsDraft from '../../view/sidebar/news/NewsDraft'
import NewsCategory from '../../view/sidebar/news/NewsCategory'
import Audit from '../../view//sidebar/audit/Audit'
import AuditList from '../../view/sidebar/audit/AuditList'
import Unpublished from '../../view/sidebar/publish/Unpublished'
import Published from '../../view/sidebar/publish/Published'
import Sunset from '../../view/sidebar/publish/Sunset'
import NewsPreview from '../../view/sidebar/news/NewsPreview'

import axios from 'axios'
import NewsUpdate from '../../view/sidebar/news/NewsUpdate'

const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id":NewsPreview,
    "/news-manage/update/:id":NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

export default function NewRouters() {


    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))

    const [routerList, setRouterList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:5000/rights'),
            axios.get('http://localhost:5000/children')
        ]).then((res) => {
            setRouterList([...res[0].data, ...res[1].data])
        })
    }, [])
    
    const checkRouter = (item)=>{
        return  LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkPremission = (item)=>{
        return rights.includes(item.key)
    }

    return (
        <Switch>
            {
                routerList.map((item) => {
                    if (checkRouter(item) && checkPremission(item)) {
                        return (
                            <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
                        )
                    }
                    return null
                })
            }
            {/* <Route path='/home' component={Home}></Route>
            <Route path='/user-manage/list' component={UserList}></Route>
            <Route path='/right-manage/role/list' component={RoleList}></Route>
            <Route path='/right-manage/right/list' component={RightList}></Route> */}
            <Redirect from='/' to='/home' exact />
            {
                routerList.length > 0 && <Route path='*' component={NoPermission}></Route>
            }
        </Switch>
    )
}
