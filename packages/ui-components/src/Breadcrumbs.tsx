// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIBreadcrumb, {
  BreadcrumbProps,
} from 'semantic-ui-react/dist/commonjs/collections/Breadcrumb/Breadcrumb';

import { substrateLightTheme } from './globalStyle';
import { Circle, Margin, Paragraph } from './index';
import { Layout } from './Layout';
import { SUIBreadcrumbSize } from './types';

interface Props {
  activeLabel: string;
  onClick?: (
    event: React.MouseEvent<HTMLElement>,
    data: BreadcrumbProps
  ) => void;
  sectionLabels: Array<string>;
  size?: SUIBreadcrumbSize;
}

export function Breadcrumbs(props: BreadcrumbProps): React.ReactElement {
  const { activeLabel, onClick, sectionLabels, size } = props;

  return (
    <SUIBreadcrumb size={size}>
      <Layout>
        {sectionLabels.map((label: string, idx: string) => {
          const active = activeLabel === label;
          return (
            <Margin key={label} left='big'>
              <SUIBreadcrumb.Section active={active} onClick={onClick}>
                <Layout className='flex-column w3 mh3'>
                  <Circle
                    fill={substrateLightTheme.lightBlue1}
                    label={idx.toString()}
                    radius={32}
                    withShadow={active}
                  />
                  <Margin top />
                  <Paragraph faded>{label}</Paragraph>
                </Layout>
              </SUIBreadcrumb.Section>
            </Margin>
          );
        })}
      </Layout>
    </SUIBreadcrumb>
  );
}
