import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Stack, Button, ListItem, ListItemIcon, ListItemText, List, Avatar } from '@mui/material';

import { ACTION_PLAN_OBJECTIVE_RECAP } from '../../../../../_shared/graphql/queries/ActionPlanObjectiveQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../../human_ressources/beneficiaries/BeneficiaryItemCard';
import EstablishmentItemCard from '../../../companies/establishments/EstablishmentItemCard';
import { Check, CheckBoxOutlineBlank, Done, Edit, Note } from '@mui/icons-material';
import EmployeeItemCard from '../../../human_ressources/employees/EmployeeItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ActionPlanObjectiveDetails() {
  let { idActionPlanObjective } = useParams();
  const [
    getActionPlanObjective,
    { loading: loadingActionPlanObjective, data: actionPlanObjectiveData, error: actionPlanObjectiveError },
  ] = useLazyQuery(ACTION_PLAN_OBJECTIVE_RECAP);
  React.useEffect(() => {
    if (idActionPlanObjective) {
      getActionPlanObjective({ variables: { id: idActionPlanObjective } });
    }
  }, [idActionPlanObjective]);

  if (loadingActionPlanObjective) return <ProgressService type="form" />;
  return (
    <>
      <Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
          <Link
            to={`/online/qualites/plan-action/objectifs/modifier/${actionPlanObjectiveData?.actionPlanObjective?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item="true" xs={7}>
            <ActionPlanObjectiveMiniInfos actionPlanObjective={actionPlanObjectiveData?.actionPlanObjective} />
          </Grid>
          <Grid item="true" xs={5}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  margin: 'auto',
                  marginTop: 2,
                  flexGrow: 1,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
              >
                <Typography gutterBottom variant="subtitle3" component="h3">
                  Type de objectif
                </Typography>
                {actionPlanObjectiveData?.actionPlanObjective?.actionPlanObjectiveTypes?.map((actionPlanObjectiveType, index) => (
                  <Chip
                    color="info"
                    key={index}
                    label={actionPlanObjectiveType?.name}
                    sx={{ marginRight: 1 }}
                  />
                ))}
              </Paper>
          </Grid>
          <Grid item="true" xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item="true" xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {actionPlanObjectiveData?.actionPlanObjective?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item="true" xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {actionPlanObjectiveData?.actionPlanObjective?.observation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item="true" xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item="true" xs={6}>
            <ActionPlanObjectiveParticipantsInfos actionPlanObjective={actionPlanObjectiveData?.actionPlanObjective} />
          </Grid>
          <Grid item="true" xs={6}>
            <ActionPlanObjectiveOtherInfos actionPlanObjective={actionPlanObjectiveData?.actionPlanObjective} />
          </Grid>
          <Grid item="true" xs={12} sx={{ marginY: 3 }}>
            <Divider sx={{ marginY: 3 }}/>
            <Typography gutterBottom variant="subtitle3" component="h1">
              Le compte rendu
            </Typography>
          </Grid>
          <Grid item="true" xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Les notes prises
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {actionPlanObjectiveData?.actionPlanObjective?.notes}
              </Typography>
            </Paper>
          </Grid>
          <Grid item="true" xs={6}>
            <ActionPlanObjectiveDecisions actionPlanObjective={actionPlanObjectiveData?.actionPlanObjective} />
          </Grid>
          <Grid item="true" xs={6}>
            <ActionPlanObjectiveReviewPoints actionPlanObjective={actionPlanObjectiveData?.actionPlanObjective} />
          </Grid>
          <Grid item="true" xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function ActionPlanObjectiveMiniInfos({ actionPlanObjective }) {
  return (
    <>
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
          <Grid item="true" xs={12} sm container>
            <Grid item="true" xs container direction="column" spacing={2}>
              <Grid item="true" xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  Réference : <b>{actionPlanObjective?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {actionPlanObjective?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Crée le: </b> {`${getFormatDateTime(actionPlanObjective?.createdAt)}`}{' '}
                  <br />
                  <b>Dernière modification: </b>
                  {`${getFormatDateTime(actionPlanObjective?.updatedAt)}`}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date début: </b>{' '}
                  {`${getFormatDateTime(actionPlanObjective?.startingDateTime)}`} <br />
                  <b>Date fin: </b>{' '}
                  {`${getFormatDateTime(actionPlanObjective?.endingDateTime)}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}


function ActionPlanObjectiveParticipantsInfos({ actionPlanObjective }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {actionPlanObjective?.participants.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Personnes concernées
            </Typography>
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                {actionPlanObjective?.participants?.map((participant, index) => (
                  <Grid xs={12} sm={12} md={12} key={index} sx={{marginY: 1}}>
                    <Item>
                      <EmployeeItemCard employee={participant.employee} />
                    </Item>
                  </Grid>
                ))}
              </Grid>
          </Paper>
      )}
      {actionPlanObjective?.absentParticipants?.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Personnes absentes
            </Typography>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              {actionPlanObjective?.absentParticipants?.map((participant, index) => (
                <Grid xs={12} sm={12} md={12} key={index} sx={{marginY: 1}}>
                  <Item>
                    <EmployeeItemCard employee={participant} />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Paper>
      )}
    </Paper>
  );
}


function ActionPlanObjectiveOtherInfos({ actionPlanObjective }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {actionPlanObjective?.establishments.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les structures concernées
            </Typography>
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                {actionPlanObjective?.establishments?.map((establishment, index) => (
                  <Grid xs={12} sm={12} md={12} key={index} sx={{marginY: 1}}>
                    <Item>
                      <EstablishmentItemCard establishment={establishment.establishment} />
                    </Item>
                  </Grid>
                ))}
              </Grid>
          </Paper>
      )}
      {actionPlanObjective?.beneficiaries?.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Bénificiaires concernés
            </Typography>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              {actionPlanObjective?.beneficiaries?.map((beneficiary, index) => (
                <Grid xs={12} sm={12} md={12} key={index} sx={{marginY: 1}}>
                  <Item>
                    <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Paper>
      )}
    </Paper>
  );
}

function ActionPlanObjectiveDecisions({ actionPlanObjective }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {actionPlanObjective?.actionPlanObjectiveDecisions.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les décisions
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {actionPlanObjective?.actionPlanObjectiveDecisions?.map((actionPlanObjectiveDecision, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText
                      primary={actionPlanObjectiveDecision?.decision}
                      secondary={actionPlanObjectiveDecision?.dueDate ? `Échéance: ${getFormatDate(actionPlanObjectiveDecision?.dueDate)}` : ''}
                    />
                  </ListItem>
                  {actionPlanObjectiveDecision?.employees?.length > 0 && (
                      <>
                        <Typography variant="p" gutterBottom sx={{fontSize: 12, fontStyle: 'italic'}}>
                          Personnes concernées
                        </Typography>
                        <Stack direction="row" flexWrap='wrap' spacing={1}>
                          {actionPlanObjectiveDecision?.employees?.map((employee, index) => (
                            <Chip
                              key={index}
                              avatar={
                                <Avatar
                                  alt={`${employee?.firstName} ${employee?.lastName}`}
                                  src={
                                    employee?.photo
                                      ? employee?.photo
                                      : '/default-placeholder.jpg'
                                  }
                                />
                              }
                              label={`${employee?.firstName} ${employee?.lastName}`}
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </>
                    )}
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}

function ActionPlanObjectiveReviewPoints({ actionPlanObjective }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {actionPlanObjective?.actionPlanObjectiveReviewPoints.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les points à revoir
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {actionPlanObjective?.actionPlanObjectiveReviewPoints?.map((actionPlanObjectiveReviewPoint, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText
                      primary={actionPlanObjectiveReviewPoint?.pointToReview}
                    />
                  </ListItem>
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}