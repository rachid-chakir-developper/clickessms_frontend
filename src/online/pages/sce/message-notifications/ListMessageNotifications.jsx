import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import MessageNotificationItemCard from './MessageNotificationItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_MSG_NOTIFICATION,
  PUT_MSG_NOTIFICATION_STATE,
} from '../../../../_shared/graphql/mutations/MessageNotificationMutations';
import { GET_MSG_NOTIFICATIONS } from '../../../../_shared/graphql/queries/MessageNotificationQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import MessageNotificationFilter from './MessageNotificationFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListMessageNotifications from './TableListMessageNotifications';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListMessageNotifications() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  
  const [messageNotificationFilter, setMessageNotificationFilter] = React.useState({messageNotificationTypes : ['SCE']});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setMessageNotificationFilter({...newFilter, messageNotificationTypes : ['SCE']});
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getMessageNotifications,
    {
      loading: loadingMessageNotifications,
      data: messageNotificationsData,
      error: messageNotificationsError,
      fetchMore: fetchMoreMessageNotifications,
    },
  ] = useLazyQuery(GET_MSG_NOTIFICATIONS, {
    variables: { messageNotificationFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getMessageNotifications();
  }, [messageNotificationFilter, paginator]);
  const [deleteMessageNotification, { loading: loadingDelete }] = useMutation(
    DELETE_MSG_NOTIFICATION,
    {
      onCompleted: (datas) => {
        if (datas.deleteMessageNotification.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteMessageNotification.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteMessageNotification } }) {
        console.log('Updating cache after deletion:', deleteMessageNotification);

        const deletedMessageNotificationId = deleteMessageNotification.id;

        cache.modify({
          fields: {
            messageNotifications(
              existingMessageNotifications = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedMessageNotifications = existingMessageNotifications.nodes.filter(
                (messageNotification) => readField('id', messageNotification) !== deletedMessageNotificationId,
              );

              console.log('Updated messageNotifications:', updatedMessageNotifications);

              return {
                totalCount: existingMessageNotifications.totalCount - 1,
                nodes: updatedMessageNotifications,
              };
            },
          },
        });
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onDeleteMessageNotification = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteMessageNotification({ variables: { id: id } });
      },
    });
  };
  const [updateMessageNotificationState, { loading: loadingPutState }] = useMutation(
    PUT_MSG_NOTIFICATION_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateMessageNotificationState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateMessageNotificationState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_MSG_NOTIFICATIONS }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onUpdateMessageNotificationState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateMessageNotificationState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/cse/message-notifications/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une annonce
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <MessageNotificationFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {loadingMessageNotifications && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {messageNotificationsData?.messageNotifications?.nodes?.length < 1 && !loadingMessageNotifications && (
              <Alert severity="warning">Aucune annonce trouvée.</Alert>
            )}
            {messageNotificationsData?.messageNotifications?.nodes?.map((messageNotification, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <MessageNotificationItemCard
                    messageNotification={messageNotification}
                    onDeleteMessageNotification={onDeleteMessageNotification}
                    onUpdateMessageNotificationState={onUpdateMessageNotificationState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListMessageNotifications
          loading={loadingMessageNotifications}
          rows={messageNotificationsData?.messageNotifications?.nodes || []}
          onDeleteMessageNotification={onDeleteMessageNotification}
          onUpdateMessageNotificationState={onUpdateMessageNotificationState}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={messageNotificationsData?.messageNotifications?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
