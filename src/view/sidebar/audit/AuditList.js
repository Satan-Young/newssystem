/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-24 15:06:39
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-02 15:12:09
 * @FilePath: \newssystem2\src\view\sidebar\audit\AuditList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'

export default function AuditList(props) {

  const tagColor = ['', 'orange', 'green', 'red']
  const auditList = ['未审核', '审核中', '已通过', '未通过']

  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expend=category`)
      .then(res => {
        // console.log(res.data);
        setDataSource(res.data)
      })
  }, [username])

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
    title: '状态',
    dataIndex: 'auditState',
    render: (auditState) => {
      return (<Tag color={tagColor[auditState]}>{auditList[auditState]}</Tag>)
    }
  }, {
    title: '操作',
    render: (item) => {
      return (
        <div>
          {
            item.auditState === 1 && (
              <div>
                {/* <Button style={{ marginRight: '10px' }} onClick={() => { handlePass(item) }}>撤销</Button> */}
                <Button danger onClick={() => { handleCancel(item) }}> 撤销</Button>
              </div>
            )
          }

          {
            item.auditState === 2 && (
              <div>
                <Button style={{ marginRight: '10px' }} onClick={() => { handlePublish(item) }}> 发 布</Button>
                {/* <Button type='primary' onClick={() => { handleCancel(item) }}> 重新审核</Button> */}
              </div>
            )
          }
          {
            item.auditState === 3 && (
              <div>
                {/* <Button style={{ marginRight: '10px' }} danger onClick={() => { handlerReturn(item) }}> 退 回</Button> */}
                <Button type='primary' onClick={() => { handelRenew(item) }}> 修改</Button>

              </div>
            )
          }

        </div>
      )
    }
  }
  ]

  // 审核不通过
  // const handleFail = (item) => {
  //   axios.patch(`http://localhost:5000/news/${item.id}`, {
  //     auditState: 3
  //   }).then(() => {
  //     notification.error({
  //       message: '通知',
  //       description:
  //         `该新闻审核未通过`,
  //     });
  //     axios.get(`http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expend=category`)
  //       .then(res => {
  //         // console.log(res.data);
  //         setDataSource(res.data)
  //       })
  //   })
  // }

  // 退回草稿箱
  // const handlerReturn = (item) => {
  //   const list = dataSource.filter((dataItem) => {
  //     return dataItem.id !== item.id
  //   })
  //   setDataSource(list)
  //   axios.patch(`http://localhost:5000/news/${item.id}`, {
  //     auditState: 0
  //   }).then(() => {
  //     notification.success({
  //       message: '通知',
  //       description:
  //         `该新闻已退回草稿箱`,
  //     });
  //     props.history.push('/news-manage/draft')
  //   })
  // }

  // 审核通过
  // const handlePass = (item) => {
  //   axios.patch(`http://localhost:5000/news/${item.id}`, {
  //     auditState: 2
  //   }).then(() => {
  //     notification.success({
  //       message: '通知',
  //       description:
  //         `该新闻已通过审核，可以发布`,
  //     });
  //     axios.get(`http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expend=category`)
  //       .then(res => {
  //         // console.log(res.data);
  //         setDataSource(res.data)
  //       })
  //   })
  // }

  // 修改
  const handelRenew = (item) => {
    setDataSource(dataSource.filter(dataItem => dataItem.id !== item.id))
    axios.patch(`http://localhost:5000/news/${item.id}`, {
      auditState: 0
    }).then(() => {
      notification.success({
        message: '通知',
        description:
          `该新闻可在草稿箱中修改`,
      });
      props.history.push('/news-manage/draft')
    })
  }

  // 发布
  const handlePublish = (item) => {
    console.log(item);
    const list = dataSource.filter((dataItem) => {
      return dataItem.id !== item.id
    })
    setDataSource(list)
    axios.patch(`http://localhost:5000/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      notification.success({
        message: '通知',
        description:
          `你可以在已发布中查看新闻`,
      });
      props.history.push('/publish-manage/published')
    })
  }

  // 撤销审核
  const handleCancel = (item) => {
    setDataSource(dataSource.filter((dataItem) => {
      return dataItem.id !== item.id
    }))
    axios.patch(`http://localhost:5000/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.success({
        message: '通知',
        description:
          `你可以在草稿箱中查看已撤销的新闻`,
      });
    })
  }

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.id} />;
    </div>
  )
}
