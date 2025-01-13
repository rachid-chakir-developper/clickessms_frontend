import * as React from 'react';
import { Box } from '@mui/material';
import { Cancel, Block, HourglassEmpty, CheckCircle, HourglassTop, Error, Send, Receipt, Payment, Euro } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { PUT_INVOICE_FIELDS } from '../../../../_shared/graphql/mutations/InvoiceMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function InvoiceStatusLabelMenu({invoice, disabled}) {
  const { setConfirmDialog } = useFeedBacks();

    const canSeeStatus = (status)=>{
      switch (status) {
        case 'DRAFT':
          return ['DRAFT'].includes(invoice.status)
          break;
        case 'VALIDATED':
          return ['DRAFT'].includes(invoice.status)
          break;
        case 'PARTIALLY_PAID':
          return ['VALIDATED'].includes(invoice.status) && false
          break;
        case 'PAID':
          return ['VALIDATED', 'PARTIALLY_PAID', 'PAID'].includes(invoice.status)
          break;
      
        default:
          return true
      }
    }
    const INVOICE_STATUS = [
        { value: 'DRAFT', label: 'Brouillon', icon: <HourglassEmpty />, color: 'default', hidden: !canSeeStatus('DRAFT') },
        { value: 'VALIDATED', label: 'Validée', icon: <CheckCircle />, color: 'info', hidden: !canSeeStatus('VALIDATED') }, // Couleur pour Validé
        { value: 'PARTIALLY_PAID', label: 'Semi Réglée', icon: <Payment />, color: 'warning', hidden: !canSeeStatus('PARTIALLY_PAID') }, // Couleur pour Semi Réglée
        { value: 'PAID', label: 'Réglée', icon: <Euro />, color: 'success', hidden: !canSeeStatus('PAID') },
        // { value: 'CANCELED', label: 'Annulée', icon: <Block />, color: 'error', hidden: true },
    ];

    const [updateInvoiceFields, { loading: loadingPut }] = useMutation(PUT_INVOICE_FIELDS, {
      onCompleted: (data) => {
        // console.log(data);
      },
      update(cache, { data: { updateInvoiceFields } }) {
        const updatedInvoice = updateInvoiceFields.invoice;
  
        cache.modify({
          fields: {
            invoices(
              existingInvoices = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedInvoices = existingInvoices.nodes.map((invoice) =>
                readField('id', invoice) === updatedInvoice.id
                  ? updatedInvoice
                  : invoice,
              );
  
              return {
                totalCount: existingInvoices.totalCount,
                nodes: updatedInvoices,
              };
            },
          },
        });
      },
    });
    
  const onUpdateInvoiceFields = (input) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateInvoiceFields(input);
      },
    });
  };

  return (
    <Box>
        <CustomizedStatusLabelMenu
            options={INVOICE_STATUS}
            status={invoice?.status}
            type="invoice"
            loading={loadingPut}
            onChange={(status)=> onUpdateInvoiceFields({ variables: {id: invoice?.id, invoiceData: {status}} })}
            disabled={disabled || invoice.status==='PAID'}
        />
    </Box>
  );
}