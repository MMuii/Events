import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import './sass/main.scss';
import App from './components/App';
import reducers from './reducers';
import axios from 'axios';
import _ from 'lodash';

// import { browserHistory } from 'react-router-dom';
// import { syncHistoryWithStore } from 'react-router-redux';

window.axios = axios;
window._ = _;

// const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(reduxThunk, logger)
    // other store enhancers if any
  ));

// export const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// console.log('our environment is', process.env.NODE_ENV);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
