import { Table, Button, Switch, Modal } from 'antd'
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import UserForm from '../../../component/user/UserForm'
const { confirm } = Modal

export default function UserList() {
  // 表格数据
  const [dataSource, setDataSource] = useState([])
  // 模态框是否开启
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  // 地区数据
  const [regionList, setRegionList] = useState([])
  // 角色数据
  const [roleList, setRoleList] = useState([])
  // 
  const [isUpdateDisable, setIsUpdateDisable] = useState(false)
  // 
  const [currentItem, setCurrentItem] = useState([])
  // 表单ref
  const addFormRef = useRef(null)
  const updateFormRef = useRef(null)

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));

  // 请求表格数据
  useEffect(() => {
    const roleObj = {
      '1': 'superAdmin',
      '2': 'regionAdmin',
      '3': 'regionEdit'
    }
    axios.get('http://localhost:5000/users?_expand=role')
      .then(res => {
        // console.log(res.data);
        setDataSource(roleObj[roleId] === 'superAdmin' ?
          res.data :
          [...res.data.filter((item) => { return username === item.username }),
          ...res.data.filter((item) => { return region === item.region && roleObj[item.roleId] === 'regionEdit' })
          ])
      })
  }, [roleId, region, username])
  // 请求地区数据
  useEffect(() => {
    axios.get('http://localhost:5000/regions')
      .then(res => {
        setRegionList([...res.data])
      })
  }, [])
  // 请求角色数据
  useEffect(() => {
    axios.get('http://localhost:5000/roles')
      .then(res => {
        setRoleList([...res.data])
      })
  }, [])

  // 表头设置
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map((dataItem) => {
          return {
            text: dataItem.title,
            value: dataItem.value
          }
        })
        ,
        {
          text: '全球',
          value: '',
        },
      ],
      onFilter: (value, item) => {
        return item.region === value
      },
      render: (region) => {
        return (region === '' ? '全球' : region)
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return (
          <Switch
            disabled={item.default}
            checked={roleState}
            onChange={() => { handelChange(item) }}
          >
          </Switch>
        )
      }
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
              disabled={item.default}
              onClick={() => { showConfirm(item) }}
            ></Button>
            <Button
              shape='circle'
              type='primary'
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => { editUser(item) }}
            ></Button>
          </div>
        )
      }
    }
  ]

  const handelChange = (item) => {
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  // 确认框
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

  // 修改用户信息事件
  const editUser = async (item) => {
    // 此处采用异步是因为，要等这个模态框创建才能进行填充内容
    await setIsUpdateModalOpen(true)
    if (item.roleId === 1) {
      setIsUpdateDisable(true)
    } else {
      setIsUpdateDisable(false)
    }
    // 存储当前item的id值便于后端修改
    setCurrentItem(item)
    updateFormRef.current.setFieldsValue(item)
  }

  // 删除按钮事件
  const deleteData = (item) => {
    const list = dataSource.filter((dataItem) => {
      return dataItem.id !== item.id
    })
    setDataSource(list)
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  // 新增确定按钮事件
  const addOk = () => {
    setIsModalOpen(false)
    addFormRef.current.validateFields()
      .then(res => {
        addFormRef.current.resetFields()
        // console.log(res);
        axios.post('http://localhost:5000/users', {
          ...res,
          "roleState": true,
          "default": false,
        })
          .then(() => {
            axios.get('http://localhost:5000/users?_expand=role')
              .then(res => {
                // console.log(res.data);
                setDataSource(res.data)
              })
          })
      })
      .catch(err => { console.log(err); })
  }

  // 修改确定按钮事件
  const updateOk = () => {
    setIsUpdateModalOpen(false)
    setIsUpdateDisable(!isUpdateDisable)
    updateFormRef.current.validateFields()
      .then(res => {
        updateFormRef.current.resetFields()
        setDataSource(dataSource.map((dataItem) => {
          if (dataItem.id === currentItem.id) {
            return {
              ...dataItem,
              ...res,
              role: roleList.filter(dataItem => dataItem.id === res.roleId)[0]
            }
          } else {
            return dataItem
          }
        }))
        axios.patch(`http://localhost:5000/users/${currentItem.id}`, {
          ...res,
          "roleState": true,
          "default": false,
        })
      })
      .catch(err => { console.log(err); })

  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => { setIsModalOpen(true) }}
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.id}
        pagination={{ pageSize: 6 }}
      ></Table>
      <Modal
        open={isModalOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { setIsModalOpen(false) }}
        onOk={() => { addOk() }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addFormRef}
        ></UserForm>
      </Modal>
      <Modal
        open={isUpdateModalOpen}
        title="更新用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateModalOpen(false)
          setIsUpdateDisable(!isUpdateDisable)
        }}
        onOk={() => { updateOk() }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateFormRef}
          isUpdateDisable={isUpdateDisable}
          isUpdate={true}
        ></UserForm>
      </Modal>
    </div>
  )
}

