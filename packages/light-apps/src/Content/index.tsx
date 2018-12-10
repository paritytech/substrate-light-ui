// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// import { I18nProps } from '@polkadot/ui-app/types';
// import { ApiProps } from '@polkadot/ui-react-rx/types';

import './Content.css';

import React from 'react';
import { withRouter } from 'react-router';
import { BareProps } from '@polkadot/ui-components';

import { withMulti } from '../utils/withMulti';
import routing from '../routing';
// import translate from '../translate';
import NotFound from './NotFound';

type Props = BareProps & {
  location: Location
};

const unknown = {
  Component: NotFound,
  name: ''
};

class Content extends React.Component<Props> {
  constructor (props: Props) {
    super(props);
  }

  render () {
    const { location } = this.props;

    const app = location.pathname.slice(1) || '';
    const { Component, name } = routing.routes.find((route) =>
      !!(route && app.indexOf(route.name) === 0)
    ) || unknown;

    return (
      <div className='apps--Content'>
        <Component basePath={`/${name}`} />
      </div>
    );
  }
}

export default withMulti(
  Content,
  withRouter
);
