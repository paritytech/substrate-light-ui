// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Form } from 'semantic-ui-react';
import SUITextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';

type TextAreaProps = {
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rows?: number;
  value?: string;
};

export function TextArea(props: TextAreaProps): React.ReactElement {
  const { placeholder, rows, value } = props;

  return (
    <Form>
      <SUITextArea
        placeholder={placeholder}
        rows={rows}
        style={{ minHeight: '100px' }}
        value={value}
      />
    </Form>
  );
}
