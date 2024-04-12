import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';
import { EMPLOYEE_BASIC_INFOS, EMPLOYEE_PHONE_INFOS } from '../fragments/EmployeeFragment';
import { CLIENT_BASIC_INFOS, CLIENT_PHONE_INFOS } from '../fragments/ClientFragment';
import { SUPPLIER_BASIC_INFOS, SUPPLIER_PHONE_INFOS } from '../fragments/SupplierFragment';
import { BENEFICIARY_PHONE_INFOS } from '../fragments/BeneficiaryFragment';
import { PARTNER_PHONE_INFOS } from '../fragments/PartnerFragment';
import { ESTABLISHMENT_PHONE_INFOS } from '../fragments/EstablishmentFragment';
import { PHONE_NUMBER_INFOS } from '../fragments/DataFragment';

export const GET_SEARCH = gql`
    query search($searchFilter: SearchFilterInput, $offset: Int, $limit: Int, $page: Int){
        search(searchFilter: $searchFilter, offset : $offset, limit : $limit, page : $page){
            results{
                tasks{
                    totalCount
                    nodes{
                        ...TaskBasicInfosFragment
                    }
                }
                employees{
                    totalCount
                    nodes{
                        ...EmployeeBasicInfosFragment
                    }
                }
                clients{
                    totalCount
                    nodes{
                        ...ClientBasicInfosFragment
                    }
                }
                suppliers{
                    totalCount
                    nodes{
                        ...SupplierBasicInfosFragment
                    }
                }
            }
        }
    }
    ${EMPLOYEE_BASIC_INFOS}
    ${TASK_BASIC_INFOS}
    ${CLIENT_BASIC_INFOS}
    ${SUPPLIER_BASIC_INFOS}
`

export const GET_SEARCH_NUMBERS = gql`
    query searchNumbers($searchFilter: SearchFilterInput, $offset: Int, $limit: Int, $page: Int){
        searchNumbers(searchFilter: $searchFilter, offset : $offset, limit : $limit, page : $page){
            results{
                employees{
                    totalCount
                    nodes{
                        ...EmployeePhoneInfosFragment
                    }
                }
                clients{
                    totalCount
                    nodes{
                        ...ClientPhoneInfosFragment
                    }
                }
                suppliers{
                    totalCount
                    nodes{
                        ...SupplierPhoneInfosFragment
                    }
                }
                partners{
                    totalCount
                    nodes{
                        ...PartnerPhoneInfosFragment
                    }
                }
                beneficiaries{
                    totalCount
                    nodes{
                        ...BeneficiaryPhoneInfosFragment
                    }
                }
                establishments{
                    totalCount
                    nodes{
                        ...EstablishmentPhoneInfosFragment
                    }
                }
                phoneNumbers{
                    totalCount
                    nodes{
                        ...PhoneNumberInfosFragment
                    }
                }
            }
        }
    }
    ${EMPLOYEE_PHONE_INFOS}
    ${CLIENT_PHONE_INFOS}
    ${SUPPLIER_PHONE_INFOS}
    ${PARTNER_PHONE_INFOS}
    ${BENEFICIARY_PHONE_INFOS}
    ${ESTABLISHMENT_PHONE_INFOS}
    ${PHONE_NUMBER_INFOS}
`