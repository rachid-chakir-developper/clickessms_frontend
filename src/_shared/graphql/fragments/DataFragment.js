// DataFragment.js

import { gql } from '@apollo/client';

export const DATA_BASIC_INFOS = gql`
    fragment DataBasicInfosFragment on DataType {
        id,
        name,
        descreption
    }
`;