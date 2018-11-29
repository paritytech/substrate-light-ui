import React from 'react';
import ReactDOM from 'react-dom';
import api from '@polkadot/light-api';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

api.rpc.chain.subscribeNewHead().subscribe(header => {
  console.log(`Chain is at #${header.blockNumber}`);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
