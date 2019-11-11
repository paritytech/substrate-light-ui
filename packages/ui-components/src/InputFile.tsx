// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';
import styled from 'styled-components';

type Props = {
  onChange?: (data: string | null) => void;
};

const defaultAccept = ['application/json, text/plain'].join(',');

const getColor = (props: Partial<DropzoneState>): string => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const Container = styled<any>('div')`
  align-items: center;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props): string => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  display: flex;
  flex: 1;
  flex-direction: column;
  outline: none;
  padding: 100px;
  transition: border .24s ease-in-out;
`;

export function InputFile (props: Props): React.ReactElement {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const reader = new FileReader();

    reader.onabort = (): void => console.log('file reading was aborted');
    reader.onerror = (): void => console.log('file reading has failed');
    reader.onload = (): void => {
      props.onChange && props.onChange(reader.result as string);
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  }, [props]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: defaultAccept, onDrop });

  return (
    <div className='container'>
      <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </Container>
    </div>
  );
}
