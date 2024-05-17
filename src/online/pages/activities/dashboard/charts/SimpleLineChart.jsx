import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const uData = [89.25, 75.5, 95.8, 100, 88.4, 70, 82.4];
const pData = [95, 95, 95, 95, 95, 95, 95, 90, 90, 90, 90];
const xLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function SimpleLineChart() {
    const valueFormatter = (value)=> `${value}%`;
  return (
    <LineChart
      height={240}
      margin={{ right: 5, left: 100 }}
      sx={
          {
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                // Move the y-axis label with CSS
                transform: 'translateX(-35px)',
              },
          }
        }
      series={[
        { data: pData, label: 'Objectif TO', valueFormatter },
        { data: uData, label: "Taux d'occupation", valueFormatter },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{label: "Taux d'occupation(%)", valueFormatter}]}
    />
  );
}
