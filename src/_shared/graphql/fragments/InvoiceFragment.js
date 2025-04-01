// InvoiceFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';
import { FINANCIER_MINI_INFOS } from './FinancierFragment';
import { SIGNATURE_DETAILS } from './FeedbackFragment';


export const INVOICE_MINI_INFOS = gql`
  fragment InvoiceMiniInfosFragment on InvoiceType {
    id
    number
    title
    status
    invoiceType
    year
    month
    monthText
  }
`;

export const INVOICE_BASIC_INFOS = gql`
  fragment InvoiceBasicInfosFragment on InvoiceType {
    ...InvoiceMiniInfosFragment
    emissionDate
    dueDate
    invoiceEstablishments{
      id
      establishment{
        ...EstablishmentMiniInfosFragment
      }
    }
    financier{
    ...FinancierMiniInfosFragment
    }
    financierNumber
    financierName
    financierTvaNumber
    financierInfos
    paymentMethod
    description
    totalHt
    tva
    discount
    totalTtc
  }
  ${INVOICE_MINI_INFOS}
  ${ESTABLISHMENT_MINI_INFOS}
  ${FINANCIER_MINI_INFOS}
`;


export const INVOICE_ITEM_DETAILS = gql`
  fragment InvoiceItemFragment on InvoiceItemType {
    id
    beneficiary{
        ...BeneficiaryMiniInfosFragment
    }
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


export const INVOICE_ESTABLISHMENT_DETAILS  = gql`
  fragment InvoiceEstablishmentFragment on InvoiceEstablishmentType {
    id
    establishment{
      ...EstablishmentMiniInfosFragment
    }
    establishmentNumber
    establishmentName
    establishmentTvaNumber
    establishmentInfos
    establishmentCapacity
	  establishmentUnitPrice
    paymentMethod
    totalHt
    tva
    discount
    totalTtc
    invoiceItems{
      ...InvoiceItemFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
  ${INVOICE_ITEM_DETAILS}
`;

export const INVOICE_DETAILS = gql`
  fragment InvoiceDetailsFragment on InvoiceType {
    ...InvoiceBasicInfosFragment
    invoiceEstablishments{
      ...InvoiceEstablishmentFragment
    }
  }
  ${INVOICE_BASIC_INFOS}
  ${INVOICE_ESTABLISHMENT_DETAILS}
`;

export const INVOICE_RECAP = gql`
  fragment InvoiceRecapFragment on InvoiceType {
    ...InvoiceBasicInfosFragment
    companyName
    companyLogoBase64Encoded
    invoiceEstablishments{
      ...InvoiceEstablishmentFragment
    }
    signatures{
      ...SignatureTypeFragment
    }
    createdAt
    updatedAt
  }
  ${INVOICE_BASIC_INFOS}
  ${SIGNATURE_DETAILS}
  ${INVOICE_ESTABLISHMENT_DETAILS}
`;