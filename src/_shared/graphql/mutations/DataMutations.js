import { gql } from '@apollo/client';
import { DATA_BASIC_INFOS } from '../fragments/DataFragment';

export const POST_DATA = gql`
  mutation createData(
    $name: String!
    $description: String
    $typeData: String!
  ) {
    createData(name: $name, description: $description, typeData: $typeData) {
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
    $description: String
    $typeData: String!
  ) {
    updateData(
      id: $id
      name: $name
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
