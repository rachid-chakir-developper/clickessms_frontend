import { Alert, Snackbar } from '@mui/material';

export default function AlertService({ notify, setNotify }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotify({
      ...notify,
      isOpen: false,
    });
  };

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert variant="filled" severity={notify.type} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
}
