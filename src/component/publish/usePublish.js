/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-11-02 17:27:17
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-03 11:04:44
 * @FilePath: \newssystem2\src\component\publish\usePublish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

export default function usePublish(username, type) {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&publishState=${type}&_expend=categories`)
            .then(res => {
                setDataSource(res.data)
            })
    }, [username, type])

    const dataFilter = (id) => {
        setDataSource(dataSource.filter((dataItem) => {
            return dataItem.id !== id
        }))
    }

    const handlePublish = (id) => {
        dataFilter(id)
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            notification.success({
                message: '通知',
                description:
                    `新闻发布成功，你可以在已发布中查看你发布的新闻`,
            });
        })
    }

    const handleOffline = (id) => {
        dataFilter(id)
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.success({
                message: '通知',
                description:
                    `新闻已下架，你可以在已下线中查看你下架的新闻`,
            });
        })
    }

    const handleOnline = (id) => {
        dataFilter(id)
        axios.patch(`http://localhost:5000/news/${id}`, {
            publishState: 1,
        }).then(res => {
            notification.success({
                message: '通知',
                description:
                    `新闻可再次发布，你可以在待发布中查看你可发布的新闻`,
            });
        })
    }

    const handleDelete = (id) => {
        dataFilter(id)
        axios.delete(`http://localhost:5000/news/${id}`).then(res => {
            notification.success({
                message: '通知',
                description:
                    `新闻已删除`,
            });
        })
    }

    return {
        dataSource,
        handleDelete,
        handleOffline,
        handleOnline,
        handlePublish
    }
}