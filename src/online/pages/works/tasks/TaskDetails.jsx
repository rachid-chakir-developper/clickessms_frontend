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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { GET_TASK_RECAP } from '../../../../_shared/graphql/queries/TaskQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CommentsList from '../../../_shared/components/feedBacks/CommentsList';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import {
  getFormatDateTime,
  getStatusLabel,
  getStepTypeLabel,
} from '../../../../_shared/tools/functions';
import PersonCard from '../../../_shared/components/persons/PersonCard';
import ChecklistsList from '../../../_shared/components/feedBacks/ChecklistsList';
import TaskWorkersList from '../../../_shared/components/utils/TaskWorkersList';
import TaskVehiclesList from '../../../_shared/components/utils/TaskVehiclesList';
import TaskMaterialsList from '../../../_shared/components/utils/TaskMaterialsList';
import SignatureCard from '../../../_shared/components/feedBacks/SignatureCard';
import { Star, StarBorder } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TaskDetails() {
  let { idTask } = useParams();
  const [getTask, { loading: loadingTask, data: taskData, error: taskError }] =
    useLazyQuery(GET_TASK_RECAP);
  React.useEffect(() => {
    if (idTask) {
      getTask({ variables: { id: idTask } });
    }
  }, [idTask]);

  if (loadingTask) return <ProgressService type="form" />;
  return (
    <>
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
          <Grid item xs={6}>
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Déscription
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskData?.task?.description}
              </Typography>
            </Paper>
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Commentaire
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskData?.task?.comment}
              </Typography>
            </Paper>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {taskData?.task?.observation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Signature de l'intérvenant
              </Typography>
              <SignatureCard
                signature={taskData?.task?.employeeSignature}
                author={
                  taskData?.task?.employeeSignature?.author
                    ? taskData?.task?.employeeSignature?.author
                    : taskData?.task?.employeeSignature?.creator
                }
              />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Signature du client
              </Typography>
              <SignatureCard
                signature={taskData?.task?.clientSignature}
                author={taskData?.task?.client}
              />
              <Typography
                sx={{ fontSize: 14, marginTop: 2 }}
                color="text.secondary"
                gutterBottom
              >
                <b>Satisfaction : </b>
                {taskData?.task?.clientSignature?.satisfaction === 'KISS' && (
                  <>
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                  </>
                )}
                {taskData?.task?.clientSignature?.satisfaction === 'SMILE' && (
                  <>
                    <Star />
                    <Star />
                    <Star />
                    <StarBorder />
                  </>
                )}
                {taskData?.task?.clientSignature?.satisfaction ===
                  'CONFUSED' && (
                  <>
                    <Star />
                    <Star />
                    <StarBorder />
                    <StarBorder />
                  </>
                )}
                {taskData?.task?.clientSignature?.satisfaction === 'ANGRY' && (
                  <>
                    <Star />
                    <StarBorder />
                    <StarBorder />
                    <StarBorder />
                  </>
                )}
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                <b>commentaire : </b>
                {taskData?.task?.clientSignature?.comment}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          {taskData?.task?.taskSteps?.map((taskStep, index) => (
            <Grid item xs={4} key={index}>
              <TaskStepInfos taskStep={taskStep} />
            </Grid>
          ))}
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
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference client de l'intervention :{' '}
                <b>{task?.clientTaskNumber}</b>
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
                <b>Date début: </b>
                {task?.startedAt
                  ? `${getFormatDateTime(task?.startedAt)}`
                  : 'Pas encore commencée'}{' '}
                <br />
                <b>Date fin: </b>
                {task?.finishedAt
                  ? `${getFormatDateTime(task?.finishedAt)}`
                  : 'Pas encore finie'}
              </Typography>
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
          <Grid item xs={2} sx={{ padding: 2 }}>
            {/* <Typography variant="body2">
              <small><em>Budget éstimé:</em></small>
            </Typography>
            <Typography variant="subtitle3" component="h2">
              {task?.estimatedBudget}€
            </Typography>
            <Divider sx={{marginTop : 2, marginBottom : 2}}/>
            <Typography variant="body2">
              <small><em>État:</em></small> <b>{getStatusLabel(task?.status)}</b>
            </Typography>
            <Typography variant="body2">
              <small><em>Niveau:</em></small> <b>{getLevelLabel(task?.workLevel)}</b>
            </Typography>
            <Typography variant="body2">
              <small><em>Priorité:</em></small> <b>{getPriorityLabel(task?.priority)}</b>
            </Typography>
            <Divider sx={{marginTop : 2, marginBottom : 2}}/> */}
            <Typography variant="body2">
              <small>
                <em>Total Ht:</em>
              </small>
            </Typography>
            <Typography variant="subtitle3" component="h3">
              {task?.totalPriceHt}€
            </Typography>
            <Typography variant="body2">
              <small>
                <em>TVA:</em>
              </small>
            </Typography>
            <Typography variant="subtitle3" component="h3">
              {task?.tva}%
            </Typography>
            <Typography variant="body2">
              <small>
                <em>Remise:</em>
              </small>
            </Typography>
            <Typography variant="subtitle3" component="h3">
              {task?.discount}%
            </Typography>
            <Typography variant="body2">
              <small>
                <em>Total TTC:</em>
              </small>
            </Typography>
            <Typography variant="subtitle3" component="h1">
              {task?.totalPriceTtc}€
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TaskOtherInfos({ task }) {
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
              <Box>
                <PersonCard person={task?.client} />
              </Box>
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
              <Box sx={{ marginY: 2 }}>
                <Paper sx={{ padding: 2 }} variant="outlined">
                  <Typography gutterBottom variant="subtitle3" component="h3">
                    Adresse de facturation
                  </Typography>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {task?.billingAddress}
                  </Typography>
                </Paper>
              </Box>
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

function TaskStepInfos({ taskStep }) {
  return (
    <Paper
      elevation={1}
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
              <Typography gutterBottom variant="subtitle5" component="h3">
                {getStepTypeLabel(taskStep?.stepType)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Dernière modification:</b>{' '}
                {getFormatDateTime(taskStep?.updatedAt)}
              </Typography>
              <Box>
                <TitlebarImageList
                  images={taskStep?.images}
                  videos={taskStep?.videos}
                />
              </Box>
              <Box>
                <CommentsList comments={taskStep?.comments} />
              </Box>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              {getStatusLabel(taskStep?.status)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function AttachementBasicAccordion({ task }) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Le donneur d'ordre</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <b>Nom : </b>
            {task?.contractorName}
          </Typography>
          <Typography>
            <b>Tél : </b>
            {task?.contractorTel}
          </Typography>
          <Typography>
            <b>Email : </b>
            {task?.contractorEmail}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Les personnes sur place</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <b>Nom : </b>
            {task?.receiverName}
          </Typography>
          <Typography>
            <b>Tél : </b>
            {task?.receiverTel}
          </Typography>
          <Typography>
            <b>Email : </b>
            {task?.receiverEmail}
          </Typography>
          <Typography>
            <b>Nom de propriétaire: </b>
            {task?.siteOwnerName}
          </Typography>
          <Typography>
            <b>Nom de locataire : </b>
            {task?.siteTenantName}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Les intérvenants</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{task?.workersInfos}</Typography>
          <TaskWorkersList workers={task?.workers} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography>Les véhicules à prendre</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{task?.vehiclesInfos}</Typography>
          <TaskVehiclesList vehicles={task?.vehicles} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography>Le matériel à prendre</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{task?.materialsInfos}</Typography>
          <TaskMaterialsList materials={task?.materials} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
