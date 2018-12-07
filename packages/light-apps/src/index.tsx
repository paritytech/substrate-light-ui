// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import './index.css';

import { createGlobalStyle } from 'styled-components';
import { createApp, settings } from '@polkadot/ui-components';

import * as serviceWorker from './serviceWorker';
import SideBar from './SideBar/index';

type Props = {};

function App (props: Props) {
  return (
    <div className={'apps--App'}>
      <SideBar />
    </div>
  );
}

const url = !settings.apiUrl
  ? undefined
  : settings.apiUrl;

createApp(App, { url });

createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
  }

  #root {
    color: #4e4e4e;
    font-family: sans-serif;
    height: 100%;
  }

  h1, h2, h3, h4, h5 {
    color: rgba(0, 0, 0, .6);
    font-weight: 100;
  }

  h1 {
    text-transform: lowercase;
  }

  h3, h4, h5 {
    margin-bottom: 0.25rem;
  }

  main {
    padding: 1em 2em;
    min-height: 100vh;
  }

  main > section {
    margin-bottom: 2em;
  }

  article {
    background: white;
    border: 1px solid #f2f2f2;
    border-left-width: 0.25rem;
    border-radius: 0.25rem;
    margin: 0.5rem;
    padding: 1rem 1.5rem;

    &.error {
      background: #fff6f6;
      border-color: #e0b4b4;
      color: #9f3a38;
    }

    &.warning {
      background: #ffffe0;
      border-color: #eeeeae;
    }
  }

  header,
  summary {
    margin-bottom: 2em;
    text-align: center;
  }

  header+header,
  header+summary,
  summary+header {
    margin-top: -1em;
  }

  summary {
    align-items: stretch;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  summary article {
    color: rgba(0, 0, 0, 0.6);
    flex: 0 1 auto;
    text-align: left;
  }

  summary > section {
    display: flex;
    flex: 0 1 auto;
    text-align: left;
  }

  .apps--App {
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    min-height: 100vh;

    .apps--Content,
    .apps--SideBar {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .apps--Content {
      background: #fafafa;
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
`;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
