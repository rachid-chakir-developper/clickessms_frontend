import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_SOFTWARE,
  PUT_SOFTWARE_STATE,
} from '../../../../_shared/graphql/mutations/SoftwareMutations';
import { GET_SOFTWARES } from '../../../../_shared/graphql/queries/SoftwareQueries';
import SoftwareFilter from './SoftwareFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListSoftwares from './TableListSoftwares';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListSoftwares() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [softwareFilter, setSoftwareFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setSoftwareFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getSoftwares,
    {
      loading: loadingSoftwares,
      data: softwaresData,
      error: softwaresError,
      fetchMore: fetchMoreSoftwares,
    },
  ] = useLazyQuery(GET_SOFTWARES, {
    variables: { softwareFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getSoftwares();
  }, [softwareFilter, paginator]);

  const [deleteSoftware, { loading: loadingDelete }] = useMutation(DELETE_SOFTWARE, {
    onCompleted: (datas) => {
      if (datas.deleteSoftware.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteSoftware.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteSoftware } }) {
      console.log('Updating cache after deletion:', deleteSoftware);

      const deletedSoftwareId = deleteSoftware.id;

      cache.modify({
        fields: {
          softwares(existingSoftwares = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedSoftwares = existingSoftwares.nodes.filter(
              (software) => readField('id', software) !== deletedSoftwareId,
            );

            console.log('Updated softwares:', updatedSoftwares);

            return {
              totalCount: existingSoftwares.totalCount - 1,
              nodes: updatedSoftwares,
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

  const onDeleteSoftware = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteSoftware({ variables: { id: id } });
      },
    });
  };

  const [updateSoftwareState, { loading: loadingPutState }] = useMutation(
    PUT_SOFTWARE_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateSoftwareState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateSoftwareState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_SOFTWARES }],
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

  const onUpdateSoftwareState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSoftwareState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/informatique/logiciels/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un logiciel
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <SoftwareFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListSoftwares
          loading={loadingSoftwares}
          rows={softwaresData?.softwares?.nodes || []}
          onDeleteSoftware={onDeleteSoftware}
          onFilterChange={(newFilter) => handleFilterChange({ ...softwareFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={softwaresData?.softwares?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
