// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIBreadcrumb, {
  BreadcrumbProps,
} from 'semantic-ui-react/dist/commonjs/collections/Breadcrumb/Breadcrumb';
import styled from 'styled-components';

import { Circle, Paragraph } from './index';
import { Layout } from './Layout';
import { extractClasses, mergeClasses } from './util/tachyons';

const StyledBreadcrumb = styled(SUIBreadcrumb)`
  a {
    color: inherit !important;
  }
  a p {
    font-family: inherit !important;
  }
`;

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  always: 'bg-transparent',
  default: 'w-100 code black',
  circle: {
    default: 'bg-black white',
  },
};

export function Breadcrumbs(props: BreadcrumbProps): React.ReactElement {
  const { activeLabel, className, onClick, sectionLabels } = props;

  const tachyonsClass = `${mergeClasses(
    mergeClasses(tachyons['default'], className),
    tachyons['always']
  )}`;
  const tachyonsClassParagraph = `${extractClasses(className, 'f0')} pt2`;
  const tachyonsClassCircle = `${mergeClasses(
    tachyons.circle['default'],
    extractClasses(className, 'bg-red')
  )}`;

  return (
    <StyledBreadcrumb className={tachyonsClass}>
      <Layout>
        {sectionLabels.map((label: string, idx: string) => {
          const active = activeLabel === label;
          return (
            <>
              <StyledBreadcrumb.Section
                active={active}
                onClick={onClick}
                className='flex w-100'
              >
                <Layout className='flex-column'>
                  <Circle
                    label={idx.toString()}
                    radius={32}
                    withShadow={active}
                    className={tachyonsClassCircle}
                  />
                  <Paragraph faded={!active} className={tachyonsClassParagraph}>
                    {label}
                  </Paragraph>
                </Layout>
              </StyledBreadcrumb.Section>
            </>
          );
        })}
      </Layout>
    </StyledBreadcrumb>
  );
}
