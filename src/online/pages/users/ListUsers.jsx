import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import UserItemCard from './UserItemCard';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_USER,
  PUT_USER_STATE,
} from '../../../_shared/graphql/mutations/UserMutations';
import { GET_USERS } from '../../../_shared/graphql/queries/UserQueries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DialogAddGroup from './groups/DialogAddGroup';
import DialogListGroups from './groups/DialogListGroups';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import UserFilter from './UserFilter';
import PaginationControlled from '../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListUsers() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [userFilter, setUserFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setUserFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogList, setOpenDialogList] = React.useState(false);
  const handleClickAdd = () => {
    setOpenDialog(true);
  };
  const handleClickList = () => {
    setOpenDialogList(true);
  };
  const closeDialog = (value) => {
    setOpenDialog(false);
    if (value) {
      console.log('value', value);
    }
  };
  const closeDialogList = (value) => {
    setOpenDialogList(false);
    if (value) {
      console.log('value', value);
    }
  };
  const [
    getUsers,
    {
      loading: loadingUsers,
      data: usersData,
      error: usersError,
      fetchMore: fetchMoreUsers,
    },
  ] = useLazyQuery(GET_USERS, {
    variables: { userFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getUsers();
  }, [userFilter, paginator]);

  const [deleteUser, { loading: loadingDelete }] = useMutation(DELETE_USER, {
    onCompleted: (datas) => {
      if (datas.deleteUser.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteUser.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteUser } }) {
      console.log('Updating cache after deletion:', deleteUser);

      const deletedUserId = deleteUser.id;

      cache.modify({
        fields: {
          users(existingUsers = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedUsers = existingUsers.nodes.filter(
              (user) => readField('id', user) !== deletedUserId,
            );

            console.log('Updated users:', updatedUsers);

            return {
              totalCount: existingUsers.totalCount - 1,
              nodes: updatedUsers,
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

  const onDeleteUser = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteUser({ variables: { id: id } });
      },
    });
  };
  const [updateUserState, { loading: loadingPutState }] = useMutation(
    PUT_USER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateUserState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateUserState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_USERS }],
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

  const onUpdateUserState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateUserState({ variables: { id: id } });
      },
    });
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item="true" xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
            <Button
              variant="contained"
              disableElevation
              color="inherit"
              sx={{ mr: 2 }}
              endIcon={<List />}
              onClick={() => handleClickList()}
            >
              Liste des groupes
            </Button>
            <Button
              variant="contained"
              disableElevation
              color="inherit"
              sx={{ mr: 2 }}
              endIcon={<Add />}
              onClick={() => handleClickAdd()}
            >
              Ajouter un groupe
            </Button>
            <Link to="/online/utilisateurs/ajouter" className="no_style">
              <Button variant="contained" endIcon={<Add />}>
                Ajouter un utilisateur
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <UserFilter onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item="true" xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {loadingUsers && (
                <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                  <ProgressService type="mediaCard" />
                </Grid>
              )}
              {usersData?.users?.nodes?.length < 1 && !loadingUsers && (
                <Alert severity="warning">Aucun utilisateur trouvé.</Alert>
              )}
              {usersData?.users?.nodes?.map((user, index) => (
                <Grid xs={12} sm={6} md={4} key={index}>
                  <Item>
                    <UserItemCard
                      user={user}
                      onDeleteUser={onDeleteUser}
                      onUpdateUserState={onUpdateUserState}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item="true" xs={12}>
          <PaginationControlled
            totalItems={usersData?.users?.totalCount} // Nombre total d'éléments
            itemsPerPage={paginator.limit} // Nombre d'éléments par page
            currentPage={1}
            onChange={(page) => setPaginator({ ...paginator, page })}
          />
        </Grid>
      </Grid>
      <DialogAddGroup open={openDialog} onClose={closeDialog} />
      <DialogListGroups open={openDialogList} onClose={closeDialogList} />
    </>
  );
}
