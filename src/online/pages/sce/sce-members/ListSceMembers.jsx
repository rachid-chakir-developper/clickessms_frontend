import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import SceMemberItemCard from './SceMemberItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_SCE_MEMBER,
  PUT_SCE_MEMBER_STATE,
} from '../../../../_shared/graphql/mutations/SceMemberMutations';
import { GET_SCE_MEMBERS } from '../../../../_shared/graphql/queries/SceMemberQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import SceMemberFilter from './SceMemberFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListSceMembers() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageSce = authorizationSystem.requestAuthorization({
    type: 'manageSce',
  }).authorized;

  const [paginator, setPaginator] = React.useState({ page: 1, limit: 18 });
  const [sceMemberFilter, setSceMemberrFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setSceMemberrFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getSceMembers,
    {
      loading: loadingSceMembers,
      data: sceMembersData,
      error: sceMembersError,
      fetchMore: fetchMoreSceMembers,
    },
  ] = useLazyQuery(GET_SCE_MEMBERS, {
    variables: { sceMemberFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getSceMembers();
  }, [sceMemberFilter, paginator]);

  const [deleteSceMember, { loading: loadingDelete }] = useMutation(
    DELETE_SCE_MEMBER,
    {
      onCompleted: (datas) => {
        if (datas.deleteSceMember.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteSceMember.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteSceMember } }) {
        console.log('Updating cache after deletion:', deleteSceMember);

        const deletedSceMemberId = deleteSceMember.id;

        cache.modify({
          fields: {
            sceMembers(
              existingSceMembers = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedSceMembers = existingSceMembers.nodes.filter(
                (sceMember) => readField('id', sceMember) !== deletedSceMemberId,
              );

              console.log('Updated sceMembers:', updatedSceMembers);

              return {
                totalCount: existingSceMembers.totalCount - 1,
                nodes: updatedSceMembers,
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

  const onDeleteSceMember = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteSceMember({ variables: { id: id } });
      },
    });
  };

  const [updateSceMemberState, { loading: loadingPutState }] = useMutation(
    PUT_SCE_MEMBER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateSceMemberState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateSceMemberState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_SCE_MEMBERS }],
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

  const onUpdateSceMemberState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSceMemberState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      {canManageSce && <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/cse/membres/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un membre
            </Button>
          </Link>
        </Box>
      </Grid>}
      <Grid item xs={12}>
        <SceMemberFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1, paddingY: 4 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingSceMembers && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {sceMembersData?.sceMembers?.nodes?.length < 1 &&
              !loadingSceMembers && (
                <Alert severity="warning">Aucun membre trouvé.</Alert>
              )}
            {sceMembersData?.sceMembers?.nodes?.map((sceMember, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <SceMemberItemCard
                    sceMember={sceMember}
                    onDeleteSceMember={onDeleteSceMember}
                    onUpdateSceMemberState={onUpdateSceMemberState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={sceMembersData?.sceMembers?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
