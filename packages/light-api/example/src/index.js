import React from 'react';
import ReactDOM from 'react-dom';
import { LightApi } from '@polkadot/light-api';
import { WsProvider } from '@polkadot/rpc-provider';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

const run = async () => {
  const api = await LightApi.create(new WsProvider('ws://localhost:9944')).toPromise();
  api.rpc.chain.subscribeNewHead().subscribe(header => {
    console.log(`Chain is at #${header.blockNumber}`);
  });
  api.query.system.events().subscribe(a => console.log(a.toJSON()));
};

run();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
