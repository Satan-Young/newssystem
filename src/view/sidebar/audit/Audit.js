/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-24 15:06:32
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-02 15:12:19
 * @FilePath: \newssystem2\src\view\sidebar\audit\Audit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Table, notification } from 'antd'

export default function Audit() {

  const { roleId, username, region } = JSON.parse(localStorage.getItem('token'))

  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    const roleObj = {
      '1': 'superAdmin',
      '2': 'regionAdmin',
      '3': 'regionEdit'
    }
    axios.get(`http://localhost:5000/news?auditState=1`)
      .then(res => {
        setDataSource(roleObj[roleId] === 'superAdmin' ?
          res.data :
          [...res.data.filter((item) => { return username === item.username }),
          ...res.data.filter((item) => { return region === item.region && roleObj[item.roleId] === 'regionEdit' })
          ])
      })
  }, [roleId, username, region])

  const columns = [{
    title: 'ID',
    dataIndex: 'id',
  }, {
    title: '新闻标题',
    dataIndex: 'title',
    render: (title, item) => {
      return (<a href={`#/news-manage/preview/${item.id}`}>{title}</a>)
    }
  }, {
    title: '新闻分类',
    dataIndex: 'category',
  }, {
    title: '作者',
    dataIndex: 'author',
  }, {
    title: '操作',
    render: (item) => {
      return (
        <div>
          <Button
            type='primary'
            style={{ marginRight: '10px' }}
            onClick={() => { handlePass(item) }}
          >
            通过
          </Button>
          <Button
            danger
            onClick={() => { handleBack(item) }}
          >
            驳回
          </Button>
        </div>
      )
    }
  }
  ]

  const handlePass = (item) => {
    setDataSource(dataSource.filter(dataItem => dataItem.id !== item.id))
    axios.patch(`http://localhost:5000/news/${item.id}`, {
      auditState: 2,
      publishState:1
    }).then(() => {
      notification.success({
        message: '通知',
        description:
          `该新闻已通过审核，可以发布`,
      });
    })
  }
  const handleBack = (item) => {
    setDataSource(dataSource.filter(dataItem => dataItem.id !== item.id))
    axios.patch(`http://localhost:5000/news/${item.id}`, {
      auditState: 3
    }).then(() => {
      notification.success({
        message: '通知',
        description:
          `该新闻审核未通过`,
      });
      // props.history.push('/news-manage/draft')
    })
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.id}></Table>
    </div>
  )
}
