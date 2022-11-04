/*
 * @Author: SatanYoung amgyjl0926@163.com
 * @Date: 2022-10-10 10:18:07
 * @LastEditors: SatanYoung amgyjl0926@163.com
 * @LastEditTime: 2022-11-03 16:57:04
 * @FilePath: \newssystem2\src\App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { Fragment } from 'react';
import { Provider } from 'react-redux'
import IndexRouter from './router';
import {store} from './redux/store'
import './App.css'

function App() {
  return (
    <Fragment>
      <Provider store={store}>
        <IndexRouter></IndexRouter>
      </Provider>
    </Fragment>
  );
}

export default App;
