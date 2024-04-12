import { gql } from '@apollo/client';
import { DATA_BASIC_INFOS } from '../fragments/DataFragment';

export const GET_DATAS = gql`
    query($typeData: String!) {
        datas(typeData : $typeData){
            ...DataBasicInfosFragment
        }
    }
    ${DATA_BASIC_INFOS}
`


export const GET_DATAS_ESTABLISHMENT_EVENT = gql`
  query{
    establishmentTypes : datas(typeData : "EstablishmentType"){
        ...DataBasicInfosFragment
    }
  } 
  ${DATA_BASIC_INFOS}
  `
export const GET_DATAS_BENEFICIARY_ABSENCE = gql`
  query{
    absenceReasons : datas(typeData : "AbsenceReason"){
        ...DataBasicInfosFragment
    }
  } 
  ${DATA_BASIC_INFOS}
`

export const GET_DATAS_UDESIRABLE_EVENT = gql`
  query{
    undesirableEventNormalTypes : datas(typeData : "UndesirableEventNormalType"){
        ...DataBasicInfosFragment
    }
    undesirableEventSeriousTypes : datas(typeData : "UndesirableEventSeriousType"){
        ...DataBasicInfosFragment
    }
    frequencies : datas(typeData : "UndesirableEventFrequency"){
        ...DataBasicInfosFragment
    }
  } 
  ${DATA_BASIC_INFOS}
`


export const GET_DATAS_MEETING = gql`
  query{
    meetingReasons : datas(typeData : "MeetingReason"){
        ...DataBasicInfosFragment
    }
  } 
  ${DATA_BASIC_INFOS}
`