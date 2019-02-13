// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Dropzone from 'react-dropzone';

import { FadedText, FileInputArea } from './Shared.styles';

type State = {
  file?: {
    name: string,
    size: number
  }
};

type Props = {
  accept?: string,
  isDisabled?: boolean,
  isError?: boolean,
  onChange?: (data: Uint8Array) => void,
  placeholder?: string
};

type LoadEvent = {
  target: {
    result: ArrayBuffer
  }
};

const accept = ['application/json, text/plain'].join();

// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
class InputFile extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { file } = this.state;

    return (
      <Dropzone
        accept={accept}
        multiple={false}
        onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <FileInputArea {...getRootProps()}>
              <input {...getInputProps()} />
              {
                !file ?
                  <FadedText>Drop file here...</FadedText> :
                  <FadedText>{file.name}</FadedText>
              }
            </FileInputArea>
          );
        }}
      </Dropzone>
    );
  }

  private onDrop = (files: Array<File>) => {
    const { onChange } = this.props;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => {
        // ignore
      };

      reader.onerror = () => {
        // ignore
      };

      // @ts-ignore
      reader.onload = ({ target: { result } }: LoadEvent) => {
        const data = new Uint8Array(result);

        onChange && onChange(data);

        this.setState({
          file: {
            name: file.name,
            size: data.length
          }
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

export default InputFile;
