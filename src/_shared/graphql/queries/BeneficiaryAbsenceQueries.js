import { gql } from '@apollo/client';
import { BENEFICIARY_ABSENCE_BASIC_INFOS, BENEFICIARY_ABSENCE_DETAILS, BENEFICIARY_ABSENCE_RECAP_DETAILS } from '../fragments/BeneficiaryAbsenceFragment';

export const GET_BENEFICIARY_ABSENCE = gql`
  query GetBeneficiaryAbsence($id: ID!) {
    beneficiaryAbsence(id: $id) {
      ...BeneficiaryAbsenceDetailsFragment
    }
  }
  ${BENEFICIARY_ABSENCE_DETAILS}
`;

export const GET_BENEFICIARY_ABSENCES = gql`
  query GetBeneficiaryAbsences($beneficiaryAbsenceFilter: BeneficiaryAbsenceFilterInput, $offset: Int, $limit: Int, $page: Int){
    beneficiaryAbsences(beneficiaryAbsenceFilter : $beneficiaryAbsenceFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...BeneficiaryAbsenceBasicInfosFragment
      }
    }
  }
  ${BENEFICIARY_ABSENCE_BASIC_INFOS}
`;


export const BENEFICIARY_ABSENCE_RECAP = gql`
  query GetBeneficiaryAbsence($id: ID!) {
    beneficiaryAbsence(id: $id) {
      ...BeneficiaryAbsenceRecapDetailsFragment
    }
  }
  ${BENEFICIARY_ABSENCE_RECAP_DETAILS}
`;
// Add more beneficiaryAbsence-related queries here
