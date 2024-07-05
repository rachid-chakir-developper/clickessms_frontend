import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
} from '@mui/material';

import { EMPLOYEE_GROUP_RECAP } from '../../../../../_shared/graphql/queries/EmployeeGroupQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';
import EmployeeItemCard from '../../../human_ressources/employees/EmployeeItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EmployeeGroupDetails() {
  let { idEmployeeGroup } = useParams();
  const [
    getEmployeeGroup,
    {
      loading: loadingEmployeeGroup,
      data: employeeGroupData,
      error: employeeGroupError,
    },
  ] = useLazyQuery(EMPLOYEE_GROUP_RECAP);
  React.useEffect(() => {
    if (idEmployeeGroup) {
      getEmployeeGroup({ variables: { id: idEmployeeGroup } });
    }
  }, [idEmployeeGroup]);

  if (loadingEmployeeGroup) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <EmployeeGroupMiniInfos
              employeeGroup={employeeGroupData?.employeeGroup}
            />
          </Grid>
          <Grid item xs={5}>
            <EmployeeGroupOtherInfos
              employeeGroup={employeeGroupData?.employeeGroup}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeGroupData?.employeeGroup?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeGroupData?.employeeGroup?.observation}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function EmployeeGroupMiniInfos({ employeeGroup }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        //maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        {employeeGroup?.image && employeeGroup?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={employeeGroup?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{employeeGroup?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {employeeGroup?.name}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(employeeGroup?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(employeeGroup?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(employeeGroup?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(employeeGroup?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function EmployeeGroupOtherInfos({ employeeGroup }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Typography gutterBottom variant="subtitle3" component="h3">
        Les employés
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {employeeGroup?.employees?.map((employee, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Item>
              <EmployeeItemCard employee={employee?.employee} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
