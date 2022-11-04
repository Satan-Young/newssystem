import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import './sideMenu.css'
import { Layout, Menu } from 'antd'
import{connect} from 'react-redux'
const { Sider } = Layout
const { SubMenu } = Menu

function SideMenu(props) {
    const [menuList, setMenuList] = useState([])

    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get('http://localhost:5000/rights?_embed=children')
            .then(res => {
                setMenuList(res.data)
            })
    }, [])


    const checkPagePermisson = (item)=>{
        return item.pagepermisson === 1 && rights.includes(item.key)
    }
    const renderMenu = (menuList) => {
        return menuList.map((dataItem) => {
            if (dataItem.children?.length > 0 && checkPagePermisson(dataItem)) {
                return (
                    <SubMenu
                        key={dataItem.key}
                        title={dataItem.title}
                    >
                        {renderMenu(dataItem.children)}
                    </SubMenu>
                )
            } else {
                return checkPagePermisson(dataItem) && (
                    <Menu.Item
                        key={dataItem.key}
                        onClick={() => { props.history.push(dataItem.key) }}
                    >{dataItem.title}
                    </Menu.Item>
                )
            }
        })
    }


    // const [items, setItems] = useState([])

    // useEffect(() => {
    //     axios.get('http://localhost:5000/rights?_embed=children')
    //         .then((res) => {
    //             console.log(res.data);
    //             const sideItem = []
    //             for (let i = 0; i < res.data.length; i++) {
    //                 // 判断当前对象的pagepremission是否为 1 (是否可编辑  不可编辑就将当前数组对象设置为null 不在页面上展示)
    //                 if (res.data[i].pagepermisson === 1) {
    //                     sideItem.push(getItem(res.data[i].title, res.data[i].key, [], null))
    //                     // 是否有children
    //                     if (res.data[i].children.length !== 0) {
    //                         // 给当前sideItem添加一个孩子属性
    //                         sideItem[i].children = []
    //                         for (let j = 0; j < res.data[i].children.length; j++) {
    //                             const item = res.data[i].children[j]
    //                             if (item.pagepermisson === 1) {
    //                                 sideItem[i].children.push(getItem(item.title, item.key, null, null))
    //                             }
    //                         }
    //                     }
    //                 } else {
    //                     sideItem[i] = null
    //                 }
    //             }
    //             setItems(sideItem)
    //         })
    // }, [])

    // function getItem(label, key, children, type) {
    //     return {
    //         label,
    //         key,
    //         icon: null,
    //         children,
    //         type,
    //     };
    // }
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapse} >
            <div style={{
                // width: 205,
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                overflow: 'auto'
            }}>
                <div className="logo">全球新闻发布管理系统</div>
                <div style={{
                    // width: 195,
                    flex: 1
                }}>
                    {/* <Menu
                        onClick={click}
                        // defaultSelectedKeys={[bigProps.location.pathname]}
                        defaultOpenKeys={['/' + bigProps.location.pathname.split('/')[1]]}
                        selectedKeys={[bigProps.location.pathname]}
                        theme="dark"
                        mode="inline"
                        items={items}
                    /> */}
                    <Menu
                        defaultOpenKeys={['/' + props.location.pathname.split('/')[1]]}
                        selectedKeys={[props.location.pathname]}
                        theme="dark"
                        mode="inline"
                    >
                        {/* <Menu.Item key='1'>首页</Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <span>Navigation One</span>
                                </span>
                            }
                        >
                            <Menu.ItemGroup key="g1" title="Item 1">
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup key="g2" title="Item 2">
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu> */}
                        {renderMenu(menuList)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({collapseReducer:{isCollapse}})=>{
    return {isCollapse}
}
export default connect(mapStateToProps)(withRouter(SideMenu))