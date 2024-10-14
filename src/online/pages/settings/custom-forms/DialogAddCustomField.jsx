import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, InputAdornment, MenuItem, Paper, Stack } from '@mui/material';
import { useMutation } from '@apollo/client';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  POST_CUSTOM_FIELD,
  PUT_CUSTOM_FIELD,
} from '../../../../_shared/graphql/mutations/CustomFieldMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { FIELD_TYPE_CHOICES } from '../../../../_shared/tools/constants';
import { Close } from '@mui/icons-material';

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

export default function DialogAddCustomField({ open, onClose, customField, customFieldToEdit }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({
    formModel: yup.string('Entrez formModel').required(`Le formModel est obligatoire`),
    fieldType: yup.string('Entrez le type').required(`Le type est obligatoire`),
  });
  const initialValues = {
    formModel: customField.formModel,
    fieldType : FIELD_TYPE_CHOICES.TEXT,
    label : '',
    options : [],
  }
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleOk(values);
    },
  });
  const [createCustomField, { loading: loadingPost }] = useMutation(POST_CUSTOM_FIELD, {
    onCompleted: (customField) => {
      console.log(customField);
      onClose(formik.values);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
    },
    update(cache, { data: { createCustomField } }) {
      const newCustomField = createCustomField.customField;

      cache.modify({
        fields: {
          customFields(existingCustomFields = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingCustomFields.totalCount + 1,
              nodes: [newCustomField, ...existingCustomFields.nodes],
            };
          },
        },
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
  const [updateCustomField, { loading: loadingPut }] = useMutation(PUT_CUSTOM_FIELD, {
    onCompleted: (customField) => {
      console.log(customField);
      onClose(customField.updateCustomField.customField);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
    },
    update(cache, { data: { updateCustomField } }) {
      const updatedCustomField = updateCustomField.customField;

      cache.modify({
        fields: {
          customFields(existingCustomFields = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedCustomFields = existingCustomFields.nodes.map((customField) =>
              readField('id', customField) === updatedCustomField.id ? updatedCustomField : customField,
            );

            return {
              totalCount: existingCustomFields.totalCount,
              nodes: updatedCustomFields,
            };
          },
        },
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
  const [errors, setErrors] = React.useState([]);
  const handleOk = (customFieldForm) => {
    if (customFieldToEdit)
      updateCustomField({
        variables: {
          id: customFieldForm.id,
          customFieldData: customFieldForm
        }
      });
    else
      createCustomField({
        variables: {
          customFieldData: customFieldForm
        },
      });
  };
  React.useEffect(() => {
    if (open) {
      formik.setValues(initialValues);
      if (customFieldToEdit) {
        let { __typename, ...customFieldCopy } = customFieldToEdit;
        if (!customFieldCopy?.options) customFieldCopy['options'] = [];
        const items = [];
        customFieldCopy.options.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        customFieldCopy.options = items;
        formik.setValues(customFieldCopy);
      }
    }
  }, [open]);

  const addOptionItem = () => {
    formik.setValues({
      ...formik.values,
      options: [
        ...formik.values.options,
        { label: ''},
      ],
    });
  };

  const removeOptionItem = (index) => {
    const updatedOptions = [...formik.values.options];
    updatedOptions.splice(index, 1);

    formik.setValues({
      ...formik.values,
      options: updatedOptions,
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
          {customFieldToEdit ? 'Modifer un champ' : 'Ajouter un champ'} "
          {customField?.name}"
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Item>
                  <TheTextField
                    select
                    label="Field Type"
                    value={formik.values.fieldType}
                    onChange={(e) =>
                      formik.setFieldValue('fieldType', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                    fullWidth
                    required
                  >
                    {FIELD_TYPE_CHOICES.ALL.map((item, index) => (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TheTextField>
                </Item>
                {formik.values.fieldType === 'SELECT' && <>
                  <Grid item xs={12}>
                      {formik.values?.options?.map((item, index) => (
                        <Grid
                          container
                          key={index}
                        >
                          <Grid item xs={12} sm={12} md={12} >
                            <Item>
                              <TheTextField
                                variant="outlined"
                                size="small"
                                label="label"
                                value={item.label}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `options.${index}.label`,
                                    e.target.value,
                                  )
                                }
                                  disabled={loadingPost || loadingPut}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          onClick={() => removeOptionItem(index)}
                                          edge="end"
                                        >
                                          <Close />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                            </Item>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item
                    >
                      <Paper
                        variant="outlined"
                        onClick={()=> {if(!loadingPost && !loadingPut) addOptionItem()}}
                        sx={{fontStyle: 'italic', fontSize: 12, padding: 1}}
                      >
                        Cliquer pour Ajouter une option
                      </Paper>
                    </Grid>
                  </>
                }
              </Grid>
              <Grid item xs={12} sm={6}>
                <Item>
                  <TheTextField
                    label="Label"
                    value={formik.values.label}
                    onChange={(e) =>
                      formik.setFieldValue('label', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                    fullWidth
                    required
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
