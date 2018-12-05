import { I18nProps } from '@polkadot/ui-components/';
import './index.css';
import React from 'react';
declare type Props = I18nProps & {
    basePath: string;
};
declare type State = {
    hidden: Array<string>;
    items: Array<string>;
};
export declare class AccountManagement extends React.PureComponent<Props, State> {
    state: State;
    constructor(props: Props);
    render(): JSX.Element;
}
export {};
