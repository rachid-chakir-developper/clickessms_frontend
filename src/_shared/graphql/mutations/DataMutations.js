import { gql } from '@apollo/client';
import { DATA_BASIC_INFOS } from '../fragments/DataFragment';

export const POST_DATA = gql`
    mutation createData($name: String! $descreption: String, $typeData: String!){
        createData(name: $name, descreption: $descreption, typeData : $typeData) {
            data {
            ...DataBasicInfosFragment
            }
        }
    }
    ${DATA_BASIC_INFOS}
`
export const PUT_DATA = gql`
    mutation updateData($id: ID!, $name: String!, $descreption: String, $typeData: String!){
        updateData(id : $id, name: $name, descreption: $descreption, typeData : $typeData) {
            data {
                ...DataBasicInfosFragment
            }
        }
    }
    ${DATA_BASIC_INFOS}
`


export const DELETE_DATA = gql`
    mutation deleteData($id: ID!, $typeData: String!){
        deleteData(id : $id, typeData : $typeData){
        deleted
        }
    }
`