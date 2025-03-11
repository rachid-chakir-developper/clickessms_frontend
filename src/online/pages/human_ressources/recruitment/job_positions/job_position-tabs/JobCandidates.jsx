import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_JOB_CANDIDATE } from '../../../../../../_shared/graphql/mutations/JobCandidateMutations';
import { GET_JOB_CANDIDATES } from '../../../../../../_shared/graphql/queries/JobCandidateQueries';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobCandidates from '../../job_candidates/TableListJobCandidates';

export default function JobCandidates({jobPosition}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [jobCandidateFilter, setJobCandidateFilter] =
    React.useState({jobPositions: [jobPosition?.id]});
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
    variables: {
      jobCandidateFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getJobCandidates();
  }, [jobCandidateFilter, paginator]);

  const [deleteJobCandidate, { loading: loadingDelete }] = useMutation(
    DELETE_JOB_CANDIDATE,
    {
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
            message: `Non Supprimé ! ${datas.deleteJobCandidate.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteJobCandidate } }) {
        console.log('Updating cache after deletion:', deleteJobCandidate);

        const deletedJobCandidateId = deleteJobCandidate.id;

        cache.modify({
          fields: {
            jobCandidates(
              existingJobCandidates = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobCandidates =
                existingJobCandidates.nodes.filter(
                  (jobCandidate) =>
                    readField('id', jobCandidate) !==
                    deletedJobCandidateId,
                );

              console.log(
                'Updated jobCandidates:',
                updatedJobCandidates,
              );

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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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
        <TableListJobCandidates
          loading={loadingJobCandidates}
          rows={jobCandidatesData?.jobCandidates?.nodes || []}
          onDeleteJobCandidate={onDeleteJobCandidate}
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
