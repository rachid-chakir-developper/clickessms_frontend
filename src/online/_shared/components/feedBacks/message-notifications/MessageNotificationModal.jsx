import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextMobileStepper from './TextMobileStepper';
import { getFormatDateTime, getMessageNotificationTypeLabel } from '../../../../../_shared/tools/functions';
import { Typography } from '@mui/material';

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
  const [title, setTitle] = React.useState('Bienvenue sur ROBERP');
  const [messageNotificationType, setMessageNotificationType] = React.useState();
  const [createdAt, setCreatedAt] = React.useState(null);
  const [primaryColor, setPrimaryColor] = React.useState('#cccccc');
  const handleClose = () => {
    onClose();
  };
const onSlideChange = (message)=>{
  setTitle(message?.title)
  setMessageNotificationType(message?.messageNotificationType)
  setPrimaryColor(message?.primaryColor)
  setCreatedAt(message?.createdAt)
}
return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: primaryColor, color: '#fff' }} id="customized-dialog-title">
          {getMessageNotificationTypeLabel(messageNotificationType)}
          {createdAt && <><br />
            <Typography component="span" sx={{fontSize: 12}}>Publié le {getFormatDateTime(createdAt)}</Typography></>
          }
        </DialogTitle>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          <TextMobileStepper messageNotifications={data} onSlideChange={onSlideChange} />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}