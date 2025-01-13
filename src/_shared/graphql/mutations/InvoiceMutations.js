import { gql } from '@apollo/client';
import { INVOICE_BASIC_INFOS } from '../fragments/InvoiceFragment';

export const POST_INVOICE = gql`
  mutation CreateInvoice($invoiceData: InvoiceInput!) {
    createInvoice(invoiceData: $invoiceData) {
      invoice {
        ...InvoiceBasicInfosFragment
      }
    }
  }
  ${INVOICE_BASIC_INFOS}
`;

export const PUT_INVOICE = gql`
  mutation UpdateInvoice(
    $id: ID!
    $invoiceData: InvoiceInput!
  ) {
    updateInvoice(id: $id, invoiceData: $invoiceData) {
      invoice {
        ...InvoiceBasicInfosFragment
      }
    }
  }
  ${INVOICE_BASIC_INFOS}
`;


export const PUT_INVOICE_FIELDS = gql`
  mutation UpdateInvoiceFields($id: ID!, $invoiceData: InvoiceInput!) {
    updateInvoiceFields(id: $id, invoiceData: $invoiceData) {
      done
      success
      message
      invoice {
        ...InvoiceBasicInfosFragment
      }
    }
  }
  ${INVOICE_BASIC_INFOS}
`;



export const GENERATE_INVOICE = gql`
  mutation GenerateInvoice($generateInvoiceData: GenerateInvoiceInput!) {
    generateInvoice(generateInvoiceData: $generateInvoiceData) {
      success
      message
      invoice{
        ...InvoiceBasicInfosFragment
      }
    }
  }
  ${INVOICE_BASIC_INFOS}
`;


export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;