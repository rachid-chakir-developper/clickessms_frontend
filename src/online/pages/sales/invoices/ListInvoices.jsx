import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_INVOICE,
} from '../../../../_shared/graphql/mutations/InvoiceMutations';
import { GET_INVOICES } from '../../../../_shared/graphql/queries/InvoiceQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import InvoiceFilter from './InvoiceFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListInvoices from './TableListInvoices';
import GenerateInvoiceButton from './GenerateInvoiceButton';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListInvoices() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [invoiceFilter, setInvoiceFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setInvoiceFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getInvoices,
    {
      loading: loadingInvoices,
      data: invoicesData,
      error: invoicesError,
      fetchMore: fetchMoreInvoices,
    },
  ] = useLazyQuery(GET_INVOICES, {
    variables: { invoiceFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getInvoices();
  }, [invoiceFilter, paginator]);
  const [deleteInvoice, { loading: loadingDelete }] = useMutation(
    DELETE_INVOICE,
    {
      onCompleted: (datas) => {
        if (datas.deleteInvoice.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteInvoice.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteInvoice } }) {
        console.log('Updating cache after deletion:', deleteInvoice);
        if(deleteInvoice.success){
          const deletedInvoiceId = deleteInvoice.id;

          cache.modify({
            fields: {
              invoices(
                existingInvoices = { totalCount: 0, nodes: [] },
                { readField },
              ) {
                const updatedInvoices = existingInvoices.nodes.filter(
                  (invoice) => readField('id', invoice) !== deletedInvoiceId,
                );

                console.log('Updated invoices:', updatedInvoices);

                return {
                  totalCount: existingInvoices.totalCount - 1,
                  nodes: updatedInvoices,
                };
              },
            },
          });
        }
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

  const onDeleteInvoice = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteInvoice({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <GenerateInvoiceButton label="Ajouter une facture" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <InvoiceFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListInvoices
          loading={loadingInvoices}
          rows={invoicesData?.invoices?.nodes || []}
          onDeleteInvoice={onDeleteInvoice}
          onFilterChange={(newFilter) => handleFilterChange({ ...invoiceFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={invoicesData?.invoices?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
