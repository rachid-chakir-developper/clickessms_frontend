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

import { ACTION_PLAN_ACTION_RECAP } from '../../../../_shared/graphql/queries/ActionPlanActionQueries';
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

export default function ActionPlanActionDetails() {
  let { idActionPlanAction } = useParams();
  const [
    getActionPlanAction,
    { loading: loadingActionPlanAction, data: actionPlanActionData, error: actionPlanActionError },
  ] = useLazyQuery(ACTION_PLAN_ACTION_RECAP);
  React.useEffect(() => {
    if (idActionPlanAction) {
      getActionPlanAction({ variables: { id: idActionPlanAction } });
    }
  }, [idActionPlanAction]);

  if (loadingActionPlanAction) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <ActionPlanActionMiniInfos actionPlanAction={actionPlanActionData?.actionPlanAction} />
          </Grid>
          <Grid item xs={5}>
            <ActionPlanActionOtherInfos actionPlanAction={actionPlanActionData?.actionPlanAction} />
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
                {actionPlanActionData?.actionPlanAction?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {actionPlanActionData?.actionPlanAction?.observation}
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

function ActionPlanActionMiniInfos({ actionPlanAction }) {
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
        {actionPlanAction?.image && actionPlanAction?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={actionPlanAction?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{actionPlanAction?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {actionPlanAction?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant : {formatCurrencyAmount(actionPlanAction?.amount)}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                IBAN : <b>{actionPlanAction?.iban}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                BIC : <b>{actionPlanAction?.bic}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(actionPlanAction?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(actionPlanAction?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(actionPlanAction?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(actionPlanAction?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function ActionPlanActionOtherInfos({ actionPlanAction }) {
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
      {actionPlanAction?.bankAccount?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={actionPlanAction?.bankAccount?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}
