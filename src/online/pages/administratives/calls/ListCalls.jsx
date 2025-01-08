import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import CallItemCard from './CallItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_CALL,
  PUT_CALL_STATE,
} from '../../../../_shared/graphql/mutations/CallMutations';
import { GET_CALLS } from '../../../../_shared/graphql/queries/CallQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CallFilter from './CallFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListCalls from './TableListCalls';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListCalls() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [callFilter, setCallFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setCallFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getCalls,
    {
      loading: loadingCalls,
      data: callsData,
      error: callsError,
      fetchMore: fetchMoreCalls,
    },
  ] = useLazyQuery(GET_CALLS, {
    variables: { callFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getCalls();
  }, [callFilter, paginator]);

  const [deleteCall, { loading: loadingDelete }] = useMutation(DELETE_CALL, {
    onCompleted: (datas) => {
      if (datas.deleteCall.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteCall.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteCall } }) {
      console.log('Updating cache after deletion:', deleteCall);

      const deletedCallId = deleteCall.id;

      cache.modify({
        fields: {
          calls(existingCalls = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedCalls = existingCalls.nodes.filter(
              (call) => readField('id', call) !== deletedCallId,
            );

            console.log('Updated calls:', updatedCalls);

            return {
              totalCount: existingCalls.totalCount - 1,
              nodes: updatedCalls,
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
  });

  const onDeleteCall = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteCall({ variables: { id: id } });
      },
    });
  };

  const [updateCallState, { loading: loadingPutState }] = useMutation(
    PUT_CALL_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateCallState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateCallState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_CALLS }],
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

  const onUpdateCallState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCallState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/administratif/appels/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un appel
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CallFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingCalls && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {callsData?.calls?.nodes?.length < 1 && !loadingCalls && (
              <Alert severity="warning">Aucun appel trouvé.</Alert>
            )}
            {callsData?.calls?.nodes?.map((call, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <CallItemCard
                    call={call}
                    onDeleteCall={onDeleteCall}
                    onUpdateCallState={onUpdateCallState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListCalls
          loading={loadingCalls}
          rows={callsData?.calls?.nodes || []}
          onDeleteCall={onDeleteCall}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={callsData?.calls?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
