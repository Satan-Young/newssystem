import React, { useEffect } from 'react'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

import SideMenu from '../../component/sidebar/SideMenu'
import TopHeader from '../../component/sidebar/TopHeader'
import NewRouters from '../../component/sidebar/NewRouters'

import './Sidebar.css'

import { Layout } from 'antd'
const {Content} = Layout

export default function Sidebar() {
  nProgress.start()
  useEffect(()=>{
    nProgress.done()
  },[])
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <NewRouters></NewRouters>
        </Content>
      </Layout>
    </Layout>
  )
}
