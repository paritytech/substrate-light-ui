// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Bar } from 'react-chartjs-2';

interface IProps {
  aye: number;
  nay: number;
  height?: number;
  width?: number;
}

export const AyeNay = (props: IProps) => {
  const { aye, nay, height, width } = props;

  const data = {
    labels: ['Aye', 'Nay'],
    datasets: [
      {
        label: 'Votes',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [aye, nay]
      }
    ]
  };

  return (
    <Bar
      data={data}
      height={height || 150}
      width={width || 300}
      type='horizontalBar'
    />
  );
};
