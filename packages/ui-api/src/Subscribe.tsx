import React, { ReactNode } from 'react';
import { Observable, Subscription } from 'rxjs';

interface State {
  node: ReactNode;
}

const ERROR_NOT_AN_OBSERVABLE = '<Subscribe> only accepts a single child, an Observable that conforms to observable[Symbol.observable]()';

function childrenToObservable (children: any) {
  if (Symbol.observable in children === false) {
    throw new TypeError(ERROR_NOT_AN_OBSERVABLE);
  }

  return children[Symbol.observable]() as Observable<ReactNode>;
}

// Inspired from https://github.com/jayphelps/react-observable-subscribe/blob/master/src/index.js
export class Subscribe extends React.Component<{}, State> {
  state = {
    node: null
  };

  subscription = Subscription.EMPTY;

  setupSubscription () {
    const { children } = this.props;
    if (children !== undefined && children !== null) {
      // Observables may be scheduled async or sync, so this subscribe callback
      // might immediately run or it it might not.
      this.subscription = childrenToObservable(children).subscribe(node => {
        this.setState({ node });
      });
    }
  }

  teardownSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  componentDidMount () {
    this.setupSubscription();
  }

  componentWillReceiveProps (nextProps: any) {
    if (nextProps.children !== this.props.children) {
      this.teardownSubscription();
      this.setupSubscription();
    }
  }

  componentWillUmount () {
    this.teardownSubscription();
  }

  render () {
    return this.state.node;
  }
}
