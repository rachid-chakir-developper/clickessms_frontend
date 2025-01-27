// EndowmentPaymentFragment.js

import { gql } from '@apollo/client';
import { BENEFICIARY_MINI_INFOS } from './BeneficiaryFragment';
import { EMPLOYEE_MINI_INFOS } from './EmployeeFragment';
import { BANK_CARD_MINI_INFOS } from './BankCardFragment';
import { CASH_REGISTER_MINI_INFOS } from './CashRegisterFragment';
import { ENDOWMENT_MINI_INFOS } from './EndowmentFragment';

export const ENDOWMENT_PAYMENT_BASIC_INFOS = gql`
  fragment EndowmentPaymentBasicInfosFragment on EndowmentPaymentType {
    id
    number
    label
    endowmentType{
      id
      name
    }
    endowment{
      ...EndowmentMiniInfosFragment
    }
    amount
    date
    paymentMethod
    checkNumber
    bankName
    status
    description
    comment
    observation
    employee{
        ...EmployeeMiniInfosFragment
    }
    beneficiary{
        ...BeneficiaryMiniInfosFragment
    }
    bankCard{
      ...BankCardMiniInfosFragment
    }
    cashRegister{
      ...CashRegisterMiniInfosFragment
    }
    folder {
      id
      number
      name
    }
  }
  ${ENDOWMENT_MINI_INFOS}
  ${EMPLOYEE_MINI_INFOS}
  ${BENEFICIARY_MINI_INFOS}
  ${BANK_CARD_MINI_INFOS}
  ${CASH_REGISTER_MINI_INFOS}
`;

export const ENDOWMENT_PAYMENT_DETAILS = gql`
  fragment EndowmentPaymentDetailsFragment on EndowmentPaymentType {
    ...EndowmentPaymentBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;


export const ENDOWMENT_PAYMENT_RECAP_DETAILS = gql`
  fragment EndowmentPaymentRecapDetailsFragment on EndowmentPaymentType {
    ...EndowmentPaymentBasicInfosFragment
    files {
      id
      caption
      file
      createdAt
      updatedAt
    }
    createdAt,
    updatedAt,
  }
  ${ENDOWMENT_PAYMENT_BASIC_INFOS}
`;
