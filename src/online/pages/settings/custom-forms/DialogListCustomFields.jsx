import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CUSTOM_FIELDS } from '../../../../_shared/graphql/queries/CustomFieldQueries';
import { DELETE_CUSTOM_FIELD } from '../../../../_shared/graphql/mutations/CustomFieldMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import DialogAddCustomField from './DialogAddCustomField';
import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Delete, Edit, Group } from '@mui/icons-material';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFieldTypeLabel } from '../../../../_shared/tools/functions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogListCustomFields({ open, onClose, customField }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [customFieldToEdit, setCustomFieldToEdit] = React.useState();
  const [
    getCustomFields, { loading: loadingCustomFields, data: customFieldsData }] =
    useLazyQuery(GET_CUSTOM_FIELDS);
  React.useEffect(() => {
    if (open) {
      getCustomFields({ variables: { customFieldFilter:{formModels: [customField.formModel] }} });
    }
  }, [open]);
  const [deleteCustomField, { loading: loadingDelete }] = useMutation(DELETE_CUSTOM_FIELD, {
    onCompleted: (customFields) => {
      if (customFields.deleteCustomField.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      }
    },
    update(cache, { customField: { deleteCustomField } }) {
      console.log('Updating cache after deletion:', deleteCustomField);

      const deletedCustomFieldId = deleteCustomField.id;

      cache.modify({
        fields: {
          customFields(existingCustomFields = [], { readField }) {
            const updatedCustomFields = existingCustomFields.filter(
              (customField) => readField('id', customField) !== deletedCustomFieldId,
            );

            console.log('Updated customFields:', updatedCustomFields);

            return updatedCustomFields;
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non Supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [errors, setErrors] = React.useState([]);
  const handleOk = (e) => {
    e.preventDefault();
    console.log(1);
    onClose(2);
  };
  const closeDialog = (value) => {
    setOpenDialog(false);
  };
  const handleClickEdit = (customField) => {
    setOpenDialog(true);
    setCustomFieldToEdit(customField);
  };

  const onDeleteCustomField = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteCustomField({ variables: { id: id } });
      },
    });
  };

  return (
    <Box>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Liste des champs: "{customField?.name}"
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <List dense={true}>
            {loadingCustomFields && <ProgressService type="notification" />}
            {customFieldsData?.customFields?.nodes.length < 1 && !loadingCustomFields && (
              <Alert severity="warning">
                La liste est vide pour le moment !
              </Alert>
            )}
            {customFieldsData?.customFields?.nodes?.map((customField, index) => {
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <Tooltip title="Modifier">
                        <IconButton
                          edge="end"
                          aria-label="supprimer"
                          onClick={() => onDeleteCustomField(customField?.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          edge="end"
                          aria-label="modifier"
                          onClick={() => handleClickEdit(customField)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Group />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={customField?.label}
                    secondary={`${customField?.key} / de type "${getFieldTypeLabel(customField?.fieldType)}"`}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleOk}>
            Fermer
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <DialogAddCustomField
        open={openDialog}
        onClose={closeDialog}
        customField={customField}
        customFieldToEdit={customFieldToEdit}
      />
    </Box>
  );
}
