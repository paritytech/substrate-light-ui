// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContentStyles } from './ContentStyles';

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
        <ContentStyles>
          <Component basePath={`/${name}`} />
        </ContentStyles>
      </div>
    );
  }
}

export default withMulti(
  Content,
  withRouter
);
