import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import GovernanceMemberItemCard from './GovernanceMemberItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_GOVERNANCE_MEMBER,
  PUT_GOVERNANCE_MEMBER_STATE,
} from '../../../../_shared/graphql/mutations/GovernanceMemberMutations';
import { GET_GOVERNANCE_MEMBERS } from '../../../../_shared/graphql/queries/GovernanceMemberQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import GovernanceMemberFilter from './GovernanceMemberFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListGovernanceMembers() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [governanceMemberFilter, setGovernanceMemberrFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setGovernanceMemberrFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getGovernanceMembers,
    {
      loading: loadingGovernanceMembers,
      data: governanceMembersData,
      error: governanceMembersError,
      fetchMore: fetchMoreGovernanceMembers,
    },
  ] = useLazyQuery(GET_GOVERNANCE_MEMBERS, {
    variables: { governanceMemberFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getGovernanceMembers();
  }, [governanceMemberFilter, paginator]);

  const [deleteGovernanceMember, { loading: loadingDelete }] = useMutation(
    DELETE_GOVERNANCE_MEMBER,
    {
      onCompleted: (datas) => {
        if (datas.deleteGovernanceMember.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteGovernanceMember.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteGovernanceMember } }) {
        console.log('Updating cache after deletion:', deleteGovernanceMember);

        const deletedGovernanceMemberId = deleteGovernanceMember.id;

        cache.modify({
          fields: {
            governanceMembers(
              existingGovernanceMembers = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedGovernanceMembers = existingGovernanceMembers.nodes.filter(
                (governanceMember) => readField('id', governanceMember) !== deletedGovernanceMemberId,
              );

              console.log('Updated governanceMembers:', updatedGovernanceMembers);

              return {
                totalCount: existingGovernanceMembers.totalCount - 1,
                nodes: updatedGovernanceMembers,
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

  const onDeleteGovernanceMember = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteGovernanceMember({ variables: { id: id } });
      },
    });
  };

  const [updateGovernanceMemberState, { loading: loadingPutState }] = useMutation(
    PUT_GOVERNANCE_MEMBER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateGovernanceMemberState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateGovernanceMemberState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_GOVERNANCE_MEMBERS }],
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

  const onUpdateGovernanceMemberState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateGovernanceMemberState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/gouvernance/membres/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un membre
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <GovernanceMemberFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingGovernanceMembers && (
              <Grid key={'pgrs'} item="true" xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {governanceMembersData?.governanceMembers?.nodes?.length < 1 &&
              !loadingGovernanceMembers && (
                <Alert severity="warning">Aucun membre trouvé.</Alert>
              )}
            {governanceMembersData?.governanceMembers?.nodes?.map((governanceMember, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Item>
                  <GovernanceMemberItemCard
                    governanceMember={governanceMember}
                    onDeleteGovernanceMember={onDeleteGovernanceMember}
                    onUpdateGovernanceMemberState={onUpdateGovernanceMemberState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={governanceMembersData?.governanceMembers?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
