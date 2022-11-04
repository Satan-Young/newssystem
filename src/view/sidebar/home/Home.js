/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-10 15:03:55
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-04 16:26:53
 * @FilePath: \newssystem2\src\view\sidebar\home\Home.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Avatar } from 'antd'
import axios from 'axios'
// import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function Home() {
  const {username,role:{roleName}} = JSON.parse(localStorage.getItem('token'))
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expend=category&_sort=view&_order=desc&_limit=6')
      .then(res => {
        setViewList(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/news?publishState=2&_expend=category&_sort=star&_order=desc&_limit=6')
      .then(res => {
        setStarList(res.data)
      })
  }, [])
  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="浏览数最多" bordered={false}>
              <ul style={{ listStyle: 'none', padding: '0px' }}>
                {
                  viewList.map((dataItem) => {
                    return (
                      <div key={dataItem.id} style={{ lineHeight: '30px' }}>
                        <a href={`#/news-manage/preview/${dataItem.id}`}>
                          <li>{dataItem.title}</li>
                        </a>
                      </div>
                    )
                  })
                }
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="点赞数最多" bordered={false}>
              <ul style={{ listStyle: 'none', padding: '0px' }}>
                {
                  starList.map((dataItem) => {
                    return (
                      <div key={dataItem.id} style={{ lineHeight: '30px' }}>
                        <a href={`#/news-manage/preview/${dataItem.id}`}>
                          <li>{dataItem.title}</li>
                        </a>
                      </div>
                    )
                  })
                }
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              style={{
                width: 300,
              }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              // actions={[
              //   <SettingOutlined key="setting" />,
              //   <EditOutlined key="edit" />,
              //   <EllipsisOutlined key="ellipsis" />,
              // ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={roleName}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
