import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Tree } from 'antd'
import {
  DeleteOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
const { confirm } = Modal

export default function RoleList() {

  // 表格数据
  const [data, setData] = useState([])
  // 模态框是否开启
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 树形控件数据
  const [treeData, setTreeData] = useState([])
  // 权限被选择数据
  const [rightChecked, setRightChecked] = useState([])
  // 点击时当前ID值
  const [currentId, setCurrentId] = useState(0)

  // 请求表格数据
  useEffect(() => {
    axios.get('http://localhost:5000/roles')
      .then((res) => {
        // console.log(res.data);
        setData([...res.data])
      })
  }, [])

  // 请求树形控件数据
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children')
      .then(res => {
        // console.log(res.data);
        setTreeData([...res.data])
      })
  }, [])

  // 表头格式
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
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
              shape='circle'
              type='primary'
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setIsModalOpen(true)
                setRightChecked(item.rights)
                setCurrentId(item.id)
              }}
            ></Button>
          </div>
        )
      }
    }
  ]

  // 表格事件
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
    // 当前页面同步状态 + 后端同步
    const list = data.filter((dataItem) => {
      return dataItem.id !== item.id
    })
    setData([...list])
    axios.delete(`http://localhost:5000/roles/${item.id}`)
  }

  // 树形控件事件
  const onCheck = (checkedKeys) => {
    setRightChecked(checkedKeys)
  }
  const handleOk = () => {
    // 修改data数据
    setData(data.map((dataItem) => {
      if (currentId === dataItem.id) {
        return {
          ...dataItem,
          rights: rightChecked
        }
      }
      return dataItem
    }))
    // 同步后端
    axios.patch(`http://localhost:5000/roles/${currentId}`,{
      rights:rightChecked
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
      <Modal title="Basic Modal"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false)
          handleOk()
        }}
        onCancel={() => {
          setIsModalOpen(false)
        }}>
        <Tree
          checkable
          checkedKeys={rightChecked}
          onCheck={onCheck}
          treeData={treeData}
          // checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
