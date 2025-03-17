import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_JOB_CANDIDATE_INFORMATION_SHEET } from '../../../../../../_shared/graphql/mutations/JobCandidateInformationSheetMutations';
import { GET_JOB_CANDIDATE_INFORMATION_SHEETS } from '../../../../../../_shared/graphql/queries/JobCandidateInformationSheetQueries';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobCandidateInformationSheets from '../../job_candidate_information_sheets/TableListJobCandidateInformationSheets';

export default function JobCandidateInformationSheets({jobCandidate}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [jobCandidateInformationSheetFilter, setJobCandidateInformationSheetFilter] =
    React.useState({jobCandidates: [jobCandidate?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setJobCandidateInformationSheetFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getJobCandidateInformationSheets,
    {
      loading: loadingJobCandidateInformationSheets,
      data: jobCandidateInformationSheetsData,
      error: jobCandidateInformationSheetsError,
      fetchMore: fetchMoreJobCandidateInformationSheets,
    },
  ] = useLazyQuery(GET_JOB_CANDIDATE_INFORMATION_SHEETS, {
    variables: {
      jobCandidateInformationSheetFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getJobCandidateInformationSheets();
  }, [jobCandidateInformationSheetFilter, paginator]);

  const [deleteJobCandidateInformationSheet, { loading: loadingDelete }] = useMutation(
    DELETE_JOB_CANDIDATE_INFORMATION_SHEET,
    {
      onCompleted: (datas) => {
        if (datas.deleteJobCandidateInformationSheet.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteJobCandidateInformationSheet.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteJobCandidateInformationSheet } }) {
        console.log('Updating cache after deletion:', deleteJobCandidateInformationSheet);

        const deletedJobCandidateInformationSheetId = deleteJobCandidateInformationSheet.id;

        cache.modify({
          fields: {
            jobCandidateInformationSheets(
              existingJobCandidateInformationSheets = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedJobCandidateInformationSheets =
                existingJobCandidateInformationSheets.nodes.filter(
                  (jobCandidateInformationSheet) =>
                    readField('id', jobCandidateInformationSheet) !==
                    deletedJobCandidateInformationSheetId,
                );

              console.log(
                'Updated jobCandidateInformationSheets:',
                updatedJobCandidateInformationSheets,
              );

              return {
                totalCount: existingJobCandidateInformationSheets.totalCount - 1,
                nodes: updatedJobCandidateInformationSheets,
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

  const onDeleteJobCandidateInformationSheet = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteJobCandidateInformationSheet({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListJobCandidateInformationSheets
          loading={loadingJobCandidateInformationSheets}
          rows={jobCandidateInformationSheetsData?.jobCandidateInformationSheets?.nodes || []}
          onDeleteJobCandidateInformationSheet={onDeleteJobCandidateInformationSheet}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={jobCandidateInformationSheetsData?.jobCandidateInformationSheets?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
