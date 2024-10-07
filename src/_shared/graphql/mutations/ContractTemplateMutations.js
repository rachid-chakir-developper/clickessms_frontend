import { gql } from '@apollo/client';
import { CONTRACT_TEMPLATE_BASIC_INFOS } from '../fragments/ContractTemplateFragment';

export const CONTRACT_TEMPLATE_CONTRACT_TEMPLATE = gql`
  mutation CreateContractTemplate(
    $contractTemplateData: ContractTemplateInput!, $image: Upload
  ) {
    createContractTemplate(
      contractTemplateData: $contractTemplateData, image: $image
    ) {
      contractTemplate {
        ...ContractTemplateBasicInfosFragment
      }
    }
  }
  ${CONTRACT_TEMPLATE_BASIC_INFOS}
`;

export const PUT_CONTRACT_TEMPLATE = gql`
  mutation UpdateContractTemplate(
    $id: ID!
    $contractTemplateData: ContractTemplateInput!, $image: Upload
  ) {
    updateContractTemplate(
      id: $id
      contractTemplateData: $contractTemplateData, image: $image
    ) {
      contractTemplate {
        ...ContractTemplateBasicInfosFragment
      }
    }
  }
  ${CONTRACT_TEMPLATE_BASIC_INFOS}
`;

export const PUT_CONTRACT_TEMPLATE_STATE = gql`
  mutation UpdateContractTemplateState($id: ID!) {
    updateContractTemplateState(id: $id) {
      done
      success
      message
      contractTemplate {
        ...ContractTemplateBasicInfosFragment
      }
    }
  }
  ${CONTRACT_TEMPLATE_BASIC_INFOS}
`;

export const GENERATE_CONTRACT_CONTENT = gql`
  mutation GenerateContractContent($employeeContractId: ID!, $contractTemplateId: ID!) {
    generateContractContent(employeeContractId: $employeeContractId, contractTemplateId: $contractTemplateId) {
        success
        message
        contractContent

    }
  }
`;



export const DELETE_CONTRACT_TEMPLATE = gql`
  mutation DeleteContractTemplate($id: ID!) {
    deleteContractTemplate(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
