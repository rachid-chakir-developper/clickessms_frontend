// TaskFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';
import { CLIENT_BASIC_INFOS } from './ClientFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { VEHICLE_BASIC_INFOS } from './VehicleFragment';
import { MATERIAL_BASIC_INFOS } from './MaterialFragment';
import { COMMENT_BASIC_INFOS } from './CommentFragment';
import { FOLDER_MINI_INFOS } from './MediaFragment';

export const TASK_MINI_BASIC_INFOS = gql`
  fragment TaskMiniBasicInfosFragment on TaskType {
    id
    number
    name
    image
  }
`;
export const TASK_BASIC_INFOS = gql`
  fragment TaskBasicInfosFragment on TaskType {
    ...TaskMiniBasicInfosFragment
    description
    startingDateTime
    endingDateTime
    address
    latitude
    longitude
    isActive
    priority
    workLevel
    status
    client{
      ...ClientBasicInfosFragment
    }
    folder{
      ...FolderMiniInfosFragment
    }
  }
  ${TASK_MINI_BASIC_INFOS}
  ${CLIENT_BASIC_INFOS}
  ${FOLDER_MINI_INFOS}
`;

export const TASK_STEP_BASIC_INFOS = gql`
  fragment TaskStepBasicInfosFragment on TaskStepType {
    id
    name
    stepType
    updatedAt
    status
  }
`;

export const TASK_STEP_DETAILS = gql`
  fragment TaskStepDetailsFragment on TaskStepType {
    ...TaskStepBasicInfosFragment
    images{
      id
      caption
      image
      creator{
        ...UserBasicInfosFragment
      }
      createdAt
      updatedAt
    }
    videos{
      id
      caption
      video
      thumbnail
      creator{
        ...UserBasicInfosFragment
      }
      createdAt
      updatedAt
    }
  }
  ${TASK_STEP_BASIC_INFOS}
  ${USER_BASIC_INFOS}
`;

export const TASK_STEP_RECAP_INFOS = gql`
  fragment TaskStepRecapInfosFragment on TaskStepType {
    ...TaskStepDetailsFragment
    comments{
      ...CommentBasicInfosFragment
    }
  }
  ${TASK_STEP_DETAILS}
  ${COMMENT_BASIC_INFOS}
`;

export const TASK_CHECK_LIST_DETAILS = gql`
  fragment TaskChecklistItemFragment on TaskChecklistItemType {
    id
    name
    localisation
    comment
    description
    status
  }
`;

export const TASK_WORKER_DETAILS = gql`
  fragment TaskWorkerTypeFragment on TaskWorkerType {
    id
    employee{
      ...EmployeeBasicInfosFragment
    }
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const TASK_VEHICLE_DETAILS = gql`
  fragment TaskVehicleTypeFragment on TaskVehicleType {
    id
    vehicle{
      ...VehicleBasicInfosFragment
    }
  }
  ${VEHICLE_BASIC_INFOS}
`;

export const TASK_MATERIAL_DETAILS = gql`
  fragment TaskMaterialTypeFragment on TaskMaterialType {
    id
    material{
      ...MaterialBasicInfosFragment
    }
  }
  ${MATERIAL_BASIC_INFOS}
`;

export const TASK_DETAILS = gql`
  fragment TaskDetailsFragment on TaskType {
    ...TaskBasicInfosFragment
    estimatedBudget
    email
    latitude
    longitude
    country
    city
    zipCode
    address
    mobile
    fix
    clientTaskNumber
    clientName
    billingAddress
    contractorName
    contractorTel
    contractorEmail
    receiverName
    receiverTel
    receiverEmail
    siteOwnerName
    siteTenantName
    workersInfos
    vehiclesInfos
    materialsInfos
    comment
    description
    observation
    totalPriceHt
    tva
    discount
    totalPriceTtc
    isDisplayPrice
    isFromQuote
    workers{
      ...TaskWorkerTypeFragment
    }
    vehicles{
      ...TaskVehicleTypeFragment
    }
    materials{
      ...TaskMaterialTypeFragment
    }
    taskChecklist{
      ...TaskChecklistItemFragment
    }
  }
  ${TASK_BASIC_INFOS}
  ${TASK_WORKER_DETAILS}
  ${TASK_VEHICLE_DETAILS}
  ${TASK_MATERIAL_DETAILS}
  ${TASK_CHECK_LIST_DETAILS}
`;

export const SIGNATURE_DETAILS = gql`
  fragment SignatureTypeFragment on SignatureType {
    id
    base64Encoded
    image
    authorName
    authorNumber
    authorEmail
    satisfaction
    comment
    author{
      ...UserBasicInfosFragment
    }
    creator{
      ...UserBasicInfosFragment
    }
    createdAt
    updatedAt
  }
  ${USER_BASIC_INFOS}
`;

export const TASK_RECAP = gql`
  fragment TaskRecapFragment on TaskType {
    ...TaskBasicInfosFragment
    startedAt
    finishedAt
    estimatedBudget
    email
    country
    city
    zipCode
    mobile
    fix
    clientTaskNumber
    clientName
    billingAddress
    contractorName
    contractorTel
    contractorEmail
    receiverName
    receiverTel
    receiverEmail
    siteOwnerName
    siteTenantName
    workersInfos
    vehiclesInfos
    materialsInfos
    comment
    description
    observation
    totalPriceHt
    tva
    discount
    totalPriceTtc
    isDisplayPrice
    isFromQuote
    createdAt
    updatedAt
    workers{
      ...TaskWorkerTypeFragment
    }
    vehicles{
      ...TaskVehicleTypeFragment
    }
    materials{
      ...TaskMaterialTypeFragment
    }
    taskChecklist{
      ...TaskChecklistItemFragment
    }
    taskSteps{
      ...TaskStepRecapInfosFragment
    }
    employeeSignature{
      ...SignatureTypeFragment
    }
    clientSignature{
      ...SignatureTypeFragment
    }
  }
  ${TASK_BASIC_INFOS}
  ${TASK_WORKER_DETAILS}
  ${TASK_VEHICLE_DETAILS}
  ${TASK_MATERIAL_DETAILS}
  ${TASK_CHECK_LIST_DETAILS}
  ${TASK_STEP_RECAP_INFOS}
  ${SIGNATURE_DETAILS}
`;