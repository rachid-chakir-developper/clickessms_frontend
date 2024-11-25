import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Button,
  Stack,
} from '@mui/material';

import { TASK_ACTION_RECAP } from '../../../../_shared/graphql/queries/TaskActionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
  getFormatDate,
} from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import { Edit } from '@mui/icons-material';
import TaskActionStatusLabelMenu from './TaskActionStatusLabelMenu';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import TaskActionTabs from './actions-tabs/TaskActionTabs';

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
        
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/travaux/actions/modifier/${taskActionData?.taskAction?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
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
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskActionData?.taskAction?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }}>
              <TaskActionTabs taskAction={taskActionData?.taskAction}/>
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
              <Typography variant="body2" color="text.secondary">
                <b>Échéance: </b> {`${getFormatDate(taskAction?.dueDate)}`}{' '}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(taskAction?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(taskAction?.updatedAt)}`}
              </Typography>
              <TaskActionStatusLabelMenu taskAction={taskAction} />
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
      {taskAction?.employees.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Personnes concernées
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {taskAction?.employees?.map((employee, index) => (
                <EmployeeChip key={index} employee={employee} />
              ))}
            </Stack>
          </Paper>
      )}
    </Paper>
  );
}
