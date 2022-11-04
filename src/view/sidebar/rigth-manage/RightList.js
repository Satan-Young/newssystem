import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal

export default function RightList() {

  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children')
      .then((res) => {
        const list = res.data
        list.forEach(element => {
          if (element.children.length === 0) {
            element.children = null
          }
        });
        setData(list)
      })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '权限名称',
      dataIndex: 'title',
    }, {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return (
          <Tag color='green'>{key}</Tag>
        )
      }
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
            <Popover
              content={
                <div style={{ textAlign: 'right' }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => { changePagepermisson(item) }}></Switch>
                </div>
              }
              title="配置项"
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button
                shape='circle'
                type='primary'
                icon={<EditOutlined />}
                disabled={item.pagepermisson===undefined}
              ></Button>
            </Popover>
          </div>
        )
      }
    }
  ]

  const changePagepermisson = (item) => {
    console.log(item);
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setData([...data])
    if (item.grade === 2) {
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson : item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson : item.pagepermisson
      })
    }
  }

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
    console.log(item);
    // 当前页面同步状态 + 后端同步
    // 判断是否是一级菜单
    if (item.grade === 1) {
      setData(data.filter((data) => {
        return data.id !== item.id
      }))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    } else {
      // 找到上级菜单
      let fatherList = data.filter((dataItem) => {
        return dataItem.id === item.rightId
      })
      // 将该元素从上级菜单中删除
      fatherList[0].children = fatherList[0].children.filter((fatherListItem) => {
        return fatherListItem.id !== item.id
      })
      setData([...data])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }
  }

  return (
    <div>
      <Table
        pagination={{ pageSize: 4 }}
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}
