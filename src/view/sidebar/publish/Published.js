/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-24 15:07:30
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-03 10:25:04
 * @FilePath: \newssystem2\src\view\sidebar\publish\Published.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Button } from 'antd'
import NewPublish from '../../../component/publish/NewPublish'
import usePublish from '../../../component/publish/usePublish'

export default function Unpublished() {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const { dataSource, handleOffline } = usePublish(username, 2)
  return (
    <div>
      <NewPublish
        dataSource={dataSource}
        button={
          (id) => { return (<Button danger onClick={() => { handleOffline(id) }} >下架</Button>) }
        }></NewPublish>
    </div>
  )
}
