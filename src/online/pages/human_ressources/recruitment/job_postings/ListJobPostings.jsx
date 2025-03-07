import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_JOB_POSTING,
} from '../../../../../_shared/graphql/mutations/JobPostingMutations';
import { GET_JOB_POSTINGS } from '../../../../../_shared/graphql/queries/JobPostingQueries';
import JobPostingFilter from './JobPostingFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobPostings from './TableListJobPostings';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListJobPostings() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [jobPostingFilter, setJobPostingFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setJobPostingFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getJobPostings,
    {
      loading: loadingJobPostings,
      data: jobPostingsData,
      error: jobPostingsError,
      fetchMore: fetchMoreJobPostings,
    },
  ] = useLazyQuery(GET_JOB_POSTINGS, {
    variables: { jobPostingFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getJobPostings();
  }, [jobPostingFilter, paginator]);

  const [deleteJobPosting, { loading: loadingDelete }] = useMutation(DELETE_JOB_POSTING, {
    onCompleted: (datas) => {
      if (datas.deleteJobPosting.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteJobPosting.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteJobPosting } }) {
      console.log('Updating cache after deletion:', deleteJobPosting);

      const deletedJobPostingId = deleteJobPosting.id;

      cache.modify({
        fields: {
          jobPostings(existingJobPostings = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedJobPostings = existingJobPostings.nodes.filter(
              (jobPosting) => readField('id', jobPosting) !== deletedJobPostingId,
            );

            console.log('Updated jobPostings:', updatedJobPostings);

            return {
              totalCount: existingJobPostings.totalCount - 1,
              nodes: updatedJobPostings,
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

  const onDeleteJobPosting = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteJobPosting({ variables: { id: id } });
      },
    });
  };



  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ressources-humaines/recrutement/annonces/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un candidat
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <JobPostingFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListJobPostings
          loading={loadingJobPostings}
          rows={jobPostingsData?.jobPostings?.nodes || []}
          onDeleteJobPosting={onDeleteJobPosting}
          onFilterChange={(newFilter) => handleFilterChange({ ...jobPostingFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={jobPostingsData?.jobPostings?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
