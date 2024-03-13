import { gql } from '@apollo/client';
import { TASK_BASIC_INFOS } from '../fragments/TaskFragment';
import { EMPLOYEE_BASIC_INFOS } from '../fragments/EmployeeFragment';
import { CLIENT_BASIC_INFOS } from '../fragments/ClientFragment';
import { SUPPLIER_BASIC_INFOS } from '../fragments/SupplierFragment';

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