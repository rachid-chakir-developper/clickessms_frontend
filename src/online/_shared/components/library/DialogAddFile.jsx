import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import {
  POST_FILE,
  PUT_FILE,
} from '../../../../_shared/graphql/mutations/MediaMutations';
import TheFieldField from '../../../../_shared/components/form-fields/TheFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogAddFile({
  open,
  onClose,
  folderParent,
  type,
  fileToEdit,
}) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de fichier')
      .required(`Le nom est obligatoire`),
  });
  const formik = useFormik({
    initialValues: {
      fileUpload: null,
      nom: '',
      description: '',
      observation: '',
      folder: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleOk(values);
    },
  });
  const [createFile, { loading: loadingPost }] = useMutation(POST_FILE, {
    onCompleted: (data) => {
      console.log(data);
      onClose(formik.values);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non Ajouté ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [updateFile, { loading: loadingPut }] = useMutation(PUT_FILE, {
    onCompleted: (data) => {
      console.log(data);
      onClose(data.updateFile.file);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non Modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const handleOk = (fileForm) => {
    const fileUpload = fileForm.fileUpload;
    const fileData = {
      name: fileForm.name,
      description: fileForm.description,
      observation: fileForm.observation,
      folder: fileForm.folder,
    };
    if (fileToEdit)
      updateFile({ variables: { id: fileToEdit.id, fileData, fileUpload } });
    else createFile({ variables: { fileUpload, fileData } });
  };
  React.useEffect(() => {
    if (open) {
      formik.setValues({ ...formik.values, folder: folderParent.id });
      if (fileToEdit) {
        formik.setValues({
          ...formik.values,
          name: fileToEdit.name,
          description: fileToEdit.description,
          observation: fileToEdit.observation,
          folder: folderParent.id,
        });
      }
    }
  }, [open]);

  return (
    <>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {fileToEdit ? 'Modifer un fichier' : 'Ajouter un fichier'}
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
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} sm={12} md={12}>
                <Item>
                  <TheFieldField
                    variant="outlined"
                    label="Séléctionner un fichier"
                    fileValue={formik.values.fileUpload}
                    onChange={(fileUpload) => {
                      formik.setFieldValue('fileUpload', fileUpload);
                      formik.setFieldValue('name', fileUpload?.name);
                    }}
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Nom de fichier"
                    id="name"
                    value={formik.values.name}
                    required
                    onChange={(e) =>
                      formik.setFieldValue('name', e.target.value)
                    }
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={(e) =>
                      formik.setFieldValue('description', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Observation"
                    multiline
                    rows={4}
                    value={formik.values.observation}
                    onChange={(e) =>
                      formik.setFieldValue('observation', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.isValid || loadingPost || loadingPut}
            >
              Valider
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}
