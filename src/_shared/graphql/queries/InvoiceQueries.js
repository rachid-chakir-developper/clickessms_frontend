import { gql } from '@apollo/client';
import {
  INVOICE_BASIC_INFOS,
  INVOICE_DETAILS,
  INVOICE_RECAP,
} from '../fragments/InvoiceFragment';

export const GET_INVOICE = gql`
  query GetInvoice($id: ID!) {
    invoice(id: $id) {
      ...InvoiceDetailsFragment
    }
  }
  ${INVOICE_DETAILS}
`;

export const GET_INVOICES = gql`
  query GetInvoices(
    $invoiceFilter: InvoiceFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    invoices(
      invoiceFilter: $invoiceFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...InvoiceBasicInfosFragment
      }
    }
  }
  ${INVOICE_BASIC_INFOS}
`;

export const GET_INVOICE_RECAP = gql`
  query GetInvoice($id: ID!) {
    invoice(id: $id) {
      ...InvoiceRecapFragment
    }
  }
  ${INVOICE_RECAP}
`;

// Add more invoice-related queries here