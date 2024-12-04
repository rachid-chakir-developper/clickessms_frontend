import { gql } from '@apollo/client';
import { ACCOUNTING_NATURE_BASIC_INFOS, DATA_BASIC_INFOS } from '../fragments/DataFragment';

export const POST_DATA = gql`
  mutation createData(
    $name: String!
    $code: String
    $description: String
    $typeData: String!
    $parentId: ID
  ) {
    createData(name: $name, code: $code, description: $description, typeData: $typeData, parentId: $parentId) {
      data {
        ...DataBasicInfosFragment
      }
    }
  }
  ${DATA_BASIC_INFOS}
`;
export const PUT_DATA = gql`
  mutation updateData(
    $id: ID!
    $name: String!
    $code: String
    $description: String
    $typeData: String!
  ) {
    updateData(
      id: $id
      name: $name
      code: $code, 
      description: $description
      typeData: $typeData
    ) {
      data {
        ...DataBasicInfosFragment
      }
    }
  }
  ${DATA_BASIC_INFOS}
`;

export const DELETE_DATA = gql`
  mutation deleteData($id: ID!, $typeData: String!) {
    deleteData(id: $id, typeData: $typeData) {
      deleted
    }
  }
`;

export const IMPORT_DATAS = gql`
  mutation importData($entity: String!, $file : Upload!, $fields: [String!]!){
    importData(entity: $entity, file: $file, fields: $fields) {
      success
      done
      count
    }
  }
`;

const EXPORT_DATA_MUTATION = gql`
  mutation exportData($entityName: String!, $fields: [String!]!) {
    exportData(entityName: $entityName, fields: $fields) {
      fileUrl
    }
  }
`;

export const POST_ACCOUNTING_NATURE = gql`
  mutation CreateAccountingNature($accountingNatureData: AccountingNatureInput!) {
    createAccountingNature(accountingNatureData: $accountingNatureData) {
      accountingNature {
        ...AccountingNatureBasicInfosFragment
      }
    }
  }
  ${ACCOUNTING_NATURE_BASIC_INFOS}
`;

export const PUT_ACCOUNTING_NATURE = gql`
  mutation UpdateAccountingNature(
    $id: ID!
    $accountingNatureData: AccountingNatureInput!
  ) {
    updateAccountingNature(id: $id, accountingNatureData: $accountingNatureData) {
      accountingNature {
        ...AccountingNatureBasicInfosFragment
      }
    }
  }
  ${ACCOUNTING_NATURE_BASIC_INFOS}
`;

export const PUT_ACCOUNTING_NATURE_STATE = gql`
  mutation UpdateAccountingNatureState($id: ID!) {
    updateAccountingNatureState(id: $id) {
      done
      success
      message
      accountingNature {
        ...AccountingNatureBasicInfosFragment
      }
    }
  }
  ${ACCOUNTING_NATURE_BASIC_INFOS}
`;


export const DELETE_ACCOUNTING_NATURE = gql`
  mutation DeleteAccountingNature($id: ID!) {
    deleteAccountingNature(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;