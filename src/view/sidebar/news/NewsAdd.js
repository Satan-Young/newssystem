/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-24 15:05:22
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-10-31 15:00:40
 * @FilePath: \newssystem\src\view\sidebar\news\NewsAdd.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEdit from '../../../component/news/NewsEdit'
const { Step } = Steps
const { Option } = Select

export default function NewsAdd(props) {

  let [currentStep, setCurrentStep] = useState(0)
  let [categories, setCategories] = useState([])
  let [formInfo, setFormInfo] = useState({})
  let [content, setContent] = useState('')

  const User = JSON.parse(localStorage.getItem('token'))

  const formRef = useRef(null)

  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then(res => {
        // console.log(res.data);
        setCategories([...res.data])
      })
  }, [])

  const nextStep = () => {
    if (currentStep === 0) {
      formRef.current.validateFields()
        .then(res => {
          // console.log(res);
          setFormInfo(res)
          setCurrentStep(++currentStep)
        })
        .catch(err => { console.log(err); })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrentStep(++currentStep)
      }
    }
  }

  const preStep = () => {
    setCurrentStep(--currentStep)
  }

  const submit = (auditState) => {
    // console.log('提交审核');
    axios.post('http://localhost:5000/news', {
      ...formInfo,
      "content": content,
      "region": User.region ? User.region : '全球',
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.success({
        message: '通知',
        description:
          `新闻新增成功，你可以在${auditState === 0 ? '草稿箱' : '审核列表'}中查看你新增的新闻`,
      });
    })
  }
  const getContent = (value) => {
    setContent(value)
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
      />
      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      {/* 第一步内容 */}
      <div className={currentStep === 0 ? '' : style.isShow} style={{ marginTop: '20px' }}>
        <Form
          ref={formRef}
          name="basic"
          labelCol={{
            span: 0,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: '新闻标题不能为空!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="新闻类型"
            name="category"
            rules={[
              {
                required: true,
                message: '请选择新闻类型!',
              },
            ]}
          >
            <Select>
              {
                categories.map(dataItem => {
                  return (<Option value={dataItem.value} key={dataItem.value}>{dataItem.title}</Option>)
                })
              }
            </Select>
          </Form.Item>
        </Form>
      </div>

      {/* 第二步内容 */}
      <div className={currentStep === 1 ? '' : style.isShow} style={{ marginTop: '20px' }}>
        <NewsEdit getContent={getContent}></NewsEdit>
      </div>

      <div style={{ marginTop: '20px' }}>
        {
          currentStep < 2 &&
          <span >
            <Button style={{ marginRight: '5px' }} type='primary' onClick={nextStep}>下一步</Button>
          </span>
        }
        {
          currentStep === 2 &&
          <span>
            <Button style={{ marginRight: '5px' }} type='primary' onClick={() => { submit(0) }}>保存草稿</Button>
            <Button style={{ marginRight: '5px' }} type='primary' onClick={() => { submit(1) }} danger>提交审核</Button>
          </span>
        }
        {
          currentStep > 0 &&
          <span>
            <Button style={{ marginRight: '5px' }} type='primary' onClick={preStep}>上一步</Button>
          </span>
        }

      </div>
    </div>
  )
}
