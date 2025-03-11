import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_JOB_POSITION,
} from '../../../../../_shared/graphql/mutations/JobPositionMutations';
import { GET_JOB_POSITIONS } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import JobPositionFilter from './JobPositionFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobPositions from './TableListJobPositions';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListJobPositions() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [jobPositionFilter, setJobPositionFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setJobPositionFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getJobPositions,
    {
      loading: loadingJobPositions,
      data: jobPositionsData,
      error: jobPositionsError,
      fetchMore: fetchMoreJobPositions,
    },
  ] = useLazyQuery(GET_JOB_POSITIONS, {
    variables: { jobPositionFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getJobPositions();
  }, [jobPositionFilter, paginator]);

  const [deleteJobPosition, { loading: loadingDelete }] = useMutation(DELETE_JOB_POSITION, {
    onCompleted: (datas) => {
      if (datas.deleteJobPosition.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteJobPosition.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteJobPosition } }) {
      console.log('Updating cache after deletion:', deleteJobPosition);

      const deletedJobPositionId = deleteJobPosition.id;

      cache.modify({
        fields: {
          jobPositions(existingJobPositions = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedJobPositions = existingJobPositions.nodes.filter(
              (jobPosition) => readField('id', jobPosition) !== deletedJobPositionId,
            );

            console.log('Updated jobPositions:', updatedJobPositions);

            return {
              totalCount: existingJobPositions.totalCount - 1,
              nodes: updatedJobPositions,
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

  const onDeleteJobPosition = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteJobPosition({ variables: { id: id } });
      },
    });
  };



  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ressources-humaines/recrutement/fiches-besoin/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une fiche besoin
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <JobPositionFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListJobPositions
          loading={loadingJobPositions}
          rows={jobPositionsData?.jobPositions?.nodes || []}
          onDeleteJobPosition={onDeleteJobPosition}
          onFilterChange={(newFilter) => handleFilterChange({ ...jobPositionFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={jobPositionsData?.jobPositions?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
