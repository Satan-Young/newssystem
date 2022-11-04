/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-11-02 17:07:42
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-03 10:23:38
 * @FilePath: \newssystem2\src\component\publish\NewPublish.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Table} from 'antd'
import React from 'react'
import useCategory from './useCategory';

export default function NewPublish(props) {
    const categories = useCategory()
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'categoryId',
            render: (categoryId, item) => {
                return (categoryId ?
                    (<div>{categories[categoryId-1].title}</div>) :
                    (<div>{item.category}</div>))
            }
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        {props.button(item.id)}
                    </div>
                )
            }
        }
    ]
    return (
        <div>
            <Table
                dataSource={props.dataSource}
                columns={columns}
                rowKey={item => item.id}
                pagination={{ pageSize: 5 }}></Table>
        </div>
    )
}
