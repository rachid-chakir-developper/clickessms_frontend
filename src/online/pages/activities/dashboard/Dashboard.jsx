import React from 'react';
import { Grid, Paper } from '@mui/material';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/client';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import Deposits from './charts/Deposits';
import MixedBarChart from './charts/MixedBarChart';
import SimpleLineChart from './charts/SimpleLineChart';
import SecondSimpleLineChart from './charts/SecondSimpleLineChart';
import DashboardFilter from './DashboardFilter';
import { GET_DASHBOARD_ACTIVITY } from '../../../../_shared/graphql/queries/DashboardQueries';

const FirstItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  // height: 240,
  color: theme.palette.text.secondary,
}));
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  // minHeight: 240,
  color: theme.palette.text.secondary,
}));

export default function Dashboard() {
  const [employeeFilter, setDashboardFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setDashboardFilter(newFilter);
  };
  const {
    loading: loadingDashboardActivity,
    data: dashboardActivityData,
    error: dashboardActivityError,
  } = useQuery(GET_DASHBOARD_ACTIVITY, { fetchPolicy: 'network-only' });

  React.useEffect(() => {
    
  }, [employeeFilter]);
  return (
    <>
      {loadingDashboardActivity && <ProgressService type="dashboard" />}
      {!loadingDashboardActivity && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardFilter onFilterChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Item>
              <SecondSimpleLineChart />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <Deposits title="Valorisation (Cumul à fin)" data={dashboardActivityData?.dashboardActivity?.budgetMonth} />
            </Item>
            <Item>
              <Deposits title="Valorisation de l'écart (Cumul à fin)" data={dashboardActivityData?.dashboardActivity?.budgetMonth} />
            </Item>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Item>
              <SimpleLineChart />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <Deposits title="Valorisation (Cumul à fin)" data={dashboardActivityData?.dashboardActivity?.budgetMonth} />
            </Item>
            <Item>
              <Deposits title="Valorisation de l'écart (Cumul à fin)" data={dashboardActivityData?.dashboardActivity?.budgetMonth} />
            </Item>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Item>
              <MixedBarChart />
            </Item>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Item>
              <Deposits title="Valorisation (Cumul à fin)" data={dashboardActivityData?.dashboardActivity?.budgetMonth} />
            </Item>
            <Item>
              <Deposits title="Valorisation de l'écart (Cumul à fin)" data={dashboardActivityData?.dashboardActivity?.budgetMonth} />
            </Item>
          </Grid>
        </Grid>
      )}
    </>
  );
}
