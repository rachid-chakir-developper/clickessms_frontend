import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_JOB_CANDIDATE_INFORMATION_SHEET,
} from '../../../../../_shared/graphql/mutations/JobCandidateInformationSheetMutations';
import { GET_JOB_CANDIDATE_INFORMATION_SHEETS } from '../../../../../_shared/graphql/queries/JobCandidateInformationSheetQueries';
import JobCandidateInformationSheetFilter from './JobCandidateInformationSheetFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListJobCandidateInformationSheets from './TableListJobCandidateInformationSheets';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListJobCandidateInformationSheets() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [jobCandidateInformationSheetFilter, setJobCandidateInformationSheetFilter] = React.useState(null);
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
    variables: { jobCandidateInformationSheetFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getJobCandidateInformationSheets();
  }, [jobCandidateInformationSheetFilter, paginator]);

  const [deleteJobCandidateInformationSheet, { loading: loadingDelete }] = useMutation(DELETE_JOB_CANDIDATE_INFORMATION_SHEET, {
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
          message: `Non supprimé ! ${datas.deleteJobCandidateInformationSheet.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteJobCandidateInformationSheet } }) {
      console.log('Updating cache after deletion:', deleteJobCandidateInformationSheet);

      const deletedJobCandidateInformationSheetId = deleteJobCandidateInformationSheet.id;

      cache.modify({
        fields: {
          jobCandidateInformationSheets(existingJobCandidateInformationSheets = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedJobCandidateInformationSheets = existingJobCandidateInformationSheets.nodes.filter(
              (jobCandidateInformationSheet) => readField('id', jobCandidateInformationSheet) !== deletedJobCandidateInformationSheetId,
            );

            console.log('Updated jobCandidateInformationSheets:', updatedJobCandidateInformationSheets);

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
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ressources-humaines/recrutement/fiches-renseignement/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un candidat
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <JobCandidateInformationSheetFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListJobCandidateInformationSheets
          loading={loadingJobCandidateInformationSheets}
          rows={jobCandidateInformationSheetsData?.jobCandidateInformationSheets?.nodes || []}
          onDeleteJobCandidateInformationSheet={onDeleteJobCandidateInformationSheet}
          onFilterChange={(newFilter) => handleFilterChange({ ...jobCandidateInformationSheetFilter, ...newFilter })}
          paginator={paginator}
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
