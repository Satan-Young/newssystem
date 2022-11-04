/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-11-03 16:08:35
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-03 16:58:26
 * @FilePath: \newssystem2\src\redux\store.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */

// 引入legacy_createStore方法，专门创建redux中最核心的store
import { legacy_createStore ,combineReducers} from "redux";
// 引入reducer
import { collapseReducer } from "./reducers/collapseReducer";

// 将多个reducer合并传给store
// combineReducers传入的对象就是store中对象
const allReducer = combineReducers({
    collapseReducer
})

export const store = legacy_createStore(allReducer)