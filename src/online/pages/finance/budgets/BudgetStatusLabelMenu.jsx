import * as React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_BUDGET_FIELDS } from '../../../../_shared/graphql/mutations/BudgetMutations';
import { Drafts, Pending, CheckCircle, Cancel, Lock, HourglassEmpty} from '@mui/icons-material';
import { BUDGET_STATUS_CHOICES } from '../../../../_shared/tools/constants';
import { Link } from 'react-router-dom';

 // MenuOptions with icons for each status
 const STATUS_BUDGET = [
    { value: 'DRAFT', label: 'Brouillon', icon: <HourglassEmpty />, color: 'default' },
    { value: 'PENDING', label: 'En attente de validation', icon: <Pending />, color: 'warning' },
    { value: 'APPROVED', label: 'Validé', icon: <CheckCircle />, color: 'success' },
    { value: 'REJECTED', label: 'Rejeté', icon: <Cancel />, color: 'error' },
    { value: 'IN_PROGRESS', label: 'En cours', icon: <Lock />, color: 'info' },
    { value: 'COMPLETED', label: 'Complété', icon: <CheckCircle />, color: 'success' },
    { value: 'OVERSPENT', label: 'Dépassement', icon: <Cancel />, color: 'error' },
    { value: 'ON_HOLD', label: 'En pause', icon: <HourglassEmpty />, color: 'secondary' },
    { value: 'CANCELLED', label: 'Annulé', icon: <Cancel />, color: 'error' },
    { value: 'CLOSED', label: 'Clôturé', icon: <Lock />, color: 'grey' },
  ];
export default function BudgetStatusLabelMenu({budget, disabled}) {
    const authorizationSystem = useAuthorizationSystem();
    const canManageFinance = authorizationSystem.requestAuthorization({
      type: 'manageFinance',
    }).authorized;
    const [updateBudgetFields, { loading: loadingPut }] = useMutation(PUT_BUDGET_FIELDS, {
      update(cache, { data: { updateBudgetFields } }) {
        const updatedBudget = updateBudgetFields.budget;
  
        cache.modify({
          fields: {
            budgets(
              existingBudgets = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBudgets = existingBudgets.nodes.map((budget) =>
                readField('id', budget) === updatedBudget.id
                  ? updatedBudget
                  : budget,
              );
  
              return {
                totalCount: existingBudgets.totalCount,
                nodes: updatedBudgets,
              };
            },
          },
        });
      },
    });
  return (
    <Box>
        { budget?.status !== BUDGET_STATUS_CHOICES.DRAFT ? <CustomizedStatusLabelMenu 
            status={budget?.status}
            options={STATUS_BUDGET}
            loading={loadingPut}
            disabled={!canManageFinance}
            onChange={(status)=> {updateBudgetFields({ variables: {id: budget?.id, budgetData: {status}} })}}
        /> :
        <Tooltip title="Cliquez pour compléter">
          <Link
            to={`/online/finance/budgets/modifier/${budget?.id}`}
            className="no_style"
          >
            <Box display="flex" alignItems="center">
              <Drafts color="warning" /> {/* Icône ajoutée avec couleur warning */}
              <Typography variant="body2" sx={{ color: 'warning.main', ml: 1 }}>
                Brouillon
              </Typography>
            </Box>
          </Link>
        </Tooltip>
      }
    </Box>
  );
}