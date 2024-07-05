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
  Chip,
} from '@mui/material';

import { FEEDBACK_RECAP } from '../../../../_shared/graphql/queries/FeedbackQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
  getFeedbackModuleLabel,
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

export default function FeedbackDetails() {
  let { idFeedback } = useParams();
  const [
    getFeedback,
    {
      loading: loadingFeedback,
      data: feedbackData,
      error: feedbackError,
    },
  ] = useLazyQuery(FEEDBACK_RECAP);
  React.useEffect(() => {
    if (idFeedback) {
      getFeedback({ variables: { id: idFeedback } });
    }
  }, [idFeedback]);

  if (loadingFeedback) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <FeedbackMiniInfos feedback={feedbackData?.feedback} />
          </Grid>
          <Grid item xs={5}>
            <FeedbackOtherInfos feedback={feedbackData?.feedback} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Message
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {feedbackData?.feedback?.message}
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

function FeedbackMiniInfos({ feedback }) {
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
        {feedback?.image && feedback?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={feedback?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{feedback?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {feedback?.name}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(feedback?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(feedback?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function FeedbackOtherInfos({ feedback }) {
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
      <Typography variant="h6" gutterBottom>
            Module concerné:
      </Typography>
      <Chip
        label={getFeedbackModuleLabel(feedback?.feedbackModule)}
        variant="outlined"
      />
    </Paper>
  );
}
