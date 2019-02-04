// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable'; // TODO Remove this once https://github.com/acdlite/recompose/pull/660 is merged

import * as React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';
import { of } from 'rxjs';
import { toClass } from 'recompose';

import { withOneObservable, withMultiObservables } from './multi';

Enzyme.configure({ adapter: new Adapter() });
const { mount } = Enzyme;

const MockComponent = toClass(props => <div>{JSON.stringify(props)}</div>);
const mockRxFn$ = () => of('bar');

describe('withOneObservable', () => {
  test('it should return a HOC', () => {
    expect(typeof withOneObservable('foo', () => of('bar'))).toBe('function');
  });

  test('it should give the wrapped component the correct props', () => {
    const EnhancedComponent = withOneObservable('foo', mockRxFn$)(MockComponent);
    const wrapper = mount(<EnhancedComponent />);
    const div = wrapper.find('div');

    expect(div.text()).toEqual(JSON.stringify({ foo: 'bar' }));
  });
});

describe('withMultiObservables', () => {
  test('it should return a HOC', () => {
    expect(
      typeof withMultiObservables({
        foo: mockRxFn$
      })
    ).toBe('function');
  });

  test('it should give the wrapped component the correct props', () => {
    const EnhancedComponent = withMultiObservables({ foo: mockRxFn$, baz: mockRxFn$ })(
      MockComponent
    );
    const wrapper = mount(<EnhancedComponent />);
    const div = wrapper.find('div');

    expect(div.text()).toEqual(JSON.stringify({ foo: 'bar', baz: 'bar' }));
  });
});
