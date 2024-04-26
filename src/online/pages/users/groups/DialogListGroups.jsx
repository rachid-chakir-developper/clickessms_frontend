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
import { GET_GROUPS } from '../../../../_shared/graphql/queries/UserQueries';
import { DELETE_GROUP } from '../../../../_shared/graphql/mutations/UserMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import DialogAddGroup from './DialogAddGroup';
import {
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Delete, Edit, Group } from '@mui/icons-material';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogListGroups({ open, onClose }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [groupToEdit, setGroupToEdit] = React.useState();
  const [getGroups, { loading: loadingGroups, data: groupsData }] =
    useLazyQuery(GET_GROUPS);
  React.useEffect(() => {
    if (open) {
      getGroups();
    }
  }, [open]);
  const [deleteGroup, { loading: loadingDelete }] = useMutation(DELETE_GROUP, {
    onCompleted: (datas) => {
      if (datas.deleteGroup.deleted) {
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
    update(cache, { data: { deleteGroup } }) {
      console.log('Updating cache after deletion:', deleteGroup);

      const deletedGroupId = deleteGroup.id;

      cache.modify({
        fields: {
          groups(existingGroups = [], { readField }) {
            const updatedGroups = existingGroups.filter(
              (group) => readField('id', group) !== deletedGroupId,
            );

            console.log('Updated groups:', updatedGroups);

            return updatedGroups;
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
  const handleClickEdit = (data) => {
    setOpenDialog(true);
    setGroupToEdit(data);
  };

  const onDeleteGroup = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteGroup({ variables: { id: id } });
      },
    });
  };

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={'xs'}
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Liste des groupes
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
            {loadingGroups && <ProgressService type="notification" />}
            {groupsData?.groups?.length < 1 && !loadingGroups && (
              <Alert severity="warning">
                La liste est vide pour le moment !
              </Alert>
            )}
            {groupsData?.groups?.map((group, index) => {
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <Tooltip title="Modifier">
                        <IconButton
                          edge="end"
                          aria-label="supprimer"
                          onClick={() => onDeleteGroup(group?.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          edge="end"
                          aria-label="modifier"
                          onClick={() => handleClickEdit(group)}
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
                  <ListItemText primary={group?.name} />
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
      <DialogAddGroup
        open={openDialog}
        onClose={closeDialog}
        groupToEdit={groupToEdit}
      />
    </div>
  );
}
