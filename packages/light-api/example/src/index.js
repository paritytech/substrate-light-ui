import { LightApi } from '@polkadot/light-api';
import { WsProvider } from '@polkadot/rpc-provider';
import React from 'react';
import ReactDOM from 'react-dom';
import { switchMap } from 'rxjs/operators';

import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

const lightApi = new LightApi(new WsProvider('ws://localhost:9944')).isReady;

lightApi
  .pipe(switchMap(api => api.light.newHead()))
  .subscribe(header => console.log('Now at ', header.get('number').toJSON()));

lightApi
  .pipe(switchMap(api => api.light.balanceOf('15jd4tmKwLf1mYWzmZxHeCpT38B2mx1GH6aDniXQxBjskkws')))
  .subscribe(b => console.log('Balance of Alice', b.toString()));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
