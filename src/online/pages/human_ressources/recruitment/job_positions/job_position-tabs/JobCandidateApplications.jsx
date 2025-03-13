import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_JOB_CANDIDATE_APPLICATION } from '../../../../../../_shared/graphql/mutations/JobCandidateApplicationMutations';
import { GET_JOB_CANDIDATE_APPLICATIONS } from '../../../../../../_shared/graphql/queries/JobCandidateApplicationQueries';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobCandidateApplications from '../../job_candidate_applications/TableListJobCandidateApplications';

export default function JobCandidateApplications({jobPosition}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [jobCandidateApplicationFilter, setJobCandidateApplicationFilter] =
    React.useState({jobPositions: [jobPosition?.id]});
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
    variables: {
      jobCandidateApplicationFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getJobCandidateApplications();
  }, [jobCandidateApplicationFilter, paginator]);

  const [deleteJobCandidateApplication, { loading: loadingDelete }] = useMutation(
    DELETE_JOB_CANDIDATE_APPLICATION,
    {
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
            message: `Non Supprimé ! ${datas.deleteJobCandidateApplication.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteJobCandidateApplication } }) {
        console.log('Updating cache after deletion:', deleteJobCandidateApplication);

        const deletedJobCandidateApplicationId = deleteJobCandidateApplication.id;

        cache.modify({
          fields: {
            jobCandidateApplications(
              existingJobCandidateApplications = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobCandidateApplications =
                existingJobCandidateApplications.nodes.filter(
                  (jobCandidateApplication) =>
                    readField('id', jobCandidateApplication) !==
                    deletedJobCandidateApplicationId,
                );

              console.log(
                'Updated jobCandidateApplications:',
                updatedJobCandidateApplications,
              );

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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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
        <TableListJobCandidateApplications
          loading={loadingJobCandidateApplications}
          rows={jobCandidateApplicationsData?.jobCandidateApplications?.nodes || []}
          onDeleteJobCandidateApplication={onDeleteJobCandidateApplication}
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
