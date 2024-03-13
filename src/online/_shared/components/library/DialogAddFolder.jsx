
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
import {  useMutation } from '@apollo/client';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { POST_FOLDER, PUT_FOLDER } from '../../../../_shared/graphql/mutations/MediaMutations';

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

export default function DialogAddFolder({open, onClose, folderParent, type, folderToEdit}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const validationSchema = yup.object({
        name: yup .string('Entrez le nom de dossier').required(`Le nom est obligatoire`),
    });
    const formik = useFormik({
        initialValues: { nom : '', description : '', observation : '', folder : null },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleOk(values)
        },
    });
    const [createFolder, { loading : loadingPost }] = useMutation(POST_FOLDER, {
        onCompleted: (data) => {
          console.log(data);
          onClose(formik.values);
          setNotifyAlert({
            isOpen: true,
            message: 'Ajouté avec succès',
            type: 'success'
          })
        },
        onError: (err) => {
          console.log(err)
          setNotifyAlert({
            isOpen: true,
            message: 'Non Ajouté ! Veuillez réessayer.',
            type: 'error'
          })
        },
    })
    const [updateFolder, { loading : loadingPut }] = useMutation(PUT_FOLDER, {
        onCompleted: (data) => {
          console.log(data);
          onClose(data.updateFolder.folder);
          setNotifyAlert({
            isOpen: true,
            message: 'Modifié avec succès',
            type: 'success'
          })
        },
        onError: (err) => {
          console.log(err)
          setNotifyAlert({
            isOpen: true,
            message: 'Non Modifié ! Veuillez réessayer.',
            type: 'error'
          })
        },
    })
    const handleOk = (folderForm) => {
        const folderData = {
            name : folderForm.name,
            description : folderForm.description,
            observation : folderForm.observation,
            observation : folderForm.observation,
            folder : folderForm.folder,
          }
        if(folderToEdit) updateFolder({ variables: { id : folderToEdit.id, folderData } })
        else createFolder({ variables: { folderData } })
    };
    React.useEffect(
        () => {
          if(open) {
            formik.setValues({...formik.values, folder: folderParent.id})
            if(folderToEdit){
                formik.setValues({
                     ...formik.values, name: folderToEdit.name,
                     description: folderToEdit.description, observation: folderToEdit.observation, folder: folderParent.id
                    })
            }
          }
        },
        [open],
    );
      

  return (
    <>
        
            <BootstrapDialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {folderToEdit ? 'Modifer un dossier' : 'Ajouter un dossier'}
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
                            <Grid item xs={12}  sm={12} md={12}>
                                <Item>
                                    <TheTextField variant="outlined" label="Nom de dossier" id="name"
                                        value={formik.values.name} required
                                        onChange={(e) => formik.setFieldValue('name', e.target.value)}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                        disabled={loadingPost || loadingPut}
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={12}  sm={12} md={12}>
                                <Item>
                                    <TheTextField variant="outlined" label="Description" multiline rows={4}
                                        value={formik.values.description}
                                        onChange={(e) => formik.setFieldValue('description', e.target.value)}
                                        disabled={loadingPost || loadingPut}
                                        />
                                </Item>
                            </Grid>
                            <Grid item xs={12}  sm={12} md={12}>
                                <Item>
                                    <TheTextField variant="outlined" label="Observation" multiline rows={4}
                                        value={formik.values.observation}
                                        onChange={(e) => formik.setFieldValue('observation', e.target.value)}
                                        disabled={loadingPost || loadingPut}
                                        />
                                </Item>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" disabled={!formik.isValid || loadingPost || loadingPut}>Valider</Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
    </>
  );
}
