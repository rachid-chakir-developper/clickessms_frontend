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
  Chip,
  Button,
} from '@mui/material';

import { MSG_NOTIFICATION_RECAP } from '../../../../_shared/graphql/queries/MessageNotificationQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
  getMessageNotificationTypeLabel,
} from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import { ArrowBack, Edit } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function MessageNotificationDetails() {
  let { idMessageNotification } = useParams();
  const [
    getMessageNotification,
    {
      loading: loadingMessageNotification,
      data: messageNotificationData,
      error: messageNotificationError,
    },
  ] = useLazyQuery(MSG_NOTIFICATION_RECAP);
  React.useEffect(() => {
    if (idMessageNotification) {
      getMessageNotification({ variables: { id: idMessageNotification } });
    }
  }, [idMessageNotification]);

  if (loadingMessageNotification) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/cse/notifications-messages/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link
          to={`/online/cse/notifications-messages/modifier/${messageNotificationData?.messageNotification?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <MessageNotificationMiniInfos messageNotification={messageNotificationData?.messageNotification} />
          </Grid>
          <Grid item xs={5}>
            <MessageNotificationOtherInfos messageNotification={messageNotificationData?.messageNotification} />
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
                {messageNotificationData?.messageNotification?.message}
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

function MessageNotificationMiniInfos({ messageNotification }) {
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
        {messageNotification?.image && messageNotification?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={messageNotification?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle3" component="h3">
                {messageNotification?.title}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(messageNotification?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(messageNotification?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function MessageNotificationOtherInfos({ messageNotification }) {
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
      <Chip
          color="info"
          label={getMessageNotificationTypeLabel(messageNotification?.messageNotificationType)}
          sx={{ marginbottom: 1, backgroundColor: messageNotification?.primaryColor }}
        />
      {messageNotification?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={messageNotification?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}
