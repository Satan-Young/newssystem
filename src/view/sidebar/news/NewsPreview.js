/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-31 16:39:38
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-01 17:34:33
 * @FilePath: \newssystem2\src\view\sidebar\news\NewsPreview.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import moment from 'moment';
import axios from 'axios';

export default function NewsPreview(props) {

    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(`http://localhost:5000/news/${props.match.params.id}?_expend=category&_expend=role`)
            .then(res => {
                setData(res.data)
            })
    }, [props.match.params.id])

    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已发布', '已下架']
    const colorList = ['black', 'orange', 'green', 'red']

    return (
        <div>
            {
                data && (
                    <div>
                        <PageHeader
                            onBack={() => window.history.back()}
                            title={data.title}
                            subTitle={data.category}
                        >
                            <Descriptions size="small" column={3}>
                                <Descriptions.Item label="创建者">{data.author}</Descriptions.Item>
                                <Descriptions.Item label="创建时间">{moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                                <Descriptions.Item label="发布时间">
                                    {data.publishTime === 0 ? '-' : moment(data.publishTime).format('YYYY-MM-DD HH:mm:ss')}
                                </Descriptions.Item>
                                <Descriptions.Item label="区域">{data.region}</Descriptions.Item>
                                <Descriptions.Item label="审核状态">
                                    <span style={{ color: colorList[data.auditState] }}>{auditList[data.auditState]}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="发布状态">
                                    <span style={{ color: colorList[data.publishState] }}>{publishList[data.publishState]}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="访问数量">{data.view}</Descriptions.Item>
                                <Descriptions.Item label="点赞数量">{data.star}</Descriptions.Item>
                                <Descriptions.Item label="评论数量">0</Descriptions.Item>
                            </Descriptions>
                        </PageHeader>
                        <PageHeader
                            title='新闻内容：'
                        ></PageHeader>
                        <div
                            dangerouslySetInnerHTML={{ __html: data.content }}
                            style={{ margin: "0 24px" }}>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
