import React from 'react';
import { Box, Button, Grid, Paper, Stack } from '@mui/material';
import AppPieChart from './charts/AppPieChart';
import Tasks from './charts/Tasks';
import AppChart from './charts/AppChart';
import styled from '@emotion/styled';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD } from '../../../_shared/graphql/queries/DashboardQueries';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import LeaveDayInfos from './charts/LeaveDayInfos';
import TaskActions from './charts/TaskActions';
import UndesirableEvents from './charts/UndesirableEvents';
import { Link } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { useAuthorizationSystem } from '../../../_shared/context/AuthorizationSystemProvider';

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

export default function Dashboard(){
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const canManageFacility = authorizationSystem.requestAuthorization({
    type: 'manageFacility',
  }).authorized;
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
          <Stack
                direction="row"
                justifyContent="center"
                flexWrap="wrap"
                spacing={3} // Espacement global
                rowGap={3}  // Espacement vertical entre les lignes
                columnGap={3} // Espacement horizontal entre les colonnes
              >
              <Link
                to="/online/qualites/evenements-indesirables/ajouter"
                className="no_style"
              >
                <Button variant="outlined" endIcon={<Add />}>
                  Ajouter un événement indésirable
                </Button>
              </Link>
              <Link
                to="/online/travaux/actions/ajouter"
                className="no_style"
              >
                <Button variant="outlined" endIcon={<Add />}>
                  Ajouter une action
                </Button>
              </Link>
              {/* {!canManageFinance && <Link
                  to="/online/achats/depenses-engagements/ajouter?type=REQUEST"
                  className="no_style"
                >
                  <Button variant="outlined" endIcon={<Add />}
                  sx={{ mx: 3 }}>
                    Demander une dépense
                  </Button>
                </Link>}
                {
                canManageFinance && <Link to="/online/achats/depenses-engagements/ajouter" className="no_style">
                  <Button variant="outlined" endIcon={<Add />}>
                    Ajouter une dépense
                  </Button>
                </Link>} */}
                <Link
                    to="/online/planning/absences-employes/ajouter?type=LEAVE"
                    className="no_style"
                  >
                    <Button variant="outlined" endIcon={<Add />}
                    sx={{ mx: 3 }}>
                      Demander un congé
                    </Button>
                  </Link>
                  <Link
                      to="/online/planning/absences-employes/ajouter"
                      className="no_style"
                    >
                      <Button variant="outlined" endIcon={<Add />}>
                        Déclarer une absence
                      </Button>
                    </Link>
                {!canManageFacility && <Link
                  to="/online/travaux/interventions/ajouter?type=REQUEST"
                  className="no_style"
                >
                  <Button variant="outlined" endIcon={<Add />}
                  sx={{ mx: 3 }}>
                    Demander une intervention
                  </Button>
                </Link>}
                {
                canManageFacility && <Link to="/online/travaux/interventions/ajouter" className="no_style">
                  <Button variant="outlined" endIcon={<Add />}>
                    Ajouter une intervention
                  </Button>
                </Link>}
            </Stack>
            {/* <FirstItem>
              <AppChart data={dashboardData?.dashboard?.undesirableEventsWeek} />
            </FirstItem> */}
          </Grid>
          {<Grid item xs={12} md={4} lg={4}>
            <Item>
              <LeaveDayInfos leaveDayInfos={dashboardData?.dashboard?.currentEmployee?.currentContract?.leaveDayInfos} />
            </Item>
          </Grid>}
          {/* <Grid item xs={12} md={4} lg={4}>
            <Item>
              <AppPieChart data={dashboardData?.dashboard?.taskPercent} />
            </Item>
          </Grid> */}
          {/* Recent Tasks */}
          <Grid item xs={12}>
            <UndesirableEvents undesirableEvents={dashboardData?.dashboard?.undesirableEvents} />
          </Grid>
          <Grid item xs={12}>
            <TaskActions taskActions={dashboardData?.dashboard?.taskActions} />
          </Grid>
          <Grid item xs={12}>
            <Tasks tasks={dashboardData?.dashboard?.tasks} />
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
