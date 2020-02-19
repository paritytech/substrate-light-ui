// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface YayNayProps {
  yay: number;
  nay: number;
  height?: number;
  width?: number;
}

export const YayNay = (props: YayNayProps): React.ReactElement => {
  const { yay, nay, height, width } = props;

  const data = [
    {
      name: 'yay',
      yay: yay,
    },
    {
      name: 'nay',
      nay: nay,
    },
  ];

  return (
    <ResponsiveContainer height={height || 100} width={width || '100%'}>
      <BarChart
        data={data}
        margin={{ top: 0, right: 40, left: 40, bottom: 20 }}
        layout='vertical'
        barCategoryGap='0'
        barGap={1}
        maxBarSize={25}
      >
        <CartesianGrid horizontal={false} stroke='#a0a0a0' strokeWidth={0.5} />
        <Tooltip />
        <XAxis type='number' axisLine={false} stroke='#a0a0a0' />
        <YAxis type='category' dataKey={'name'} width={40} />
        <Bar
          animationDuration={1000}
          barSize={25}
          dataKey='yay'
          fill='#5c53fc'
          label={{ position: 'right' }}
        />
        <Bar
          animationDuration={1000}
          barSize={25}
          dataKey='nay'
          fill='#ff5d3e'
          label={{ position: 'right' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
