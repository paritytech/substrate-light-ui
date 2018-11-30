import { Route } from '../types';
import React from 'react';
// import Accounts from '@polkadot/accounts/index';

class Accounts extends React.Component {
  render () {
    return (
      <p> hello </p>
    );
  }
}

export default ({
  Component: Accounts,
  i18n: null,
  icon: 'users',
  isApiGated: false,
  isHidden: false,
  name: 'accounts'
} as Route);
