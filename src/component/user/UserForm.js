import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select

const UserForm = forwardRef((props, ref) => {

    // 区域下拉框是否可以下拉
    const [isDisabled, setIsDisabled] = useState(false)

    const { roleId, region } = JSON.parse(localStorage.getItem('token'));

    const roleObj = {
        '1': 'superAdmin',
        '2': 'regionAdmin',
        '3': 'regionEdit'
    }

    const isRegionDisable = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superAdmin') {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === 'superAdmin') {
                return false
            } else {
                return item.value !== region
            }
        }
    }

    const isRoleDisable = (item)=>{
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superAdmin') {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === 'superAdmin') {
                return false
            } else {
                return roleObj[item.id] !== 'regionEdit'
            }
        }
    }

    useEffect(() => {
        setIsDisabled(props.isUpdateDisable)
    }, [props.isUpdateDisable])

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map((item) => {
                            return (
                                <Option
                                    value={item.value}
                                    key={item.id}
                                    disabled={isRegionDisable(item)}
                                >
                                    {item.title}
                                </Option>)
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map((item) => {
                            return (
                                <Option
                                    value={item.id}
                                    key={item.id}
                                    disabled={isRoleDisable(item)}
                                >
                                    {item.roleName}
                                </Option>)
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})
export default UserForm