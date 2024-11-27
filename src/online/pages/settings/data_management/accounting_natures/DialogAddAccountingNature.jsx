import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  POST_ACCOUNTING_NATURE,
  PUT_ACCOUNTING_NATURE,
} from '../../../../../_shared/graphql/mutations/DataMutations';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import { GET_ACCOUNTING_NATURES } from '../../../../../_shared/graphql/queries/DataQueries';

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

export default function DialogAddAccountingNature({ open, onClose, accountingNatureParent, accountingNatureToEdit }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de élément')
      .required(`Le nom est obligatoire`),
  });
  const formik = useFormik({
    initialValues: { code: '', name: '', description: '', parent: accountingNatureParent?.id || null },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleOk(values);
    },
  });
  
  const [createAccountingNature, { loading: loadingPost }] = useMutation(POST_ACCOUNTING_NATURE, {
    onCompleted: (data) => {
      console.log(data);
      onClose(data?.createAccountingNature?.accountingNature);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
    },
    refetchQueries: [{ query: GET_ACCOUNTING_NATURES }],
    update(cache, { data: { createAccountingNature } }) {
      const newAccountingNature = createAccountingNature.accountingNature;
      const parentId = accountingNatureParent?.id;
  
      const addChildRecursively = (nodes, newNode, parentId, readField) => {
        return nodes.map(accountingNature => {
          // Si on trouve le parent, on ajoute le nouvel enfant à ses enfants
          const accountingNatureChildren = readField('children', accountingNature)
          if (readField('id', accountingNature) === parentId) {
            const children = accountingNatureChildren || [];
            const childrenNumber = accountingNature.childrenNumber || 0;
            return {
              ...accountingNature,
              childrenNumber: childrenNumber + 1,
              children: [...children, newNode],
            };
          }
          // Si cet enfant a des enfants, on appelle la fonction récursivement
          if (accountingNatureChildren && accountingNatureChildren.length > 0) {
            const childrenNumber = accountingNature.childrenNumber || 0;
            return {
              ...accountingNature,
              childrenNumber: childrenNumber + 1,
              children: addChildRecursively(accountingNatureChildren, newNode, parentId, readField),
            };
          }
          return accountingNature;
        });
      };
  
      cache.modify({
        fields: {
          accountingNatures(existingAccountingNatures = { totalCount: 0, nodes: [] }, { readField }) {
            let updatedNodes = [...existingAccountingNatures.nodes];
  
            if (parentId) {
              // Si un parent existe, on ajoute le nouvel élément dans ses enfants (ou enfants des enfants)
              updatedNodes = addChildRecursively(updatedNodes, newAccountingNature, parentId, readField);
            } else {
              // Sinon, l'ajouter à la liste principale
              updatedNodes = [...updatedNodes, newAccountingNature];
            }
            console.log({
              totalCount: existingAccountingNatures.totalCount + 1,
              nodes: updatedNodes,
            })
            return {
              totalCount: existingAccountingNatures.totalCount + 1,
              nodes: updatedNodes,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non ajouté ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  
  const [updateAccountingNature, { loading: loadingPut }] = useMutation(PUT_ACCOUNTING_NATURE, {
    onCompleted: (data) => {
      console.log(data);
      onClose(data.updateAccountingNature.accountingNature);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
    },
    refetchQueries: [{ query: GET_ACCOUNTING_NATURES }],
    update(cache, { data: { updateAccountingNature } }) {
      const updatedAccountingNature = updateAccountingNature.accountingNature;
      const parentId = accountingNatureParent?.id;
  
      const updateChildRecursively = (nodes, updatedNode) => {
        return nodes.map(accountingNature => {
          // Si c'est le bon node à mettre à jour
          if (accountingNature.id === updatedNode.id) {
            return updatedNode;
          }
  
          // Si cet élément a des enfants, on les met à jour récursivement
          if (accountingNature.children && accountingNature.children.length > 0) {
            return {
              ...accountingNature,
              children: updateChildRecursively(accountingNature.children, updatedNode),
            };
          }
  
          return accountingNature;
        });
      };
  
      cache.modify({
        fields: {
          accountingNatures(existingAccountingNatures = { totalCount: 0, nodes: [] }, { readField }) {
            let updatedNodes = existingAccountingNatures.nodes.map(accountingNature => {
              if (readField('id', accountingNature) === updatedAccountingNature.id) {
                return updatedAccountingNature;
              }
  
              // Si un parent existe et contient des enfants, mettre à jour dans les enfants imbriqués
              if (parentId) {
                return {
                  ...accountingNature,
                  children: updateChildRecursively(accountingNature.children || [], updatedAccountingNature),
                };
              }
  
              return accountingNature;
            });
  
            return {
              totalCount: existingAccountingNatures.totalCount,
              nodes: updatedNodes,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  

  const [errors, setErrors] = React.useState([]);
  const handleOk = (values) => {
    let accountingNatureCopy = {...values};
    if (accountingNatureToEdit)
      updateAccountingNature({
        variables: {
          id: accountingNatureToEdit.id,
          accountingNatureData: accountingNatureCopy
        },
      });
    else
      createAccountingNature({
        variables: {
            accountingNatureData: accountingNatureCopy
        },
      });
  };
  React.useEffect(() => {
    if (open) {
      formik.setValues({ code: '', name: '', description: '', parent: accountingNatureParent?.id || null });
      if (accountingNatureToEdit) {
        formik.setValues({ ...formik.values,
                            id: accountingNatureToEdit.id,
                            code: accountingNatureToEdit.code,
                            name: accountingNatureToEdit.name,
                            description: accountingNatureToEdit.description,
                            parent: accountingNatureParent?.id || null
                         });
      }
    }
  }, [open]);
  return (
    <Box>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {accountingNatureToEdit ? 'Modifer une nature' : 'Ajouter une nature'}
            {accountingNatureParent && <em> dans {accountingNatureParent?.name}</em>}
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
              <Grid item xs={12} sm={12} md={4}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Code"
                    value={formik.values.code}
                    onChange={(e) =>
                      formik.setFieldValue('code', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Nom"
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
                    rows={3}
                    value={formik.values.description}
                    onChange={(e) =>
                      formik.setFieldValue('description', e.target.value)
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
    </Box>
  );
}
