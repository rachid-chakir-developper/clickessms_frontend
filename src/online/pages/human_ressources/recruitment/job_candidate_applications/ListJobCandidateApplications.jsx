import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_JOB_CANDIDATE_APPLICATION,
} from '../../../../../_shared/graphql/mutations/JobCandidateApplicationMutations';
import { GET_JOB_CANDIDATE_APPLICATIONS } from '../../../../../_shared/graphql/queries/JobCandidateApplicationQueries';
import JobCandidateApplicationFilter from './JobCandidateApplicationFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobCandidateApplications from './TableListJobCandidateApplications';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListJobCandidateApplications() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [jobCandidateApplicationFilter, setJobCandidateApplicationFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setJobCandidateApplicationFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getJobCandidateApplications,
    {
      loading: loadingJobCandidateApplications,
      data: jobCandidateApplicationsData,
      error: jobCandidateApplicationsError,
      fetchMore: fetchMoreJobCandidateApplications,
    },
  ] = useLazyQuery(GET_JOB_CANDIDATE_APPLICATIONS, {
    variables: { jobCandidateApplicationFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getJobCandidateApplications();
  }, [jobCandidateApplicationFilter, paginator]);

  const [deleteJobCandidateApplication, { loading: loadingDelete }] = useMutation(DELETE_JOB_CANDIDATE_APPLICATION, {
    onCompleted: (datas) => {
      if (datas.deleteJobCandidateApplication.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteJobCandidateApplication.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteJobCandidateApplication } }) {
      console.log('Updating cache after deletion:', deleteJobCandidateApplication);

      const deletedJobCandidateApplicationId = deleteJobCandidateApplication.id;

      cache.modify({
        fields: {
          jobCandidateApplications(existingJobCandidateApplications = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedJobCandidateApplications = existingJobCandidateApplications.nodes.filter(
              (jobCandidateApplication) => readField('id', jobCandidateApplication) !== deletedJobCandidateApplicationId,
            );

            console.log('Updated jobCandidateApplications:', updatedJobCandidateApplications);

            return {
              totalCount: existingJobCandidateApplications.totalCount - 1,
              nodes: updatedJobCandidateApplications,
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

  const onDeleteJobCandidateApplication = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteJobCandidateApplication({ variables: { id: id } });
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
        <JobCandidateApplicationFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListJobCandidateApplications
          loading={loadingJobCandidateApplications}
          rows={jobCandidateApplicationsData?.jobCandidateApplications?.nodes || []}
          onDeleteJobCandidateApplication={onDeleteJobCandidateApplication}
          onFilterChange={(newFilter) => handleFilterChange({ ...jobCandidateApplicationFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={jobCandidateApplicationsData?.jobCandidateApplications?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
