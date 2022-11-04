/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-24 15:05:43
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-01 14:44:21
 * @FilePath: \newssystem2\src\view\sidebar\news\NewsDraft.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

export default function NewsDraft(props) {

  const [data, setData] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expend=category`)
      .then((res) => {
        const list = res.data
        setData(list)
      })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return (<a href={`#/news-manage/preview/${item.id}`}>{title}</a>)
      }
    }, {
      title: '作者',
      dataIndex: 'author',
    }, {
      title: '新闻类别',
      dataIndex: 'category',
    }, {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape='circle'
              style={{ marginRight: '20px' }}
              icon={<DeleteOutlined />}
              onClick={() => showConfirm(item)}></Button>
            <Button
              style={{ marginRight: '20px' }}
              shape='circle'
              type='primary'
              icon={<EditOutlined />}
              onClick={() => { props.history.push(`/news-manage/update/${item.id}`) }}
            ></Button>
            <Button
              shape='circle'
              type='primary'
              icon={<UploadOutlined />}
              onClick={() => { uploadClick(item.id) }}
            ></Button>
          </div>
        )
      }
    }
  ]

  const showConfirm = (item) => {
    confirm({
      title: '是否确认删除当前内容',
      icon: <ExclamationCircleOutlined />,
      // content: '是否确认删除当前内容',
      onOk() {
        deleteData(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteData = (item) => {
    const list = data.filter((dataItem) => { return dataItem.id !== item.id })
    setData(list)
    axios.delete(`http://localhost:5000/news/${item.id}`)
  }

  const uploadClick = (id) => {
    axios.patch(`http://localhost:5000/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list')
      notification.success({
        message: '通知',
        description:
          `新闻上传成功，你可以在审核列表中查看你上传的新闻`,
      });
    })
  }

  return (
    <div>
      <Table
        pagination={{ pageSize: 4 }}
        columns={columns}
        dataSource={data}
        rowKey={item => item.id}
      />
    </div>
  )
}
