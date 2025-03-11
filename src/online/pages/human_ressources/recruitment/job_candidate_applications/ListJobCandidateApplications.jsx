import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_JOB_CANDIDATE,
} from '../../../../../_shared/graphql/mutations/JobCandidateMutations';
import { GET_JOB_CANDIDATES } from '../../../../../_shared/graphql/queries/JobCandidateQueries';
import JobCandidateFilter from './JobCandidateFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobCandidates from './TableListJobCandidates';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListJobCandidates() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [jobCandidateFilter, setJobCandidateFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setJobCandidateFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getJobCandidates,
    {
      loading: loadingJobCandidates,
      data: jobCandidatesData,
      error: jobCandidatesError,
      fetchMore: fetchMoreJobCandidates,
    },
  ] = useLazyQuery(GET_JOB_CANDIDATES, {
    variables: { jobCandidateFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getJobCandidates();
  }, [jobCandidateFilter, paginator]);

  const [deleteJobCandidate, { loading: loadingDelete }] = useMutation(DELETE_JOB_CANDIDATE, {
    onCompleted: (datas) => {
      if (datas.deleteJobCandidate.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteJobCandidate.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteJobCandidate } }) {
      console.log('Updating cache after deletion:', deleteJobCandidate);

      const deletedJobCandidateId = deleteJobCandidate.id;

      cache.modify({
        fields: {
          jobCandidates(existingJobCandidates = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedJobCandidates = existingJobCandidates.nodes.filter(
              (jobCandidate) => readField('id', jobCandidate) !== deletedJobCandidateId,
            );

            console.log('Updated jobCandidates:', updatedJobCandidates);

            return {
              totalCount: existingJobCandidates.totalCount - 1,
              nodes: updatedJobCandidates,
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

  const onDeleteJobCandidate = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteJobCandidate({ variables: { id: id } });
      },
    });
  };



  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ressources-humaines/recrutement/vivier-candidats/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un candidat
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <JobCandidateFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListJobCandidates
          loading={loadingJobCandidates}
          rows={jobCandidatesData?.jobCandidates?.nodes || []}
          onDeleteJobCandidate={onDeleteJobCandidate}
          onFilterChange={(newFilter) => handleFilterChange({ ...jobCandidateFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={jobCandidatesData?.jobCandidates?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
