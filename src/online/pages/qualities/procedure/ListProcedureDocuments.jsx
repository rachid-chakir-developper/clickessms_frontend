import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_FRAME_DOCUMENT } from '../../../../_shared/graphql/mutations/FrameDocumentMutations';
import { GET_FRAME_DOCUMENTS } from '../../../../_shared/graphql/queries/FrameDocumentQueries';
import FrameDocumentFilter from './ProcedureDocumentFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListFrameDocuments from './TableListProcedureDocuments';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListFrameDocuments() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageAdministrative = authorizationSystem.requestAuthorization({
    type: 'manageAdministrative',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [frameDocumentFilter, setFrameDocumentFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setFrameDocumentFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getFrameDocuments,
    {
      loading: loadingFrameDocuments,
      data: frameDocumentsData,
      error: frameDocumentsError,
      fetchMore: fetchMoreFrameDocuments,
    },
  ] = useLazyQuery(GET_FRAME_DOCUMENTS, {
    variables: {
      frameDocumentFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getFrameDocuments();
  }, [frameDocumentFilter, paginator]);

  const [deleteFrameDocument, { loading: loadingDelete }] = useMutation(
    DELETE_FRAME_DOCUMENT,
    {
      onCompleted: (datas) => {
        if (datas.deleteFrameDocument.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteFrameDocument.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteFrameDocument } }) {
        console.log('Updating cache after deletion:', deleteFrameDocument);

        const deletedFrameDocumentId = deleteFrameDocument.id;

        cache.modify({
          fields: {
            frameDocuments(
              existingFrameDocuments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedFrameDocuments = existingFrameDocuments.nodes.filter(
                (frameDocument) => readField('id', frameDocument) !== deletedFrameDocumentId,
              );

              console.log('Updated frameDocuments:', updatedFrameDocuments);

              return {
                totalCount: existingFrameDocuments.totalCount - 1,
                nodes: updatedFrameDocuments,
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

  const onDeleteFrameDocument = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteFrameDocument({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      {canManageAdministrative && <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/administratif/documents-trames/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un document
            </Button>
          </Link>
        </Box>
      </Grid>}
      <Grid item xs={12}>
        <FrameDocumentFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListFrameDocuments
          loading={loadingFrameDocuments}
          rows={frameDocumentsData?.frameDocuments?.nodes || []}
          onDeleteFrameDocument={onDeleteFrameDocument}
          onFilterChange={(newFilter) => handleFilterChange({ ...frameDocumentFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={frameDocumentsData?.frameDocuments?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
