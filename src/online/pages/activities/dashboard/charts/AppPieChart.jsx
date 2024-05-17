import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Title from './Title';

const size = {
  width: 400,
  height: 200,
};

export default function AppPieChart({ data = [] }) {
  return (
    <>
      <Title>EI & EIG</Title>
      <PieChart
        series={[
          {
            data: data,
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -180,
            endAngle: 180,
            arcLabel: (item) => `${item.label} (${item.value})`,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontWeight: 'bold',
          },
        }}
        {...size}
      />
    </>
  );
}
