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

import { TASK_ACTION_RECAP } from '../../../../_shared/graphql/queries/TaskActionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
} from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TaskActionDetails() {
  let { idTaskAction } = useParams();
  const [
    getTaskAction,
    { loading: loadingTaskAction, data: taskActionData, error: taskActionError },
  ] = useLazyQuery(TASK_ACTION_RECAP);
  React.useEffect(() => {
    if (idTaskAction) {
      getTaskAction({ variables: { id: idTaskAction } });
    }
  }, [idTaskAction]);

  if (loadingTaskAction) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <TaskActionMiniInfos taskAction={taskActionData?.taskAction} />
          </Grid>
          <Grid item xs={5}>
            <TaskActionOtherInfos taskAction={taskActionData?.taskAction} />
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
                {taskActionData?.taskAction?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskActionData?.taskAction?.observation}
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

function TaskActionMiniInfos({ taskAction }) {
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
        {taskAction?.image && taskAction?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={taskAction?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{taskAction?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskAction?.name}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(taskAction?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(taskAction?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TaskActionOtherInfos({ taskAction }) {
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
      {taskAction?.bankAccount?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={taskAction?.bankAccount?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}
