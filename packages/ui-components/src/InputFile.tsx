// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import { ErrorText, FadedText } from './Shared.styles';

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

const FileInputArea = styled.div`
  background-color: ${props => props.theme.white};
  box-shadow: 0 2px 4px 0 ${props => props.theme.black}, 0.5);
  height: '100%';
  text-align: center;
  width: '50%';
`;

// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
export class InputFile extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    accept: defaultAccept,
    placeholder: 'Drop file here...'
  };

  state: State = {};

  render () {
    const { error, file } = this.state;
    const { accept, placeholder } = this.props;

    return (
      <FileInputArea>
        <Dropzone
          accept={accept}
          multiple={false}
          onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                  !file
                    ? <FadedText>{placeholder}</FadedText>
                    : <FadedText>{file.name}</FadedText>
                }
                <ErrorText> {error} </ErrorText>
              </div>
            );
          }}
        </Dropzone>
      </FileInputArea>
    );
  }

  onDrop = (files: Array<File>) => {
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

  onError = () => {
    this.setState({ error: 'There was an issue with uploading this file. Please check it and try again.' });
  }
}
