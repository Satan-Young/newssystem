/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-10 15:01:37
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-03 17:06:44
 * @FilePath: \newssystem2\src\component\sidebar\TopHeader.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { NavLink, withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
const { Header } = Layout

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    // setCollapsed(!collapsed)
    console.log(props.isCollapse);
    props.changeCollapsed()
  }
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'));
  const menu = (
    <Menu>
      <Menu.Item key='1'>{roleName}</Menu.Item>
      <Menu.Item key='2' danger>
        <NavLink to="/login" onClick={() => localStorage.removeItem("token")}>退出</NavLink>
      </Menu.Item>
    </Menu>
  );
 
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0px 16px',
      }}
    >
      {
        props.isCollapse ?
          <MenuUnfoldOutlined onClick={changeCollapsed}></MenuUnfoldOutlined> :
          <MenuFoldOutlined onClick={changeCollapsed}></MenuFoldOutlined>
      }

      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '20px' }}>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
        </Dropdown>
      </div>
    </Header>
  )
}
const mapStateToProps =({collapseReducer:{isCollapse}})=>{
  return {
    isCollapse
  }
}
const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type:'changeCollapse'
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
