import { I18nProps } from '@polkadot/ui-components/';
import './index.css';
import React from 'react';
declare type Props = I18nProps & {
    basePath: string;
};
declare type State = {};
export declare class Governance extends React.PureComponent<Props, State> {
    state: State;
    constructor(props: Props);
    render(): JSX.Element;
}
export {};
