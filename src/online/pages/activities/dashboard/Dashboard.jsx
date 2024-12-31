import React from 'react';
import { Grid, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useQuery } from '@apollo/client';
import { ViewList, ViewQuilt } from '@mui/icons-material';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import DashboardFilter from './DashboardFilter';
import { GET_DASHBOARD_ACTIVITY } from '../../../../_shared/graphql/queries/DashboardQueries';
import DashboardGraph from './DashboardGraph';
import DashboardTable from './DashboardTable';
import SynthesisTable from './SynthesisTable';
import ActivityTable from './ActivityTable';

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
  const [view, setView] = React.useState('table');

  const handleChange = (event, nextView) => {
    if(nextView) setView(nextView);
  };
  return (
    <>
      {loadingDashboardActivity && <ProgressService type="dashboard" />}
      {!loadingDashboardActivity && (<>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <DashboardFilter onFilterChange={handleFilterChange} />
            </Grid>
            <Grid item xs={12}>
              <Stack justifyContent="flex-end">
                <ToggleButtonGroup
                  size="small"
                  value={view}
                  exclusive
                  onChange={handleChange}
                  sx={{justifyContent:"flex-end"}}
                > 
                  <Tooltip title="Les graphes" >
                    <ToggleButton value="graph" aria-label="quilt">
                      <ViewQuilt />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="Les tableaux" >
                    <ToggleButton value="table" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="La synthese" >
                    <ToggleButton value="synthesis" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title="L'activité" >
                    <ToggleButton value="activity" aria-label="list">
                      <ViewList />
                    </ToggleButton>
                  </Tooltip>
                </ToggleButtonGroup>
              </Stack>
            </Grid>
          </Grid>
          {view==='graph' && <DashboardGraph activityTracking={dashboardActivityData?.dashboardActivity?.activityTracking}/>}
          {view==='table' && <DashboardTable activityTrackingEstablishments={dashboardActivityData?.dashboardActivity?.activityTrackingEstablishments}/>}
          {view==='synthesis' && <SynthesisTable activitySynthesis={dashboardActivityData?.dashboardActivity?.activitySynthesis}/>}
          {view==='activity' && <ActivityTable activitySynthesis={dashboardActivityData?.dashboardActivity?.activitySynthesis}/>}
        </>
      )}
    </>
  );
}
