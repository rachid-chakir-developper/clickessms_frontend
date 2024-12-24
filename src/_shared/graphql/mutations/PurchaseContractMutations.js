import { gql } from '@apollo/client';
import { PURCHASE_CONTRACT_BASIC_INFOS } from '../fragments/PurchaseContractFragment';

export const POST_PURCHASE_CONTRACT = gql`
  mutation CreatePurchaseContract(
    $purchaseContractData: PurchaseContractInput!, $image: Upload
  ) {
    createPurchaseContract(
      purchaseContractData: $purchaseContractData, image: $image
    ) {
      purchaseContract {
        ...PurchaseContractBasicInfosFragment
      }
    }
  }
  ${PURCHASE_CONTRACT_BASIC_INFOS}
`;

export const PUT_PURCHASE_CONTRACT = gql`
  mutation UpdatePurchaseContract(
    $id: ID!
    $purchaseContractData: PurchaseContractInput!, $image: Upload
  ) {
    updatePurchaseContract(
      id: $id
      purchaseContractData: $purchaseContractData, image: $image
    ) {
      purchaseContract {
        ...PurchaseContractBasicInfosFragment
      }
    }
  }
  ${PURCHASE_CONTRACT_BASIC_INFOS}
`;

export const PUT_PURCHASE_CONTRACT_STATE = gql`
  mutation UpdatePurchaseContractState($id: ID!) {
    updatePurchaseContractState(id: $id) {
      done
      success
      message
      purchaseContract {
        ...PurchaseContractBasicInfosFragment
      }
    }
  }
  ${PURCHASE_CONTRACT_BASIC_INFOS}
`;

export const DELETE_PURCHASE_CONTRACT = gql`
  mutation DeletePurchaseContract($id: ID!) {
    deletePurchaseContract(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
