import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import BeneficiaryGroupItemCard from './BeneficiaryGroupItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_BENEFICIARY_GROUP,
  PUT_BENEFICIARY_GROUP_STATE,
} from '../../../../../_shared/graphql/mutations/BeneficiaryGroupMutations';
import { GET_BENEFICIARY_GROUPS } from '../../../../../_shared/graphql/queries/BeneficiaryGroupQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import BeneficiaryGroupFilter from './BeneficiaryGroupFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBeneficiaryGroups() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [beneficiaryGroupFilter, setBeneficiaryGroupFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBeneficiaryGroupFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBeneficiaryGroups,
    {
      loading: loadingBeneficiaryGroups,
      data: beneficiaryGroupsData,
      error: beneficiaryGroupsError,
      fetchMore: fetchMoreBeneficiaryGroups,
    },
  ] = useLazyQuery(GET_BENEFICIARY_GROUPS, {
    variables: {
      beneficiaryGroupFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getBeneficiaryGroups();
  }, [beneficiaryGroupFilter, paginator]);

  const [deleteBeneficiaryGroup, { loading: loadingDelete }] = useMutation(
    DELETE_BENEFICIARY_GROUP,
    {
      onCompleted: (datas) => {
        if (datas.deleteBeneficiaryGroup.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteBeneficiaryGroup.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBeneficiaryGroup } }) {
        console.log('Updating cache after deletion:', deleteBeneficiaryGroup);

        const deletedBeneficiaryGroupId = deleteBeneficiaryGroup.id;

        cache.modify({
          fields: {
            beneficiaryGroups(
              existingBeneficiaryGroups = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaryGroups =
                existingBeneficiaryGroups.nodes.filter(
                  (beneficiaryGroup) =>
                    readField('id', beneficiaryGroup) !==
                    deletedBeneficiaryGroupId,
                );

              console.log(
                'Updated beneficiaryGroups:',
                updatedBeneficiaryGroups,
              );

              return {
                totalCount: existingBeneficiaryGroups.totalCount - 1,
                nodes: updatedBeneficiaryGroups,
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

  const onDeleteBeneficiaryGroup = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBeneficiaryGroup({ variables: { id: id } });
      },
    });
  };

  const [updateBeneficiaryGroupState, { loading: loadingPutState }] =
    useMutation(PUT_BENEFICIARY_GROUP_STATE, {
      onCompleted: (datas) => {
        if (datas.updateBeneficiaryGroupState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBeneficiaryGroupState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BENEFICIARY_GROUPS }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    });

  const onUpdateBeneficiaryGroupState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryGroupState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/ressources-humaines/beneficiaires/groupes/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un groupe de personnes accompagnées
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BeneficiaryGroupFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingBeneficiaryGroups && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {beneficiaryGroupsData?.beneficiaryGroups?.nodes?.length < 1 &&
              !loadingBeneficiaryGroups && (
                <Alert severity="warning">
                  Aucun groupe de personnes accompagnées trouvé.
                </Alert>
              )}
            {beneficiaryGroupsData?.beneficiaryGroups?.nodes?.map(
              (beneficiaryGroup, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <BeneficiaryGroupItemCard
                      beneficiaryGroup={beneficiaryGroup}
                      onDeleteBeneficiaryGroup={onDeleteBeneficiaryGroup}
                      onUpdateBeneficiaryGroupState={
                        onUpdateBeneficiaryGroupState
                      }
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={beneficiaryGroupsData?.beneficiaryGroups?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
