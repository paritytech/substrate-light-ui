/// <reference types="react" />
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs';

export declare type RouteProps = {
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
