import { Grid, Box, styled, Paper } from '@mui/material';
import Deposits from './charts/Deposits';
import MixedBarChart from './charts/MixedBarChart';
import SimpleLineChart from './charts/SimpleLineChart';
import SecondSimpleLineChart from './charts/SecondSimpleLineChart';
import { formatCurrencyAmount } from '../../../../_shared/tools/functions';

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

const DashboardGraph = ({ activityTracking }) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} marginTop={2}>
            <Grid item xs={12} md={8} lg={8}>
                <Item>
                <SimpleLineChart data={
                    activityTracking?.activityTrackingMonth.map(item => ({
                        year: item.year,
                        month: item.month,
                        objectiveCount: item.objectiveCount,
                        daysCount: item.daysCount,
                    }))
                    } />
                </Item>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <Item>
                <Deposits title="Objectif (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: activityTracking?.activityTrackingAccumulation?.objectiveCount + ' jour(s)'
                    }} />
                </Item>
                <Item>
                <Deposits title="Nombre de journée (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: activityTracking?.activityTrackingAccumulation?.daysCount + ' jour(s)'
                    }} />
                </Item>
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
                <Item>
                <SecondSimpleLineChart data={
                    activityTracking?.activityTrackingMonth.map(item => ({
                        year: item.year,
                        month: item.month,
                        objectiveOccupancyRate: item.objectiveOccupancyRate,
                        occupancyRate: item.occupancyRate,
                    }))
                    } />
                </Item>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <Item>
                <Deposits title="Objectif Taux d'occupation (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: activityTracking?.activityTrackingAccumulation?.objectiveOccupancyRate + '%'
                    }} />
                </Item>
                <Item>
                <Deposits title="Taux d'occupation (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: activityTracking?.activityTrackingAccumulation?.occupancyRate + '%'
                    }} />
                </Item>
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
                <Item>
                <MixedBarChart data={
                    activityTracking?.activityTrackingMonth.map(item => ({
                        year: item.year,
                        month: item.month,
                        valuation: item.valuation,
                        objectiveValuation: item.objectiveValuation,
                        gapValuation: item.gapValuation,
                    }))
                    } />
                </Item>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <Item>
                <Deposits title="Objectif Valorisation (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: formatCurrencyAmount(activityTracking?.activityTrackingAccumulation?.objectiveValuation)
                    }} />
                </Item>
                <Item>
                <Deposits title="Valorisation (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: formatCurrencyAmount(activityTracking?.activityTrackingAccumulation?.valuation)
                    }} />
                </Item>
                <Item>
                <Deposits title="Valorisation de l'écart (Cumul à fin)" data={{
                    date: activityTracking?.activityTrackingAccumulation?.year,
                    value: formatCurrencyAmount(activityTracking?.activityTrackingAccumulation?.gapValuation)
                    }} />
                </Item>
            </Grid>
        </Grid>
    </Box>
  );
};

export default DashboardGraph;
