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

//binds axios and lodash to window in development
if (process.env.NODE_ENV === 'development') {
    window.axios = axios;
    window._ = _;
}

//disables console.log in production
if (process.env.NODE_ENV === 'production') {
    window.console.log = function() {}
}

let middleware = [reduxThunk];

//adds redux logger to middleware in development 
if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
}

const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
