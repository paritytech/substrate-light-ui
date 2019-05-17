// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface IProps {
  aye: number;
  nay: number;
  height?: number;
  width?: number;
}

export const AyeNay = (props: IProps) => {
  const { aye, nay, height, width } = props;

  const data = [
    {
      aye,
      nay
    }
  ];

  return (
    <BarChart width={width || 250} height={height || 750} data={data} layout='horizontal'>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis />
      <YAxis dataKey='votes' />
      <Bar dataKey='aye' fill='#8884d8' />
      <Bar dataKey='nay' fill='#82ca9d' />
    </BarChart>
  );
};
