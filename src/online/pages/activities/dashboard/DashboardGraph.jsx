import { Grid, Box, styled, Paper, Typography } from '@mui/material';
import Deposits from './charts/Deposits';
import MixedBarChart from './charts/MixedBarChart';
import SimpleLineChart from './charts/SimpleLineChart';
import SecondSimpleLineChart from './charts/SecondSimpleLineChart';
import { formatCurrencyAmount } from '../../../../_shared/tools/functions';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';

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

const DashboardGraphItem = ({ activityTrackingEstablishment }) => {

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Année : {activityTrackingEstablishment?.year}</Typography>
            {activityTrackingEstablishment?.establishment ? 
                <EstablishmentChip establishment={activityTrackingEstablishment?.establishment} /> 
                : <Typography variant="h6" gutterBottom>{activityTrackingEstablishment?.title}</Typography>}
            <Grid container spacing={3} marginTop={2}>
                <Grid item xs={12} md={8} lg={8}>
                    <Item>
                    <SimpleLineChart data={
                        activityTrackingEstablishment?.activityTrackingMonth.map(item => ({
                            year: item.year,
                            month: item.month,
                            objectiveDaysCount: item.objectiveDaysCount,
                            daysCount: item.daysCount,
                        }))
                        } />
                    </Item>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Item>
                    <Deposits title="Objectif (Cumul à fin)" data={{
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: activityTrackingEstablishment?.activityTrackingAccumulation?.objectiveDaysCount + ' jour(s)'
                        }} />
                    </Item>
                    <Item>
                    <Deposits title="Nombre de journée (Cumul à fin)" data={{
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: activityTrackingEstablishment?.activityTrackingAccumulation?.daysCount + ' jour(s)'
                        }} />
                    </Item>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <Item>
                    <SecondSimpleLineChart data={
                        activityTrackingEstablishment?.activityTrackingMonth.map(item => ({
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
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: activityTrackingEstablishment?.activityTrackingAccumulation?.objectiveOccupancyRate + '%'
                        }} />
                    </Item>
                    <Item>
                    <Deposits title="Taux d'occupation (Cumul à fin)" data={{
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: activityTrackingEstablishment?.activityTrackingAccumulation?.occupancyRate + '%'
                        }} />
                    </Item>
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <Item>
                    <MixedBarChart data={
                        activityTrackingEstablishment?.activityTrackingMonth.map(item => ({
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
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: formatCurrencyAmount(activityTrackingEstablishment?.activityTrackingAccumulation?.objectiveValuation)
                        }} />
                    </Item>
                    <Item>
                    <Deposits title="Valorisation (Cumul à fin)" data={{
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: formatCurrencyAmount(activityTrackingEstablishment?.activityTrackingAccumulation?.valuation)
                        }} />
                    </Item>
                    <Item>
                    <Deposits title="Valorisation de l'écart (Cumul à fin)" data={{
                        date: activityTrackingEstablishment?.activityTrackingAccumulation?.year,
                        value: formatCurrencyAmount(activityTrackingEstablishment?.activityTrackingAccumulation?.gapValuation)
                        }} />
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
  };

const DashboardGraph = ({ activityTrackingEstablishments }) => {

    return (
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            {activityTrackingEstablishments?.map((activityTrackingEstablishment, index) => (
                <Box key={index} sx={{backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#e0e0e0"}}>
                    <DashboardGraphItem activityTrackingEstablishment={activityTrackingEstablishment} />
                </Box>
            ))}
        </Box>
    );
};

export default DashboardGraph;
