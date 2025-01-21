import { gql } from '@apollo/client';
import { BENEFICIARY_EXPENSE_BASIC_INFOS } from '../fragments/BeneficiaryExpenseFragment';

export const POST_BENEFICIARY_EXPENSE = gql`
  mutation CreateBeneficiaryExpense(
    $beneficiaryExpenseData: BeneficiaryExpenseInput!
    $files : [MediaInput]
    ) {
    createBeneficiaryExpense(beneficiaryExpenseData: $beneficiaryExpenseData, files: $files) {
      beneficiaryExpense {
        ...BeneficiaryExpenseBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_EXPENSE = gql`
  mutation UpdateBeneficiaryExpense(
    $id: ID!
    $beneficiaryExpenseData: BeneficiaryExpenseInput!
    $files : [MediaInput]
  ) {
    updateBeneficiaryExpense(id: $id, beneficiaryExpenseData: $beneficiaryExpenseData, files: $files) {
      beneficiaryExpense {
        ...BeneficiaryExpenseBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;

export const PUT_BENEFICIARY_EXPENSE_STATE = gql`
  mutation UpdateBeneficiaryExpenseState($id: ID!) {
    updateBeneficiaryExpenseState(id: $id) {
      done
      success
      message
      beneficiaryExpense {
        ...BeneficiaryExpenseBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_EXPENSE_BASIC_INFOS}
`;

export const DELETE_BENEFICIARY_EXPENSE = gql`
  mutation DeleteBeneficiaryExpense($id: ID!) {
    deleteBeneficiaryExpense(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
