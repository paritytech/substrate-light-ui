// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIAccordion, {
  AccordionProps as SUIAccordionProps,
} from 'semantic-ui-react/dist/commonjs/modules/Accordion';
import styled from 'styled-components';

import { mergeClasses } from './util/tachyons';

interface AccordionProps extends SUIAccordionProps {
  framed?: boolean;
}

const StyledAccordion = styled(SUIAccordion)`
  &&& .title {
    color: inherit !important;
    font-family: inherit !important;
  }
`;

const tachyons = {
  framed: 'ba flex-wrap pa3',
};

export function Accordion(props: AccordionProps): React.ReactElement {
  const { className, framed, ...rest } = props;

  const tachyonsClass = `${framed && tachyons['framed']}`;

  return (
    <div className={mergeClasses(tachyonsClass, className)}>
      <StyledAccordion {...rest} />
    </div>
  );
}

Accordion.Title = SUIAccordion.Title;
Accordion.Content = SUIAccordion.Content;
