// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

interface IProps {
  aye: number;
  nay: number;
  height?: number;
  width?: number;
}

export const YayNay = (props: IProps) => {
  const { aye, nay, height, width } = props;

  const data = [
    {
      name: 'votes',
      aye: aye,
      nay: nay
    }
  ];

  // FIXME: layout: horizontal doesn't work properly for some reason...
  return (
    <BarChart barCategoryGap={0} width={width || 150} height={height || 150} data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Bar dataKey='aye' fill='#8884d8' />
      <Bar dataKey='nay' fill='#82ca9d' />
    </BarChart>
  );
};
