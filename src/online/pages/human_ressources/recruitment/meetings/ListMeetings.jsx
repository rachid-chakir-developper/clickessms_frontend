import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import MeetingItemCard from './MeetingItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_MEETING,
  PUT_MEETING_STATE,
} from '../../../../../_shared/graphql/mutations/MeetingMutations';
import { GET_MEETINGS } from '../../../../../_shared/graphql/queries/MeetingQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import MeetingFilter from './MeetingFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListMeetings from './TableListMeetings';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListMeetings() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [meetingFilter, setMeetingFilter] = React.useState({meetingMode : 'CANDIDATE_INTERVIEW'});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setMeetingFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
    setMeetingFilter({...newFilter, meetingMode : 'CANDIDATE_INTERVIEW'});
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getMeetings,
    {
      loading: loadingMeetings,
      data: meetingsData,
      error: meetingsError,
      fetchMore: fetchMoreMeetings,
    },
  ] = useLazyQuery(GET_MEETINGS, {
    variables: { meetingFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getMeetings();
  }, [paginator]);
  
  const [deleteMeeting, { loading: loadingDelete }] = useMutation(
    DELETE_MEETING,
    {
      onCompleted: (datas) => {
        if (datas.deleteMeeting.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteMeeting.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteMeeting } }) {
        console.log('Updating cache after deletion:', deleteMeeting);

        const deletedMeetingId = deleteMeeting.id;

        cache.modify({
          fields: {
            meetings(
              existingMeetings = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedMeetings = existingMeetings.nodes.filter(
                (meeting) => readField('id', meeting) !== deletedMeetingId,
              );

              console.log('Updated meetings:', updatedMeetings);

              return {
                totalCount: existingMeetings.totalCount - 1,
                nodes: updatedMeetings,
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

  const onDeleteMeeting = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteMeeting({ variables: { id: id } });
      },
    });
  };
  const [updateMeetingState, { loading: loadingPutState }] = useMutation(
    PUT_MEETING_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateMeetingState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateMeetingState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_MEETINGS }],
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

  const onUpdateMeetingState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateMeetingState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/ressources-humaines/recrutement/entretiens/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un entretien
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <MeetingFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListMeetings
          loading={loadingMeetings}
          rows={meetingsData?.meetings?.nodes || []}
          onDeleteMeeting={onDeleteMeeting}
          onFilterChange={(newFilter) => handleFilterChange({ ...meetingFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={meetingsData?.meetings?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
