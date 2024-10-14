import React, { useState } from 'react';
import { TextField, Button, MenuItem, Grid, InputAdornment, IconButton, styled, Stack, Paper, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { POST_CUSTOM_FIELD, PUT_CUSTOM_FIELD } from '../../../graphql/mutations/CustomFieldMutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CUSTOM_FIELDS } from '../../../graphql/queries/CustomFieldQueries';
import TheTextField from '../TheTextField';
import { Close, Done } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'DATE', label: 'Date' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'SELECT', label: 'Select' },
  // Add more field types if necessary
];

export default function CustomFieldForm({ formModel, values =[] }) {
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      formModel,
      fieldType : '',
      label : '',
      key : '',
      options : [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert()
      if (values.id && values.id != '') {
        onUpdateCustomField({
          id: customFieldCopy.id,
          customFieldData: customFieldCopy,
        });
      } else createCustomField({
        variables: {
          customFieldData: customFieldCopy,
        },
      });
    },
  });


  const [createCustomField, { loading: loadingPost }] = useMutation(POST_CUSTOM_FIELD, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...customFieldCopy } = data.createCustomField.customField;
      //   formik.setValues(customFieldCopy);
      navigate('/online/ressources-humaines/employes/contrats/liste');
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
        message: 'Non ajouté ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [updateCustomField, { loading: loadingPut }] = useMutation(PUT_CUSTOM_FIELD, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...customFieldCopy } = data.updateCustomField.customField;
      //   formik.setValues(customFieldCopy);
      navigate('/online/ressources-humaines/employes/contrats/liste');
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
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const onUpdateCustomField = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCustomField({ variables });
      },
    });
  };
  const [
    getCustomFields,
    {
      loading: loadingCustomFields,
      data: customFieldsData,
      error: customFieldsError,
      fetchMore: fetchMoreCustomFields,
    },
  ] = useLazyQuery(GET_CUSTOM_FIELDS);

  React.useEffect(() => {
    if (formModel) {
      getCustomFields({ variables: { customFieldFilter:{formModel} } });
    }
  }, [formModel]);
  
  const addOptionItem = () => {
    formik.setValues({
      ...formik.values,
      options: [
        ...formik.values.options,
        { label: '', value: ''},
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
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
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
              {FIELD_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
                    <Grid item xs={12} sm={12} md={6} >
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
                          />
                      </Item>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} >
                      <Item>
                        <TheTextField
                          variant="outlined"
                          size="small"
                          label="value"
                          value={item.value}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `options.${index}.value`,
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
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
          <Item>
            <TheTextField
              label="Key"
              value={formik.values.key}
              onChange={(e) =>
                formik.setFieldValue('key', e.target.value)
              }
              disabled={loadingPost || loadingPut}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Valider">
                      <IconButton
                        edge="end"
                        disabled={!formik.isValid || loadingPost || loadingPut}
                      >
                        <Done />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Item>
        </Grid>
      </Grid>
    </form>
  );
};