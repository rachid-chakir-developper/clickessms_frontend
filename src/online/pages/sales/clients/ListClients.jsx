import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import ClientItemCard from './ClientItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_CLIENT,
  PUT_CLIENT_STATE,
} from '../../../../_shared/graphql/mutations/ClientMutations';
import { GET_CLIENTS } from '../../../../_shared/graphql/queries/ClientQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import ClientFilter from './ClientFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListClients() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [clientFilter, setClientFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setClientFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getClients,
    {
      loading: loadingClients,
      data: clientsData,
      error: clientsError,
      fetchMore: fetchMoreClients,
    },
  ] = useLazyQuery(GET_CLIENTS, {
    variables: { clientFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getClients();
  }, [clientFilter, paginator]);

  const [deleteClient, { loading: loadingDelete }] = useMutation(
    DELETE_CLIENT,
    {
      onCompleted: (datas) => {
        if (datas.deleteClient.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteClient.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteClient } }) {
        console.log('Updating cache after deletion:', deleteClient);

        const deletedClientId = deleteClient.id;

        cache.modify({
          fields: {
            clients(
              existingClients = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedClients = existingClients.nodes.filter(
                (client) => readField('id', client) !== deletedClientId,
              );

              console.log('Updated clients:', updatedClients);

              return {
                totalCount: existingClients.totalCount - 1,
                nodes: updatedClients,
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

  const onDeleteClient = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteClient({ variables: { id: id } });
      },
    });
  };
  const [updateClientState, { loading: loadingPutState }] = useMutation(
    PUT_CLIENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateClientState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateClientState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_CLIENTS }],
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

  const onUpdateClientState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateClientState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ventes/clients/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un client
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ClientFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingClients && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {clientsData?.clients?.nodes.length < 1 && !loadingClients && (
              <Alert severity="warning">Aucun client trouvé.</Alert>
            )}
            {clientsData?.clients?.nodes?.map((client, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <ClientItemCard
                    client={client}
                    onDeleteClient={onDeleteClient}
                    onUpdateClientState={onUpdateClientState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={clientsData?.clients?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
