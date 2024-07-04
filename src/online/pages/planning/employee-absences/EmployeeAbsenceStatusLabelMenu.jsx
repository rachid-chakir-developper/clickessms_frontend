import * as React from 'react';
import { Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_EMPLOYEE_ABSENCE_FIELDS } from '../../../../_shared/graphql/mutations/EmployeeAbsenceMutations';



export default function EmployeeAbsenceStatusLabelMenu({employeeAbsence}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageHumanRessources = authorizationSystem.requestAuthorization({
    type: 'manageHumanRessources',
  }).authorized;
    const [updateEmployeeAbsenceFields, { loading: loadingPut }] = useMutation(PUT_EMPLOYEE_ABSENCE_FIELDS, {
      update(cache, { data: { updateEmployeeAbsenceFields } }) {
        const updatedEmployeeAbsence = updateEmployeeAbsenceFields.employeeAbsence;
  
        cache.modify({
          fields: {
            employeeAbsences(
              existingEmployeeAbsences = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEmployeeAbsences = existingEmployeeAbsences.nodes.map((employeeAbsence) =>
                readField('id', employeeAbsence) === updatedEmployeeAbsence.id
                  ? updatedEmployeeAbsence
                  : employeeAbsence,
              );
  
              return {
                totalCount: existingEmployeeAbsences.totalCount,
                nodes: updatedEmployeeAbsences,
              };
            },
          },
        });
      },
    });
  return (
    <Box>
        <CustomizedStatusLabelMenu 
            status={employeeAbsence?.status}
            type="absence"
            loading={loadingPut}
            disabled={!canManageHumanRessources}
            onChange={(status)=> {updateEmployeeAbsenceFields({ variables: {id: employeeAbsence?.id, employeeAbsenceData: {status}} })}}
        />
    </Box>
  );
}