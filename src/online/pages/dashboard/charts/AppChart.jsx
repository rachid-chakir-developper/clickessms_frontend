import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

export default function AppChart({ data = [] }) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Nombre des interventions cette semaine</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="day"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Intérventions
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="count"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}