import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import { Add, AddAPhoto, Expand, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Alert, Button, InputAdornment } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ACCOUNTING_NATURES } from '../../../../_shared/graphql/queries/DataQueries';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { PUT_ACCOUNTING_NATURE_BUDGET } from '../../../../_shared/graphql/mutations/BudgetMutations';

const CustomTreeItemStyled = styled(TreeItem2)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

// Composant pour afficher les actions (Ajouter, Modifier et Supprimer)
function CustomLabel({ children, className, numberOfChildren, amountAllocated, accountingNatureId, budgetId }) {
  const [amountAllocatedValue, setAmountAllocatedValue] = React.useState(amountAllocated);

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [updateBudgetAccountingNature, { loading: loadingPut }] = useMutation(PUT_ACCOUNTING_NATURE_BUDGET, {
    onCompleted: (data) => {
      console.log(data);
    },
    update(cache, { data: { updateBudgetAccountingNature } }) {
      const updatedAccountingNature = updateBudgetAccountingNature.budgetAccountingNature.accountingNature;
      const amountAllocated = updateBudgetAccountingNature.budgetAccountingNature.amountAllocated;
  
      cache.modify({
        fields: {
          accountingNatures(existingAccountingNatures = { totalCount: 0, nodes: [] }, { readField }) {
            let updatedNodes = existingAccountingNatures.nodes.map(accountingNature => {
              if (readField('id', accountingNature) === updatedAccountingNature.id) {
                return {...updatedAccountingNature, amountAllocated: amountAllocated};
              }
  
              return accountingNature;
            });
  
            return {
              totalCount: existingAccountingNatures.totalCount,
              nodes: updatedNodes,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
    
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
      flexGrow={1}
      className={className}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {numberOfChildren > 0 && false && <Chip label={numberOfChildren} size="small" />}
        <Typography>{children}</Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <TheTextField
          variant="outlined"
          type="number"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">€</InputAdornment>
            ),
          }}
          value={amountAllocatedValue}
          onChange={(e) =>{
              setAmountAllocatedValue(e.target.value)
            }
          }
          onBlur={(e) =>{
              (e) => e.stopPropagation()
              updateBudgetAccountingNature({
                variables: { 
                  budgetAccountingNatureData: { 
                    budget: budgetId,
                    accountingNature: accountingNatureId,
                    amountAllocated: e.target.value !== "" ? e.target.value: null
                  }
                },
              })
            }
          }
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        />
      </Stack>
    </Stack>
  );
}

// Composant TreeItem personnalisé
const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const {
    itemData,
    budget,
    handleLoadChildren,
    ...rest // Spread only the remaining props
  } = props;

  const childrenNumber = itemData?.childrenNumber || 0;
  const hasChildren = itemData?.childrenNumber > 0;
  const amountAllocated = itemData?.amountAllocated || null;

  const handleExpand = () => {
    if (hasChildren) {
      handleLoadChildren(props.itemId);
    }
  };

  return (
    <CustomTreeItemStyled
      {...rest} // Spread only valid props here
      ref={ref}
      onClick={handleExpand}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: {
          numberOfChildren: childrenNumber,
          amountAllocated: amountAllocated,
          accountingNatureId :itemData.id,
          budgetId :budget.id,
        },
      }}
    />
  );
});


// Composant principal
export default function AccountingNatureTreeViewForm({budget}) {


  const [
    getAccountingNatures,
    {
      loading: loadingAccountingNatures,
      data: accountingNaturesData,
      error: accountingNaturesError,
    },
  ] = useLazyQuery(GET_ACCOUNTING_NATURES);

  React.useEffect(() => {
    if(budget) getAccountingNatures({variables: { accountingNatureFilter: {budget : budget?.id}}});
  }, [budget]);

  // Création d'un index pour les données
  const accountingNaturesIndex = React.useMemo(() => {
    const nodes = accountingNaturesData?.accountingNatures?.nodes || [];
  
    // Fonction récursive pour parcourir les enfants et construire l'index
    const buildIndex = (nodes, acc) => {
      nodes.forEach((node) => {
        acc[node.id] = node; // Ajouter le nœud courant à l'index
        if (node.children && node.children.length > 0) {
          buildIndex(node.children, acc); // Appeler récursivement pour les enfants
        }
      });
      return acc;
    };
  
    return buildIndex(nodes, {});
  }, [accountingNaturesData]);

  if(loadingAccountingNatures) return(
    <ProgressService type="text" />
  )
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      {accountingNaturesData?.accountingNatures?.nodes?.length < 1 && !loadingAccountingNatures && (
        <Alert severity="warning">
          Aucune nature trouvée.
        </Alert>
      )}
      <RichTreeView
        items={accountingNaturesData?.accountingNatures?.nodes || []}
        slots={{
          item: (props) => (
            <CustomTreeItem
              {...props}
              budget={budget}
              itemData={accountingNaturesIndex[props.itemId]}
              handleLoadChildren={(parentId) => {
                // console.log(`Loading children for ${parentId}`);
                // Implémentez la logique pour charger les enfants depuis le serveur
              }}
            />
          ),
        }}
        getItemLabel={(item) => `${item.code} - ${item.name}`}
      />
    </Box>
  );
}
