import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_JOB_POSTING } from '../../../../../../_shared/graphql/mutations/JobPostingMutations';
import { GET_JOB_POSTINGS } from '../../../../../../_shared/graphql/queries/JobPostingQueries';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobPostings from '../../job_postings/TableListJobPostings';

export default function JobPostings({jobPosition}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [jobPostingFilter, setJobPostingFilter] =
    React.useState({jobPositions: [jobPosition?.id]});
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
    variables: {
      jobPostingFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getJobPostings();
  }, [jobPostingFilter, paginator]);

  const [deleteJobPosting, { loading: loadingDelete }] = useMutation(
    DELETE_JOB_POSTING,
    {
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
            message: `Non Supprimé ! ${datas.deleteJobPosting.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteJobPosting } }) {
        console.log('Updating cache after deletion:', deleteJobPosting);

        const deletedJobPostingId = deleteJobPosting.id;

        cache.modify({
          fields: {
            jobPostings(
              existingJobPostings = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobPostings =
                existingJobPostings.nodes.filter(
                  (jobPosting) =>
                    readField('id', jobPosting) !==
                    deletedJobPostingId,
                );

              console.log(
                'Updated jobPostings:',
                updatedJobPostings,
              );

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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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
        <TableListJobPostings
          loading={loadingJobPostings}
          rows={jobPostingsData?.jobPostings?.nodes || []}
          onDeleteJobPosting={onDeleteJobPosting}
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
