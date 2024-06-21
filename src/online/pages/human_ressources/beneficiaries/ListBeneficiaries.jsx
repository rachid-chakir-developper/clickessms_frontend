import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import BeneficiaryItemCard from './BeneficiaryItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_BENEFICIARY,
  PUT_BENEFICIARY_STATE,
} from '../../../../_shared/graphql/mutations/BeneficiaryMutations';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import BeneficiaryFilter from './BeneficiaryFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBeneficiaries from './TableListBeneficiaries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBeneficiaries() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [beneficiaryFilter, setBeneficiaryrFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryrFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBeneficiaries,
    {
      loading: loadingBeneficiaries,
      data: beneficiariesData,
      error: beneficiariesError,
      fetchMore: fetchMoreBeneficiaries,
    },
  ] = useLazyQuery(GET_BENEFICIARIES, {
    variables: {
      beneficiaryFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getBeneficiaries();
  }, [beneficiaryFilter, paginator]);

  const [deleteBeneficiary, { loading: loadingDelete }] = useMutation(
    DELETE_BENEFICIARY,
    {
      onCompleted: (datas) => {
        if (datas.deleteBeneficiary.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteBeneficiary.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBeneficiary } }) {
        console.log('Updating cache after deletion:', deleteBeneficiary);

        const deletedBeneficiaryId = deleteBeneficiary.id;

        cache.modify({
          fields: {
            beneficiaries(
              existingBeneficiaries = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaries = existingBeneficiaries.nodes.filter(
                (beneficiary) =>
                  readField('id', beneficiary) !== deletedBeneficiaryId,
              );

              console.log('Updated beneficiaries:', updatedBeneficiaries);

              return {
                totalCount: existingBeneficiaries.totalCount - 1,
                nodes: updatedBeneficiaries,
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

  const onDeleteBeneficiary = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBeneficiary({ variables: { id: id } });
      },
    });
  };

  const [updateBeneficiaryState, { loading: loadingPutState }] = useMutation(
    PUT_BENEFICIARY_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBeneficiaryState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBeneficiaryState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BENEFICIARIES }],
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

  const onUpdateBeneficiaryState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/ressources-humaines/beneficiaires/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un bénéficiaire
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <BeneficiaryFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingBeneficiaries && (
              <Grid key={'pgrs'} item="true" xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {beneficiariesData?.beneficiaries?.nodes?.length < 1 &&
              !loadingBeneficiaries && (
                <Alert severity="warning">Aucun bénéficiaire trouvé.</Alert>
              )}
            {beneficiariesData?.beneficiaries?.nodes?.map(
              (beneficiary, index) => (
                <Grid xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <BeneficiaryItemCard
                      beneficiary={beneficiary}
                      onDeleteBeneficiary={onDeleteBeneficiary}
                      onUpdateBeneficiaryState={onUpdateBeneficiaryState}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item="true" xs={12}>
        <TableListBeneficiaries
          loading={loadingBeneficiaries}
          rows={beneficiariesData?.beneficiaries?.nodes || []}
          onDeleteBeneficiary={onDeleteBeneficiary}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={beneficiariesData?.beneficiaries?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
