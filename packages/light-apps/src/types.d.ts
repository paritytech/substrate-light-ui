/// <reference types="react" />
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs';
import { BareProps } from '@polkadot/ui-components';
export declare type RouteProps = BareProps & {
    basePath: string;
};
export declare type Route = {
    Component: React.ComponentType<any>;
    i18n: any;
    icon: SemanticICONS;
    isApiGated: boolean;
    isHidden: boolean;
    name: string;
};
export declare type Routes = Array<Route | null>;
export declare type Routing = {
    default: string;
    routes: Routes;
};
