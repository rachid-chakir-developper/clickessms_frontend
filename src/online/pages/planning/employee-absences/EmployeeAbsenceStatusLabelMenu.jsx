import * as React from 'react';
import { Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_EMPLOYEE_ABSENCE_FIELDS } from '../../../../_shared/graphql/mutations/EmployeeAbsenceMutations';
import { ETRY_ABSENCE_TYPES } from '../../../../_shared/tools/constants';
import { Cancel, CheckCircle, Done, HelpOutline, Pending, ReportProblem } from '@mui/icons-material';



export default function EmployeeAbsenceStatusLabelMenu({employeeAbsence}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageHumanRessources = authorizationSystem.requestAuthorization({
    type: 'manageHumanRessources',
  }).authorized;

  // MenuOptions with icons for each status
  const ABSENCE_STATUS = [
    { value: 'PENDING', label: 'En attente de traitement', icon: <Pending />, color: 'default' },
    { value: 'TO_JUSTIFY', label: 'À justifier', icon: <HelpOutline />, color: 'warning', hidden: employeeAbsence?.entryType===ETRY_ABSENCE_TYPES.LEAVE },
    { value: 'NOT_JUSTIFIED', label: 'Non justifié', icon: <ReportProblem />, color: 'error', hidden: employeeAbsence?.entryType===ETRY_ABSENCE_TYPES.LEAVE },
    { value: 'JUSTIFIED', label: 'Justifié', icon: <CheckCircle />, color: 'success', hidden: employeeAbsence?.entryType===ETRY_ABSENCE_TYPES.LEAVE },
    { value: 'APPROVED', label: 'Approuvé', icon: <Done />, color: 'success', hidden: employeeAbsence?.entryType===ETRY_ABSENCE_TYPES.ABSENCE },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'error', hidden: employeeAbsence?.entryType===ETRY_ABSENCE_TYPES.ABSENCE },
  ];

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
            options={ABSENCE_STATUS}
            status={employeeAbsence?.status}
            type="absence"
            loading={loadingPut}
            disabled={!canManageHumanRessources}
            onChange={(status)=> {updateEmployeeAbsenceFields({ variables: {id: employeeAbsence?.id, employeeAbsenceData: {status}} })}}
        />
    </Box>
  );
}