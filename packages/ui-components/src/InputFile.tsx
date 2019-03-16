// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Dropzone from 'react-dropzone';

import { ErrorText, FadedText, FileInputArea } from './Shared.styles';

type State = {
  error?: string,
  file?: {
    name: string,
    size: number
  }
};

type Props = {
  accept?: string,
  onChange?: (data: Uint8Array) => void,
  placeholder?: string
};

type LoadEvent = {
  target: {
    result: ArrayBuffer
  }
};

const defaultAccept = ['application/json, text/plain'].join(',');

// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
class InputFile extends React.PureComponent<Props, State> {
  static defaultProps: any;

  state: State = {};

  render () {
    const { error, file } = this.state;
    const { accept, placeholder } = this.props;

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
                !file
                  ? <FadedText>{ placeholder }</FadedText>
                  : <FadedText>{file.name}</FadedText>
              }
              <ErrorText> {error} </ErrorText>
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
        this.onError();
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

  private onError = () => {
    this.setState({ error: 'There was an issue with uploading this file. Please check it and try again.' });
  }
}

InputFile.defaultProps = {
  accept: defaultAccept,
  placeholder: 'Drop file here...'
};

export default InputFile;
