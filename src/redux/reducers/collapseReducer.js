/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-11-03 16:14:52
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-04 14:42:48
 * @FilePath: \newssystem2\src\redux\reducers\collapseReducer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const collapseReducer = (preState = { isCollapse: false }, action) => {
    const { type } = action
    switch (type) {
        case 'changeCollapse':
            const newState = {...preState}
            newState.isCollapse = ! newState.isCollapse
            return newState
        default:
            return preState
    }
}