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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Stack,
  List,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Edit, Star, StarBorder, ArrowBack } from '@mui/icons-material';

import { GET_TASK_RECAP } from '../../../../_shared/graphql/queries/TaskQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CommentsList from '../../../_shared/components/feedBacks/CommentsList';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import {
  getFormatDateTime,
  getPriorityLabel,
  getStatusLabel,
  getStepTypeLabel,
} from '../../../../_shared/tools/functions';
import PersonCard from '../../../_shared/components/persons/PersonCard';
import ChecklistsList from '../../../_shared/components/feedBacks/ChecklistsList';
import TaskWorkersList from '../../../_shared/components/utils/TaskWorkersList';
import TaskVehiclesList from '../../../_shared/components/utils/TaskVehiclesList';
import TaskMaterialsList from '../../../_shared/components/utils/TaskMaterialsList';
import SignatureCard from '../../../_shared/components/feedBacks/SignatureCard';
import TaskStatusLabelMenu from './TaskStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import TaskTabs from './tasks-tabs/TaskTabs';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import { useSession } from '../../../../_shared/context/SessionProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TaskDetails() {
  const { user } = useSession();
    const authorizationSystem = useAuthorizationSystem();
    const canManageFacility = authorizationSystem.requestAuthorization({
      type: 'manageFacility',
    }).authorized;
  let { idTask } = useParams();
  const [getTask, { loading: loadingTask, data: taskData, error: taskError }] =
    useLazyQuery(GET_TASK_RECAP);
      
  React.useEffect(() => {
    if (idTask) {
      getTask({ variables: { id: idTask } });
    }
  }, [idTask]);

  React.useEffect(() => {
    if (taskData) {
      console.log("TASK DETAILS DATA:", taskData);
    }
  }, [taskData]);

  if (loadingTask) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1}}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/travaux/interventions/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        {(canManageFacility || (user?.employee?.id==taskData?.task?.employee?.id)) && <Link
          to={`/online/travaux/interventions/modifier/${taskData?.task.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>}
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <TaskMiniInfos task={taskData?.task} />
          </Grid>
          <Grid item xs={5}>
            <TaskOtherInfos task={taskData?.task} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskData?.task?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }}>
              <TaskTabs task={taskData?.task}/>
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

function TaskMiniInfos({ task }) {
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
        {task?.image && task?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="complex" src={task?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {task?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{task?.number}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(task?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(task?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(task?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(task?.endingDateTime)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Priorité: </b>
              </Typography>
              <Chip
                label={getPriorityLabel(task?.priority)}
                variant="filled"
              />
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Status: </b>
              </Typography>
              <TaskStatusLabelMenu task={task} />
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography gutterBottom variant="subtitle3" component="h3">
                  Les tâches traitées
                </Typography>
                <ChecklistsList
                  checklist={task?.taskChecklist}
                  isFromQuote={task?.isFromQuote}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TaskOtherInfos({ task }) {
  console.log("Task in TaskOtherInfos:", task);
  console.log("Supplier in TaskOtherInfos:", task?.supplier);
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Box sx={{ marginY: 2 }}>
                <Paper sx={{ padding: 2 }} variant="outlined">
                  <Typography gutterBottom variant="subtitle3" component="h3">
                    Adresse de l'intervention
                  </Typography>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {task?.address}
                  </Typography>
                </Paper>
              </Box>
              {task?.supplier ? (
                <Paper sx={{ padding: 2, marginY:1 }} variant="outlined">
                  <Typography variant="h6" gutterBottom>
                    Fournisseur
                  </Typography>
                  <Stack direction="row" flexWrap='wrap' spacing={1}>
                    <Chip
                      label={task?.supplier?.name}
                      variant="outlined"
                      sx={{ margin: 0.5 }}
                    />
                  </Stack>
                </Paper>
              ) : (
                <Paper sx={{ padding: 2, marginY:1 }} variant="outlined">
                  <Typography variant="h6" gutterBottom>
                    Fournisseur
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aucun fournisseur associé
                  </Typography>
                </Paper>
              )}
              {task?.employee && (
                <>
                  <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Ajouté par
                    </Typography>
                    <EmployeeChip employee={task?.employee} />
                  </Paper>
                </>
              )}
              {task?.establishments.length > 0 && (
                  <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Les structures concernées
                    </Typography>
                    <Stack direction="row" flexWrap='wrap' spacing={1}>
                      {task?.establishments?.map((establishment, index) => (
                          <EstablishmentChip establishment={establishment.establishment} key={index}/>
                      ))}
                    </Stack>
                  </Paper>
              )}
              <Box sx={{ marginY: 2 }}>
                <Paper sx={{ padding: 2 }} variant="outlined">
                  <Typography gutterBottom variant="subtitle3" component="h3">
                    Autres infos
                  </Typography>
                  <AttachementBasicAccordion task={task} />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}


function AttachementBasicAccordion({ task }) {
  return (
    <Box>
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Les intervenants</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{task?.workersInfos}</Typography>
          <TaskWorkersList workers={task?.workers} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
