import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import DecisionDocumentItemCard from './DecisionDocumentItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_DECISION_DOCUMENT,
  PUT_DECISION_DOCUMENT_STATE,
} from '../../../../_shared/graphql/mutations/DecisionDocumentMutations';
import { GET_DECISION_DOCUMENTS } from '../../../../_shared/graphql/queries/DecisionDocumentQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import DecisionDocumentFilter from './DecisionDocumentFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListDecisionDocuments from './TableListDecisionDocuments';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListDecisionDocuments() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [decisionDocumentFilter, setDecisionDocumentFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setDecisionDocumentFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getDecisionDocuments,
    {
      loading: loadingDecisionDocuments,
      data: decisionDocumentsData,
      error: decisionDocumentsError,
      fetchMore: fetchMoreDecisionDocuments,
    },
  ] = useLazyQuery(GET_DECISION_DOCUMENTS, {
    variables: { decisionDocumentFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getDecisionDocuments();
  }, [decisionDocumentFilter, paginator]);
  const [deleteDecisionDocument, { loading: loadingDelete }] = useMutation(
    DELETE_DECISION_DOCUMENT,
    {
      onCompleted: (datas) => {
        if (datas.deleteDecisionDocument.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteDecisionDocument.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteDecisionDocument } }) {
        console.log('Updating cache after deletion:', deleteDecisionDocument);

        const deletedDecisionDocumentId = deleteDecisionDocument.id;

        cache.modify({
          fields: {
            decisionDocuments(
              existingDecisionDocuments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedDecisionDocuments = existingDecisionDocuments.nodes.filter(
                (decisionDocument) => readField('id', decisionDocument) !== deletedDecisionDocumentId,
              );

              console.log('Updated decisionDocuments:', updatedDecisionDocuments);

              return {
                totalCount: existingDecisionDocuments.totalCount - 1,
                nodes: updatedDecisionDocuments,
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

  const onDeleteDecisionDocument = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteDecisionDocument({ variables: { id: id } });
      },
    });
  };
  const [updateDecisionDocumentState, { loading: loadingPutState }] = useMutation(
    PUT_DECISION_DOCUMENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateDecisionDocumentState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateDecisionDocumentState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_DECISION_DOCUMENTS }],
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

  const onUpdateDecisionDocumentState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateDecisionDocumentState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/finance/decisions/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une décision
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DecisionDocumentFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingDecisionDocuments && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {decisionDocumentsData?.decisionDocuments?.nodes?.length < 1 && !loadingDecisionDocuments && (
              <Alert severity="warning">Aucune décision trouvé.</Alert>
            )}
            {decisionDocumentsData?.decisionDocuments?.nodes?.map((decisionDocument, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <DecisionDocumentItemCard
                    decisionDocument={decisionDocument}
                    onDeleteDecisionDocument={onDeleteDecisionDocument}
                    onUpdateDecisionDocumentState={onUpdateDecisionDocumentState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListDecisionDocuments
          loading={loadingDecisionDocuments}
          rows={decisionDocumentsData?.decisionDocuments?.nodes || []}
          onDeleteDecisionDocument={onDeleteDecisionDocument}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={decisionDocumentsData?.decisionDocuments?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
