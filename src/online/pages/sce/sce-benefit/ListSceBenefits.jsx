import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import SceBenefitItemCard from './SceBenefitItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_SCE_BENEFIT,
  PUT_SCE_BENEFIT_STATE,
} from '../../../../_shared/graphql/mutations/SceBenefitMutations';
import { GET_SCE_BENEFITS } from '../../../../_shared/graphql/queries/SceBenefitQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import SceBenefitFilter from './SceBenefitFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListSceBenefits from './TableListSceBenefits';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListSceBenefits() {
  
  const authorizationSystem = useAuthorizationSystem();
  const canManageSceModules = authorizationSystem.requestAuthorization({
    type: 'manageSceModules',
  }).authorized;

  const [paginator, setPaginator] = React.useState({ page: 1, limit: 18 });
  
  const [sceBenefitFilter, setSceBenefitFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setSceBenefitFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getSceBenefits,
    {
      loading: loadingSceBenefits,
      data: sceBenefitsData,
      error: sceBenefitsError,
      fetchMore: fetchMoreSceBenefits,
    },
  ] = useLazyQuery(GET_SCE_BENEFITS, {
    variables: { sceBenefitFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getSceBenefits();
  }, [sceBenefitFilter, paginator]);
  const [deleteSceBenefit, { loading: loadingDelete }] = useMutation(
    DELETE_SCE_BENEFIT,
    {
      onCompleted: (datas) => {
        if (datas.deleteSceBenefit.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteSceBenefit.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteSceBenefit } }) {
        console.log('Updating cache after deletion:', deleteSceBenefit);

        const deletedSceBenefitId = deleteSceBenefit.id;

        cache.modify({
          fields: {
            sceBenefits(
              existingSceBenefits = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedSceBenefits = existingSceBenefits.nodes.filter(
                (sceBenefit) => readField('id', sceBenefit) !== deletedSceBenefitId,
              );

              console.log('Updated sceBenefits:', updatedSceBenefits);

              return {
                totalCount: existingSceBenefits.totalCount - 1,
                nodes: updatedSceBenefits,
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

  const onDeleteSceBenefit = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteSceBenefit({ variables: { id: id } });
      },
    });
  };
  const [updateSceBenefitState, { loading: loadingPutState }] = useMutation(
    PUT_SCE_BENEFIT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateSceBenefitState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateSceBenefitState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_SCE_BENEFITS }],
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

  const onUpdateSceBenefitState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSceBenefitState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      {canManageSceModules && <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/cse/avantages/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un avantage
            </Button>
          </Link>
        </Box>
      </Grid>}
      <Grid item xs={12}>
        <SceBenefitFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {loadingSceBenefits && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {sceBenefitsData?.sceBenefits?.nodes?.length < 1 && !loadingSceBenefits && (
              <Alert severity="warning">Aucun avantage trouvée.</Alert>
            )}
            {sceBenefitsData?.sceBenefits?.nodes?.map((sceBenefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <SceBenefitItemCard
                    sceBenefit={sceBenefit}
                    onDeleteSceBenefit={onDeleteSceBenefit}
                    onUpdateSceBenefitState={onUpdateSceBenefitState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      {/* <Grid item xs={12}>
        <TableListSceBenefits
          loading={loadingSceBenefits}
          rows={sceBenefitsData?.sceBenefits?.nodes || []}
          onDeleteSceBenefit={onDeleteSceBenefit}
          onUpdateSceBenefitState={onUpdateSceBenefitState}
        />
      </Grid> */}
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={sceBenefitsData?.sceBenefits?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
