import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import PartnerItemCard from './PartnerItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_PARTNER,
  PUT_PARTNER_STATE,
} from '../../../../_shared/graphql/mutations/PartnerMutations';
import { GET_PARTNERS } from '../../../../_shared/graphql/queries/PartnerQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import PartnerFilter from './PartnerFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListPartners() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [partnerFilter, setPartnerFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setPartnerFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getPartners,
    {
      loading: loadingPartners,
      data: partnersData,
      error: partnersError,
      fetchMore: fetchMorePartners,
    },
  ] = useLazyQuery(GET_PARTNERS, {
    variables: { partnerFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getPartners();
  }, [partnerFilter, paginator]);

  const [deletePartner, { loading: loadingDelete }] = useMutation(
    DELETE_PARTNER,
    {
      onCompleted: (datas) => {
        if (datas.deletePartner.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deletePartner.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deletePartner } }) {
        console.log('Updating cache after deletion:', deletePartner);

        const deletedPartnerId = deletePartner.id;

        cache.modify({
          fields: {
            partners(
              existingPartners = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedPartners = existingPartners.nodes.filter(
                (partner) => readField('id', partner) !== deletedPartnerId,
              );

              console.log('Updated partners:', updatedPartners);

              return {
                totalCount: existingPartners.totalCount - 1,
                nodes: updatedPartners,
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

  const onDeletePartner = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deletePartner({ variables: { id: id } });
      },
    });
  };

  const [updatePartnerState, { loading: loadingPutState }] = useMutation(
    PUT_PARTNER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updatePartnerState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updatePartnerState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_PARTNERS }],
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

  const onUpdatePartnerState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePartnerState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/partenariats/partenaires/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un partenaire
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PartnerFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingPartners && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {partnersData?.partners?.nodes.length < 1 && !loadingPartners && (
              <Alert severity="warning">Aucun partenaire trouvé</Alert>
            )}
            {partnersData?.partners?.nodes?.map((partner, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <PartnerItemCard
                    partner={partner}
                    onDeletePartner={onDeletePartner}
                    onUpdatePartnerState={onUpdatePartnerState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={partnersData?.partners?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
