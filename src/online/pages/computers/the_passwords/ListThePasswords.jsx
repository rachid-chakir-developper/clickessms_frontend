import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_THE_PASSWORD,
  PUT_THE_PASSWORD_STATE,
} from '../../../../_shared/graphql/mutations/ThePasswordMutations';
import { GET_THE_PASSWORDS } from '../../../../_shared/graphql/queries/ThePasswordQueries';
import ThePasswordFilter from './ThePasswordFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListThePasswords from './TableListThePasswords';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListThePasswords() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [thePasswordFilter, setThePasswordFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setThePasswordFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getThePasswords,
    {
      loading: loadingThePasswords,
      data: thePasswordsData,
      error: thePasswordsError,
      fetchMore: fetchMoreThePasswords,
    },
  ] = useLazyQuery(GET_THE_PASSWORDS, {
    variables: { thePasswordFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getThePasswords();
  }, [thePasswordFilter, paginator]);

  const [deleteThePassword, { loading: loadingDelete }] = useMutation(DELETE_THE_PASSWORD, {
    onCompleted: (datas) => {
      if (datas.deleteThePassword.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteThePassword.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteThePassword } }) {
      console.log('Updating cache after deletion:', deleteThePassword);

      const deletedThePasswordId = deleteThePassword.id;

      cache.modify({
        fields: {
          thePasswords(existingThePasswords = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedThePasswords = existingThePasswords.nodes.filter(
              (thePassword) => readField('id', thePassword) !== deletedThePasswordId,
            );

            console.log('Updated thePasswords:', updatedThePasswords);

            return {
              totalCount: existingThePasswords.totalCount - 1,
              nodes: updatedThePasswords,
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

  const onDeleteThePassword = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteThePassword({ variables: { id: id } });
      },
    });
  };

  const [updateThePasswordState, { loading: loadingPutState }] = useMutation(
    PUT_THE_PASSWORD_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateThePasswordState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateThePasswordState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_THE_PASSWORDS }],
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

  const onUpdateThePasswordState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateThePasswordState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/informatique/mots-de-passe/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un mots de passe
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ThePasswordFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListThePasswords
          loading={loadingThePasswords}
          rows={thePasswordsData?.thePasswords?.nodes || []}
          onDeleteThePassword={onDeleteThePassword}
          onFilterChange={(newFilter) => handleFilterChange({ ...thePasswordFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={thePasswordsData?.thePasswords?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
