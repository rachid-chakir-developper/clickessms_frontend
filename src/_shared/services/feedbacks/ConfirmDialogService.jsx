import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

export default function ConfirmDialogService({
  confirmDialog,
  setConfirmDialog,
}) {
  return (
    <Dialog open={confirmDialog.isOpen}>
      {/* <DialogTitle>
                <IconButton disableRipple >
                    <NotListedLocationIcon />
                </IconButton>
            </DialogTitle> */}
      <DialogContent>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="contained"
          disableElevation
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          color="inherit"
        >
          Non
        </Button>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={confirmDialog.onConfirm}
        >
          Oui, je confirme
        </Button>
      </DialogActions>
    </Dialog>
  );
}
