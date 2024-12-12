import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_THE_BACKUP,
  PUT_THE_BACKUP_STATE,
} from '../../../../_shared/graphql/mutations/TheBackupMutations';
import { GET_THE_BACKUPS } from '../../../../_shared/graphql/queries/TheBackupQueries';
import TheBackupFilter from './TheBackupFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListTheBackups from './TableListTheBackups';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListTheBackups() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [theBackupFilter, setTheBackupFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setTheBackupFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getTheBackups,
    {
      loading: loadingTheBackups,
      data: theBackupsData,
      error: theBackupsError,
      fetchMore: fetchMoreTheBackups,
    },
  ] = useLazyQuery(GET_THE_BACKUPS, {
    variables: { theBackupFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getTheBackups();
  }, [theBackupFilter, paginator]);

  const [deleteTheBackup, { loading: loadingDelete }] = useMutation(DELETE_THE_BACKUP, {
    onCompleted: (datas) => {
      if (datas.deleteTheBackup.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteTheBackup.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteTheBackup } }) {
      console.log('Updating cache after deletion:', deleteTheBackup);

      const deletedTheBackupId = deleteTheBackup.id;

      cache.modify({
        fields: {
          theBackups(existingTheBackups = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedTheBackups = existingTheBackups.nodes.filter(
              (theBackup) => readField('id', theBackup) !== deletedTheBackupId,
            );

            console.log('Updated theBackups:', updatedTheBackups);

            return {
              totalCount: existingTheBackups.totalCount - 1,
              nodes: updatedTheBackups,
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

  const onDeleteTheBackup = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteTheBackup({ variables: { id: id } });
      },
    });
  };

  const [updateTheBackupState, { loading: loadingPutState }] = useMutation(
    PUT_THE_BACKUP_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateTheBackupState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateTheBackupState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_THE_BACKUPS }],
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

  const onUpdateTheBackupState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTheBackupState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/informatique/sauvegardes/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une sauvegarde
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TheBackupFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListTheBackups
          loading={loadingTheBackups}
          rows={theBackupsData?.theBackups?.nodes || []}
          onDeleteTheBackup={onDeleteTheBackup}
          onFilterChange={(newFilter) => handleFilterChange({ ...theBackupFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={theBackupsData?.theBackups?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
