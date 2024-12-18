import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const pData = [2000, 4000, 3000, 2000, 2000, 2000, 2000];
const amtData = [2500, 4500, 3500, 1500, 2500, 2500, 2500];
const uData = [-500, -500, -500, 500, -500, -500, -500];

const xLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function MixedBarChart({data=[]}) {
    const valueFormatter = (value)=> `${value}€`;
    return (
        <BarChart
            height={240}
            margin={{ right: 5, bottom: 60, left: 100 }}
            sx={
                {
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                    // Move the y-axis label with CSS
                    transform: 'translateX(-35px)',
                    },
                }
            }
            series={[
                { data: data.map(d=>d.objectiveValuation), label: 'Objectif', stack: 'stack1', valueFormatter  },
                { data: data.map(d=>d.valuation), label: 'Valorisation', stack: 'stack2', valueFormatter },
                { data: data.map(d=>d.gapValuation), label: "Valorisation de l'écart", stack: 'stack2', valueFormatter },
            ]}
            xAxis={[{ data: data.map(d=>d.month), scaleType:  'band', dataKey: 'month', label: data[0]?.year }]}
            yAxis={[{label: 'Valorisation(€)', valueFormatter}]}
            grid={{ vertical: true, horizontal: true }}
        />
    );
}

