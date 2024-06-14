import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import EstablishmentItemCard from './EstablishmentItemCard';
import { useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_ESTABLISHMENT,
  PUT_ESTABLISHMENT_STATE,
} from '../../../../_shared/graphql/mutations/EstablishmentMutations';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import EstablishmentFilter from './EstablishmentFilter';
import { useLazyQuery } from '@apollo/client';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListEstablishments from './TableListEstablishments';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListEstablishments() {
  let { idParent } = useParams();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [establishmentFilter, setEstablishmentFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEstablishmentFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEstablishments,
    {
      loading: loadingEstablishments,
      data: establishmentsData,
      error: establishmentsError,
      fetchMore: fetchMoreEstablishments,
    },
  ] = useLazyQuery(GET_ESTABLISHMENTS, {
    variables: {
      idParent: idParent ? idParent : -1,
      establishmentFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getEstablishments();
  }, [paginator]);

  const [deleteEstablishment, { loading: loadingDelete }] = useMutation(
    DELETE_ESTABLISHMENT,
    {
      onCompleted: (datas) => {
        if (datas.deleteEstablishment.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteEstablishment.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteEstablishment } }) {
        console.log('Updating cache after deletion:', deleteEstablishment);

        const deletedEstablishmentId = deleteEstablishment.id;

        cache.modify({
          fields: {
            establishments(
              existingEstablishments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEstablishments = existingEstablishments.nodes.filter(
                (establishment) =>
                  readField('id', establishment) !== deletedEstablishmentId,
              );

              console.log('Updated establishments:', updatedEstablishments);

              return {
                totalCount: existingEstablishments.totalCount - 1,
                nodes: updatedEstablishments,
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

  const onDeleteEstablishment = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEstablishment({ variables: { id: id } });
      },
    });
  };

  const [updateEstablishmentState, { loading: loadingPutState }] = useMutation(
    PUT_ESTABLISHMENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateEstablishmentState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateEstablishmentState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_ESTABLISHMENTS }],
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

  const onUpdateEstablishmentState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEstablishmentState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/associations/structures/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une structure
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <EstablishmentFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingEstablishments && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {establishmentsData?.establishments?.nodes.length < 1 &&
              !loadingEstablishments && (
                <Alert severity="warning">Aucune structure trouvé.</Alert>
              )}
            {establishmentsData?.establishments?.nodes?.map(
              (establishment, index) => (
                <Grid xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <EstablishmentItemCard
                      establishment={establishment}
                      onDeleteEstablishment={onDeleteEstablishment}
                      onUpdateEstablishmentState={onUpdateEstablishmentState}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item="true" xs={12}>
        <TableListEstablishments
          loading={loadingEstablishments}
          rows={establishmentsData?.establishments?.nodes || []}
          onDeleteEstablishment={onDeleteEstablishment}
          onUpdateEstablishmentState={onUpdateEstablishmentState}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={establishmentsData?.establishments?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
