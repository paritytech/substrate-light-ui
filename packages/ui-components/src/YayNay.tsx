// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, ToolTip, XAxis, YAxis } from 'recharts';

interface IProps {
  yay: number;
  nay: number;
  height?: number;
  width?: number;
}

export const YayNay = (props: IProps) => {
  const { yay, nay, height, width } = props;

  const data = [
    {
      name: 'yay',
      yay: yay
    },
    {
      name: 'nay',
      nay: nay
    }
  ];

  return (
    <ResponsiveContainer height={height || 100} width={width || 200}>
      <BarChart
        data={data}
        margin={{ top: 0, right: 40, left: 40, bottom: 20 }}
        layout='vertical'
        barCategoryGap='20%'
        barGap={2}
        maxBarSize={10}
      >
        <CartesianGrid horizontal={false} stroke='#a0a0a0' strokeWidth={0.5} />
        <ToolTip />
        <XAxis
          type='number'
          axisLine={false}
          stroke='#a0a0a0'
        />
        <YAxis type='category' dataKey={'name'} width={40} />
        <Bar
          animationDuration={1000}
          dataKey='yay' fill='#5c53fc'
          label={{ position: 'right', backgroundColor: '#fff' }} />
        <Bar
          animationDuration={1000}
          dataKey='nay' fill='#5c53fc'
          label={{ position: 'right', backgroundColor: '#fff' }} />
      </BarChart>
    </ResponsiveContainer>
  );
};
