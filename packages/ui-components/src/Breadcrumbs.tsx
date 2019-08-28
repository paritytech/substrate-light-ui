// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIBreadcrumb from 'semantic-ui-react/dist/commonjs/collections/Breadcrumb/Breadcrumb';

import { substrateLightTheme } from './globalStyle';
import { Circle, FadedText, Margin, Stacked, StackedHorizontal } from './index';

interface BreadcrumbProps {
  activeLabel: string;
  sectionLabels: Array<string>;
}

export function Breadcrumbs (props: BreadcrumbProps) {
  const { activeLabel, sectionLabels } = props;

  return (
    <SUIBreadcrumb>
      <StackedHorizontal>
      {
        sectionLabels.map((label, idx) => {
          const active = activeLabel === label;
          return (
            <Margin left='big'>
              <SUIBreadcrumb.Section active={active}>
                <Stacked>
                  <Circle fill={substrateLightTheme.lightBlue1} label={idx.toString()} radius={32} withShadow={active}/>
                  <Margin top />
                  <FadedText>{label}</FadedText>
                </Stacked>
              </SUIBreadcrumb.Section>
            </Margin>
          );
        })
      }
      </StackedHorizontal>
    </SUIBreadcrumb>
  );
}
