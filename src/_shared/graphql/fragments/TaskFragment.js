// TaskFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';
import { CLIENT_BASIC_INFOS } from './ClientFragment';
import { EMPLOYEE_BASIC_INFOS } from './EmployeeFragment';
import { VEHICLE_MINI_INFOS } from './VehicleFragment';
import { MATERIAL_BASIC_INFOS } from './MaterialFragment';
import { COMMENT_BASIC_INFOS } from './CommentFragment';
import { FOLDER_MINI_INFOS } from './MediaFragment';
import { ESTABLISHMENT_MINI_INFOS } from './EstablishmentFragment';

export const TASK_WORKER_DETAILS = gql`
  fragment TaskWorkerTypeFragment on TaskWorkerType {
    id
    employee {
      ...EmployeeBasicInfosFragment
    }
    createdAt
    updatedAt
  }
  ${EMPLOYEE_BASIC_INFOS}
`;

export const TASK_ESTABLISHMENT_DETAILS = gql`
  fragment TaskEstablishmentTypeFragment on TaskEstablishmentType {
    id
    establishment {
      ...EstablishmentMiniInfosFragment
    }
  }
  ${ESTABLISHMENT_MINI_INFOS}
`;

export const TASK_VEHICLE_DETAILS = gql`
  fragment TaskVehicleTypeFragment on TaskVehicleType {
    id
    vehicle {
      ...VehicleMiniInfosFragment
    }
  }
  ${VEHICLE_MINI_INFOS}
`;

export const TASK_MATERIAL_DETAILS = gql`
  fragment TaskMaterialTypeFragment on TaskMaterialType {
    id
    material {
      ...MaterialBasicInfosFragment
    }
  }
  ${MATERIAL_BASIC_INFOS}
`;

export const TASK_MINI_BASIC_INFOS = gql`
  fragment TaskMiniBasicInfosFragment on TaskType {
    id
    number
    name
  }
`;
export const TASK_BASIC_INFOS = gql`
  fragment TaskBasicInfosFragment on TaskType {
    ...TaskMiniBasicInfosFragment
    description
    startingDateTime
    endingDateTime
    address
    additionalAddress
    latitude
    longitude
    isActive
    priority
    workLevel
    status
    establishments {
      ...TaskEstablishmentTypeFragment
    }
    workers {
      ...TaskWorkerTypeFragment
    }
    folder {
      ...FolderMiniInfosFragment
    }
  }
  ${TASK_MINI_BASIC_INFOS}
  ${FOLDER_MINI_INFOS}
  ${TASK_ESTABLISHMENT_DETAILS}
  ${TASK_WORKER_DETAILS}
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
    images {
      id
      caption
      image
      creator {
        ...UserBasicInfosFragment
      }
      createdAt
      updatedAt
    }
    videos {
      id
      caption
      video
      thumbnail
      creator {
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
    comments {
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


export const TASK_DETAILS = gql`
  fragment TaskDetailsFragment on TaskType {
    ...TaskBasicInfosFragment
    latitude
    longitude
    country
    city
    zipCode
    address
    workersInfos
    vehiclesInfos
    materialsInfos
    comment
    description
    observation
    vehicles {
      ...TaskVehicleTypeFragment
    }
    materials {
      ...TaskMaterialTypeFragment
    }
    taskChecklist {
      ...TaskChecklistItemFragment
    }
  }
  ${TASK_BASIC_INFOS}
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
    author {
      ...UserBasicInfosFragment
    }
    creator {
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
    latitude
    longitude
    country
    city
    zipCode
    address
    workersInfos
    vehiclesInfos
    materialsInfos
    comment
    description
    observation
    vehicles {
      ...TaskVehicleTypeFragment
    }
    materials {
      ...TaskMaterialTypeFragment
    }
    taskChecklist {
      ...TaskChecklistItemFragment
    }
    createdAt
    updatedAt
  }
  ${TASK_BASIC_INFOS}
  ${TASK_VEHICLE_DETAILS}
  ${TASK_MATERIAL_DETAILS}
  ${TASK_CHECK_LIST_DETAILS}
`;
