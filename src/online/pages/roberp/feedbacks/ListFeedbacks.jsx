import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import FeedbackItemCard from './FeedbackItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_FEEDBACK,
  PUT_FEEDBACK_STATE,
} from '../../../../_shared/graphql/mutations/FeedbackMutations';
import { GET_FEEDBACKS } from '../../../../_shared/graphql/queries/FeedbackQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import FeedbackFilter from './FeedbackFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListFeedbacks from './TableListFeedbacks';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListFeedbacks() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [feedbackFilter, setFeedbackFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setFeedbackFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getFeedbacks,
    {
      loading: loadingFeedbacks,
      data: feedbacksData,
      error: feedbacksError,
      fetchMore: fetchMoreFeedbacks,
    },
  ] = useLazyQuery(GET_FEEDBACKS, {
    variables: { feedbackFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getFeedbacks();
  }, [feedbackFilter, paginator]);
  const [deleteFeedback, { loading: loadingDelete }] = useMutation(
    DELETE_FEEDBACK,
    {
      onCompleted: (datas) => {
        if (datas.deleteFeedback.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteFeedback.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteFeedback } }) {
        console.log('Updating cache after deletion:', deleteFeedback);

        const deletedFeedbackId = deleteFeedback.id;

        cache.modify({
          fields: {
            feedbacks(
              existingFeedbacks = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedFeedbacks = existingFeedbacks.nodes.filter(
                (feedback) => readField('id', feedback) !== deletedFeedbackId,
              );

              console.log('Updated feedbacks:', updatedFeedbacks);

              return {
                totalCount: existingFeedbacks.totalCount - 1,
                nodes: updatedFeedbacks,
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

  const onDeleteFeedback = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteFeedback({ variables: { id: id } });
      },
    });
  };
  const [updateFeedbackState, { loading: loadingPutState }] = useMutation(
    PUT_FEEDBACK_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateFeedbackState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateFeedbackState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_FEEDBACKS }],
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

  const onUpdateFeedbackState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateFeedbackState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/roberp/feedbacks/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un message
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <FeedbackFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {loadingFeedbacks && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {feedbacksData?.feedbacks?.nodes?.length < 1 && !loadingFeedbacks && (
              <Alert severity="warning">Aucun message trouvé.</Alert>
            )}
            {feedbacksData?.feedbacks?.nodes?.map((feedback, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <FeedbackItemCard
                    feedback={feedback}
                    onDeleteFeedback={onDeleteFeedback}
                    onUpdateFeedbackState={onUpdateFeedbackState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListFeedbacks
          loading={loadingFeedbacks}
          rows={feedbacksData?.feedbacks?.nodes || []}
          onDeleteFeedback={onDeleteFeedback}
          onUpdateFeedbackState={onUpdateFeedbackState}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={feedbacksData?.feedbacks?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
