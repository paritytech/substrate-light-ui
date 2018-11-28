// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache2.0 license. See the LICENSE file for details.

import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';

type Props = {};

function App (props: Props) {
  return (
    <div className='light-apps--App'>
      Hello World!
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
