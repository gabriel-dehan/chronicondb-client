
import React from 'react';
import ReactDOM from 'react-dom';

import { configure } from 'mobx';

import App from 'pages/App';

import reportWebVitals from './reportWebVitals';

import 'assets/styles/fonts.css';
import 'assets/styles/variables.css';
import 'assets/styles/global.css';
import 'rc-drawer/assets/index.css';

// Mobx : all state that is observed somewhere needs to be changed through actions
configure({ enforceActions: 'observed' });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
