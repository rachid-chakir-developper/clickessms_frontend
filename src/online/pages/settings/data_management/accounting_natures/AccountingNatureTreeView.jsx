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
import { Alert, Button } from '@mui/material';
import DialogAddAccountingNature from './DialogAddAccountingNature';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ACCOUNTING_NATURES } from '../../../../../_shared/graphql/queries/DataQueries';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { DELETE_ACCOUNTING_NATURE } from '../../../../../_shared/graphql/mutations/DataMutations';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../../_shared/context/AuthorizationSystemProvider';
import DatasImportField from '../../../../_shared/components/data_tools/import/DatasImportField';

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
function CustomLabel({ children, className, numberOfChildren, onEdit, onDelete, onAdd, canManageAccountingNatures }) {
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

      {canManageAccountingNatures && <Stack direction="row" spacing={1} alignItems="center">
        <IconButton aria-label="edit" size="small" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" size="small" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="add" size="small" onClick={onAdd}>
          <Add fontSize="small" />
        </IconButton>
      </Stack>}
    </Stack>
  );
}

// Composant TreeItem personnalisé
const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const {
    itemData, // Exclude itemData to prevent it from being passed to DOM
    canManageAccountingNatures,
    handleClickAdd,
    handleClickEdit,
    handleClickDelete,
    handleLoadChildren,
    ...rest // Spread only the remaining props
  } = props;

  const childrenNumber = itemData?.childrenNumber || 0;
  const hasChildren = itemData?.childrenNumber > 0;

  const handleExpand = () => {
    if (hasChildren) {
      handleLoadChildren(props.itemId);
    }
  };

  const handleAdd = () => {
    if (itemData) handleClickAdd(itemData);
  };

  const handleEdit = () => {
    if (itemData) handleClickEdit(itemData);
  };

  const handleDelete = () => {
    if (itemData) handleClickDelete(itemData);
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
          onAdd: handleAdd,
          onEdit: handleEdit,
          onDelete: handleDelete,
          canManageAccountingNatures:canManageAccountingNatures
        },
      }}
    />
  );
});


// Composant principal
export default function AccountingNatureTreeView() {
  const authorizationSystem = useAuthorizationSystem();
    const canManageAccountingNatures = authorizationSystem.requestAuthorization({
      type: 'manageAccountingNatures',
    }).authorized;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [accountingNatureParent, setAccountingNatureParent] = React.useState();
  const [accountingNatureToEdit, setAccountingNatureToEdit] = React.useState();

  const handleClickAdd = (accountingNatureParent=null) => {
    setAccountingNatureToEdit(null);
    setAccountingNatureParent(accountingNatureParent)
    setOpenDialog(true);
  };

  const handleClickEdit = (data) => {
    setAccountingNatureParent(null)
    setAccountingNatureToEdit(data);
    setOpenDialog(true);
  };

  const closeDialog = (value) => {
    setOpenDialog(false);
    if (value) {
      // console.log('value', value);
    }
  };

  const handleClickDelete = (data) => {
    onDeleteAccountingNature(data.id)
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [deleteAccountingNature, { loading: loadingDelete }] = useMutation(
    DELETE_ACCOUNTING_NATURE,
    {
      onCompleted: (datas) => {
        if (datas.deleteAccountingNature.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteAccountingNature.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_ACCOUNTING_NATURES }],
      update(cache, { data: { deleteAccountingNature } }) {
        console.log('Updating cache after deletion:', deleteAccountingNature);
        if(deleteAccountingNature?.success){
          const deletedAccountingNatureId = deleteAccountingNature.id;
  
          cache.modify({
            fields: {
              accountingNatures(
                existingAccountingNatures = { totalCount: 0, nodes: [] },
                { readField },
              ) {
                const updatedAccountingNatures = existingAccountingNatures.nodes.filter(
                  (accountingNature) =>
                    readField('id', accountingNature) !== deletedAccountingNatureId,
                );
  
                console.log('Updated accountingNatures:', updatedAccountingNatures);
  
                return {
                  totalCount: existingAccountingNatures.totalCount - 1,
                  nodes: updatedAccountingNatures,
                };
              },
            },
          });
        }
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onDeleteAccountingNature = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteAccountingNature({ variables: { id: id } });
      },
    });
  };

  const [
    getAccountingNatures,
    {
      loading: loadingAccountingNatures,
      data: accountingNaturesData,
      error: accountingNaturesError,
    },
  ] = useLazyQuery(GET_ACCOUNTING_NATURES);

  React.useEffect(() => {
    getAccountingNatures();
  }, []);

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
      {canManageAccountingNatures && <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', my: 3 }}>
        <DatasImportField 
          title="Importer" 
          entity="AccountingNature" 
          label="Importer" 
          fields={['code', 'name', 'description']}
          refetchQueries={[{ query: GET_ACCOUNTING_NATURES }]} />
        <Button onClick={handleClickAdd} variant="contained" endIcon={<Add />} sx={{marginLeft: 1}}>
          Ajouter une nature
        </Button>
      </Box>}
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
              itemData={accountingNaturesIndex[props.itemId]}
              handleClickAdd={handleClickAdd}
              handleClickEdit={handleClickEdit}
              handleClickDelete={handleClickDelete}
              canManageAccountingNatures={canManageAccountingNatures}
              handleLoadChildren={(parentId) => {
                // console.log(`Loading children for ${parentId}`);
                // Implémentez la logique pour charger les enfants depuis le serveur
              }}
            />
          ),
        }}
        getItemLabel={(item) => `${item.code} - ${item.name}`}
      />
      <DialogAddAccountingNature
        open={openDialog}
        onClose={closeDialog}
        accountingNatureParent={accountingNatureParent}
        accountingNatureToEdit={accountingNatureToEdit}
      />
    </Box>
  );
}
