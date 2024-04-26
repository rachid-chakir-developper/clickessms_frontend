import React from 'react';
import { Grid, Paper } from '@mui/material';
import AppBarChart from './charts/AppBarChart';
import AppScatterChart from './charts/AppScatterChart';
import AppLineChart from './charts/AppLineChart';
import AppPieChart from './charts/AppPieChart';
import Deposits from './charts/Deposits';
import Tasks from './charts/Tasks';
import AppChart from './charts/AppChart';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD } from '../../../_shared/graphql/queries/DashboardQueries';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';

const FirstItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: 240,
  color: theme.palette.text.secondary,
}));
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  // minHeight: 240,
  color: theme.palette.text.secondary,
}));

export default function Dashboard() {
  const {
    loading: loadingDashboard,
    data: dashboardData,
    error: dashboardError,
  } = useQuery(GET_DASHBOARD, { fetchPolicy: 'network-only' });
  return (
    <>
      {loadingDashboard && <ProgressService type="dashboard" />}
      {!loadingDashboard && (
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={4} lg={4}>
            <Item>
            <Deposits title="Budget récent" data={dashboardData?.dashboard?.budgetMonth} />
            </Item>
          </Grid> */}
          {/* Recent Deposits */}
          {/* <Grid item xs={12} md={4} lg={4}>
            <Item>
              <Deposits data={dashboardData?.dashboard?.spendingsMonth} />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <Deposits title="Revenu récent" data={dashboardData?.dashboard?.revenueMonth} />
            </Item>
          </Grid> */}
          {/* Chart */}
          <Grid item xs={12} md={8} lg={8}>
            <FirstItem>
              <AppChart data={dashboardData?.dashboard?.tasksWeek} />
            </FirstItem>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <AppPieChart data={dashboardData?.dashboard?.taskPercent} />
            </Item>
          </Grid>
          {/* Recent Tasks */}
          <Grid item xs={12}>
            <Item>
              <Tasks tasks={dashboardData?.dashboard?.tasks} />
            </Item>
          </Grid>
          {/* <Grid item xs={12} md={4} lg={4}>
            <Item>
              <AppLineChart />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <AppScatterChart />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <AppBarChart />
            </Item>
          </Grid> */}
        </Grid>
      )}
    </>
  );
}
