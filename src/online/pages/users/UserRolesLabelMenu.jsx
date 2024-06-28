import * as React from 'react';
import { Box } from '@mui/material';
import CustomizedRolesLabelMenu from '../../../_shared/components/app/menu/CustomizedRolesLabelMenu';
import { useMutation } from '@apollo/client';
import { PUT_USER_FIELDS } from '../../../_shared/graphql/mutations/UserMutations';



export default function UserRolesLabelMenu({user}) {
    const [updateUserFields, { loading: loadingPut }] = useMutation(PUT_USER_FIELDS, {
      update(cache, { data: { updateUserFields } }) {
        const updatedUser = updateUserFields.user;
  
        cache.modify({
          fields: {
            users(
              existingUsers = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedUsers = existingUsers.nodes.map((user) =>
                readField('id', user) === updatedUser.id
                  ? updatedUser
                  : user,
              );
  
              return {
                totalCount: existingUsers.totalCount,
                nodes: updatedUsers,
              };
            },
          },
        });
      },
    });
  return (
    <Box>
        <CustomizedRolesLabelMenu 
            roles={user?.roles}
            type="user"
            loading={loadingPut}
            onChange={(roles)=> {
              updateUserFields({ variables: {id: user?.id, userData: {roles}} })}}
        />
    </Box>
  );
}