import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// Global style
import GlobalStyle from './GlobalStyle';
// Components
import App from './App';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <GlobalStyle />
    <App />
  </Router>,
  document.getElementById('app')
);
