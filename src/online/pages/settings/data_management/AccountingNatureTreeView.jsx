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

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    name: 'Data Grid',
    children: [
      { id: 'grid-community', name: '@mui/x-data-grid' },
      { id: 'grid-pro', name: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', name: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    name: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', name: '@mui/x-date-pickers' },
      { id: 'pickers-pro', name: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    name: 'Charts',
    children: [{ id: 'charts-community', name: '@mui/x-charts', children: [{ id: 'charts-communixxxxty', name: '@mui/x-charts',  }]  }],
  },
  {
    id: 'tree-view',
    name: 'Tree View',
    children: [{ id: 'tree-view-community', name: '@mui/x-tree-view' }],
  },
];

// Composant pour afficher les actions (Modifier et Supprimer)
function CustomLabel({ children, className, numberOfChildren, onEdit, onDelete }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={4}
      flexGrow={1}
      className={className}
    >
      <Typography>{children}</Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        {/* Chip pour afficher le nombre d'enfants */}
        <Chip label={numberOfChildren} size="small" />

        {/* Boutons Modifier et Supprimer */}
        <IconButton aria-label="edit" size="small" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" size="small" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

// Composant personnalisé TreeItem pour intégrer les actions Modifier et Supprimer
const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { publicAPI } = useTreeItem2(props);

  const childrenNumber = publicAPI.getItemOrderedChildrenIds(props.itemId).length;

  // Fonction pour gérer l'édition
  const handleEdit = () => {
    console.log('Edit item', props.itemId);
  };

  // Fonction pour gérer la suppression
  const handleDelete = () => {
    console.log('Delete item', props.itemId);
  };

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel,
      }}
      slotProps={{
        label: {
          numberOfChildren: childrenNumber,
          onEdit: handleEdit,
          onDelete: handleDelete,
        },
      }}
    />
  );
});

export default function AccountingNatureTreeView() {
  return (
    <Box sx={{ minHeight: 200, minWidth: 350 }}>
      <RichTreeView
        defaultExpandedItems={['pickers']}
        items={MUI_X_PRODUCTS}
        slots={{ item: CustomTreeItem }}
        getItemLabel={(item) => item.name}
      />
    </Box>
  );
}