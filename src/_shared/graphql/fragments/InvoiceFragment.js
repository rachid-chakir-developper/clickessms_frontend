// InvoiceFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { FINANCIER_MINI_INFOS } from './FinancierFragment';


export const INVOICE_MINI_INFOS = gql`
  fragment InvoiceMiniInfosFragment on InvoiceType {
    id
    number
    title
    status
    invoiceType
  }
`;

export const INVOICE_BASIC_INFOS = gql`
  fragment InvoiceBasicInfosFragment on InvoiceType {
    ...InvoiceMiniInfosFragment
    description
    emissionDate
    dueDate
    financier{
    ...FinancierMiniInfosFragment
    }
    establishment{
      ...EstablishmentMiniInfosFragment
    }
    establishmentTvaNumber
    establishmentName
    establishmentInfos
    establishmentAddress
    clientTvaNumber
    clientName
    clientInfos
    clientAddress
    paymentMethod
    totalHt
    tva
    discount
    totalTtc
  }
  ${INVOICE_MINI_INFOS}
  ${FINANCIER_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
`;


export const INVOICE_ITEM_DETAILS = gql`
    fragment InvoiceItemFragment on InvoiceItemType {
        beneficiary{
            ...BeneficiaryMiniInfosFragment
        }
        establishment{
            ...EstablishmentMiniInfosFragment
        }
        establishmentName
        preferredName
        firstName
        lastName
        birthDate
        entryDate
        releaseDate
        description
        unitPrice
        quantity
        tva
        discount
        amountHt
        amountTtc
    }
    ${BENEFICIARY_MINI_INFOS}
    ${ESTABLISHMENT_MINI_INFOS}
`;

export const INVOICE_DETAILS = gql`
  fragment InvoiceDetailsFragment on InvoiceType {
    ...InvoiceBasicInfosFragment
    invoiceItems{
      ...InvoiceItemFragment
    }
  }
  ${INVOICE_BASIC_INFOS}
  ${INVOICE_ITEM_DETAILS}
`;

export const INVOICE_RECAP = gql`
  fragment InvoiceRecapFragment on InvoiceType {
    ...InvoiceBasicInfosFragment
    invoiceItems{
      ...InvoiceItemFragment
    }
    createdAt
    updatedAt
  }
  ${INVOICE_BASIC_INFOS}
  ${INVOICE_ITEM_DETAILS}
`;