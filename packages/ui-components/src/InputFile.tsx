// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Dropzone from 'react-dropzone';

import Container from './Container';
import { InputArea } from './Shared.styles';

type State = {
  file?: {
    name: string,
    size: number
  }
};

const accept = ['application/json, text/plain'].join();

// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
class InputFile extends React.PureComponent<State> {
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
               <InputArea {...getRootProps()}>
                 <input {...getInputProps()} />
                 {
                   !file ?
                     <p>Drop files here...</p> :
                     <p>{file.name}</p>
                 }
               </InputArea>
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

      // @ts-ignore ummm... events are not properly specified here?
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
