import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_SPACE_ROOM,
  PUT_SPACE_ROOM_STATE,
} from '../../../../_shared/graphql/mutations/SpaceRoomMutations';
import { GET_SPACE_ROOMS } from '../../../../_shared/graphql/queries/SpaceRoomQueries';
import SpaceRoomFilter from './SpaceRoomFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListSpaceRooms from './TableListSpaceRooms';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListSpaceRooms() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [spaceRoomFilter, setSpaceRoomFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setSpaceRoomFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getSpaceRooms,
    {
      loading: loadingSpaceRooms,
      data: spaceRoomsData,
      error: spaceRoomsError,
      fetchMore: fetchMoreSpaceRooms,
    },
  ] = useLazyQuery(GET_SPACE_ROOMS, {
    variables: { spaceRoomFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getSpaceRooms();
  }, [spaceRoomFilter, paginator]);

  const [deleteSpaceRoom, { loading: loadingDelete }] = useMutation(DELETE_SPACE_ROOM, {
    onCompleted: (datas) => {
      if (datas.deleteSpaceRoom.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteSpaceRoom.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteSpaceRoom } }) {
      console.log('Updating cache after deletion:', deleteSpaceRoom);

      const deletedSpaceRoomId = deleteSpaceRoom.id;

      cache.modify({
        fields: {
          spaceRooms(existingSpaceRooms = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedSpaceRooms = existingSpaceRooms.nodes.filter(
              (spaceRoom) => readField('id', spaceRoom) !== deletedSpaceRoomId,
            );

            console.log('Updated spaceRooms:', updatedSpaceRooms);

            return {
              totalCount: existingSpaceRooms.totalCount - 1,
              nodes: updatedSpaceRooms,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteSpaceRoom = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteSpaceRoom({ variables: { id: id } });
      },
    });
  };

  const [updateSpaceRoomState, { loading: loadingPutState }] = useMutation(
    PUT_SPACE_ROOM_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateSpaceRoomState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateSpaceRoomState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_SPACE_ROOMS }],
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

  const onUpdateSpaceRoomState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSpaceRoomState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/batiment-immobilier/salles/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une salle
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <SpaceRoomFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListSpaceRooms
          loading={loadingSpaceRooms}
          rows={spaceRoomsData?.spaceRooms?.nodes || []}
          onDeleteSpaceRoom={onDeleteSpaceRoom}
          onFilterChange={(newFilter) => handleFilterChange({ ...spaceRoomFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={spaceRoomsData?.spaceRooms?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
