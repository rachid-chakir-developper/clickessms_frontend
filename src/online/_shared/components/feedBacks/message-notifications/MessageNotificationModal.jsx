import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextMobileStepper from './TextMobileStepper';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function MessageNotificationModal({
  messageNotificationModal,
  setMessageNotificationModal,
}) {
  let { isOpen, onClose, type, data } = messageNotificationModal;
  const handleClose = () => {
    onClose();
  };

return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Bienvenue sur ROBERPP
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() =>
            setMessageNotificationModal({ ...messageNotificationModal, isOpen: false })
          }
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
          <TextMobileStepper messageNotifications={data} />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}