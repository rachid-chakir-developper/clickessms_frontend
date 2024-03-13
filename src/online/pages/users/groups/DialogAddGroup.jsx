
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Divider, Grid, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { GET_PERMISSIONS } from '../../../../_shared/graphql/queries/UserQueries';
import { POST_GROUP, PUT_GROUP } from '../../../../_shared/graphql/mutations/UserMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TransferList from '../../../../_shared/components/helpers/TransferList';

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

export default function DialogAddGroup({open, onClose, groupToEdit}) {
    const  { setNotifyAlert,  setConfirmDialog} = useFeedBacks();
    const validationSchema = yup.object({
        name: yup .string('Entrez le nom de groupe').required(`Le nom est obligatoire`),
    });
    const formik = useFormik({
        initialValues: { nom : '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleOk(values)
        },
    });
    const [createGroup, { loading : loadingPost }] = useMutation(POST_GROUP, {
        onCompleted: (data) => {
          console.log(data);
          onClose(formik.values);
          setNotifyAlert({
            isOpen: true,
            message: 'Ajouté avec succès',
            type: 'success'
          })
        },
        update(cache, { data: { createGroup } }) {
          const newGroup = createGroup.group;
        
          cache.modify({
            fields: {
              groups(existingGroups = []) {
                  return [...existingGroups, newGroup];
              },
            },
          });
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
    const [updateGroup, { loading :loadingPut }] = useMutation(PUT_GROUP, {
        onCompleted: (data) => {
          console.log(data);
          onClose(data.updateGroup.group);
          setNotifyAlert({
            isOpen: true,
            message: 'Modifié avec succès',
            type: 'success'
          })
        },
        update(cache, { data: { updateGroup } }) {
          const updatedGroup = updateGroup.group;
        
          cache.modify({
            fields: {
              groups(existingGroups = [], { readField }) {
                  
                  const updatedGroups = existingGroups.map((group) =>
                      readField('id', group) === updatedGroup.id ? updatedGroup : group
                  );
          
                  return updatedGroups
              },
            },
          });
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
    const [errors, setErrors] = React.useState([])
    const handleOk = (groupForm) => {
        if(groupToEdit) updateGroup({ variables: {
          id : groupToEdit.id,
          name : groupForm.name,
          groupPermissions : groupPermissions.map(p=> p.id)
        } })
        else createGroup({ variables: {
          name : groupForm.name,
          groupPermissions : groupPermissions.map(p=> p.id)
        } })
    };
    React.useEffect(
        () => {
          if(open) {
            formik.setValues({name: ''})
            if(groupToEdit){
                formik.setValues({ ...formik.values, name: groupToEdit.name})
                if(groupToEdit?.permissions) setGroupPermissions(groupToEdit.permissions);
            }
            getPermissions()
          }
        },
        [open],
    );
      
    const [groupPermissions, setGroupPermissions] = React.useState([]);
    const [permissions, setPermissions] = React.useState([])
    const [getPermissions, { loadingPermissions }] = useLazyQuery(GET_PERMISSIONS, {
        fetchPolicy: "network-only",
        onCompleted: (data) => setPermissions(data.permissions),
        onError: (err) => console.log(err),
    })

  return (
    <div>
        
            <BootstrapDialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {groupToEdit ? 'Modifer un groupe' : 'Ajouter un groupe'}
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
                                    <TheTextField variant="outlined" label="Nom de groupe" id="name"
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
                                <Divider variant="middle" />
                            </Grid>
                            <Grid  item xs={12} sm={12} md={12} sx={{ p: 2 }}>
                                <TransferList left={permissions} setLeft={setPermissions}
                                right={groupPermissions} setRight={setGroupPermissions}
                                title="Permissions"/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" variant="contained" disabled={!formik.isValid || loadingPost || loadingPut}>Valider</Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
    </div>
  );
}
