import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  Stack,
  Box,
  Typography,
  InputAdornment,
  Button,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_VALIDATION_WORKFLOW } from '../../../../_shared/graphql/queries/ValidationWorkflowQueries';
import {
  POST_VALIDATION_WORKFLOW,
  PUT_VALIDATION_WORKFLOW,
} from '../../../../_shared/graphql/mutations/ValidationWorkflowMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddValidationWorkflowForm({ idValidationWorkflow, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    requestType: yup
      .string('Entrez le type')
      .required('Le type est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      requestType: '',
      description: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let validationWorkflowFormCopy = {...values};
      if (validationWorkflowFormCopy.id && validationWorkflowFormCopy.id != '') {
        onUpdateValidationWorkflow({
          id: validationWorkflowCopy.id,
          validationWorkflowData: validationWorkflowCopy,
        });
      } else
        createValidationWorkflow({
          variables: {
            validationWorkflowData: validationWorkflowCopy,
            photo: photo,
            coverImage: coverImage,
          },
        });
    },
  });
  const [createValidationWorkflow, { loading: loadingPost }] = useMutation(
    POST_VALIDATION_WORKFLOW,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...validationWorkflowCopy } = data.createValidationWorkflow.validationWorkflow;
        //   formik.setValues(validationWorkflowCopy);
        navigate('/online/parametres/workflows/liste');
      },
      update(cache, { data: { createValidationWorkflow } }) {
        const newValidationWorkflow = createValidationWorkflow.validationWorkflow;

        cache.modify({
          fields: {
            validationWorkflows(existingValidationWorkflows = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingValidationWorkflows.totalCount + 1,
                nodes: [newValidationWorkflow, ...existingValidationWorkflows.nodes],
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
    },
  );
  const [updateValidationWorkflow, { loading: loadingPut }] = useMutation(PUT_VALIDATION_WORKFLOW, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...validationWorkflowCopy } = data.updateValidationWorkflow.validationWorkflow;
      //   formik.setValues(validationWorkflowCopy);
      navigate('/online/parametres/workflows/liste');
    },
    update(cache, { data: { updateValidationWorkflow } }) {
      const updatedValidationWorkflow = updateValidationWorkflow.validationWorkflow;

      cache.modify({
        fields: {
          validationWorkflows(
            existingValidationWorkflows = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedValidationWorkflows = existingValidationWorkflows.nodes.map((validationWorkflow) =>
              readField('id', validationWorkflow) === updatedValidationWorkflow.id
                ? updatedValidationWorkflow
                : validationWorkflow,
            );

            return {
              totalCount: existingValidationWorkflows.totalCount,
              nodes: updatedValidationWorkflows,
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
  const onUpdateValidationWorkflow = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateValidationWorkflow({ variables });
      },
    });
  };
  const [getValidationWorkflow, { loading: loadingValidationWorkflow }] = useLazyQuery(
    GET_VALIDATION_WORKFLOW,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...validationWorkflowCopy } = data.validationWorkflow;
        formik.setValues(validationWorkflowCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idValidationWorkflow) {
      getValidationWorkflow({ variables: { id: idValidationWorkflow } });
    }
  }, [idValidationWorkflow]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingValidationWorkflow && <ProgressService type="form" />}
      {!loadingValidationWorkflow && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Type"
                  id="requestType"
                  value={formik.values.requestType}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('requestType', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.requestType && Boolean(formik.errors.requestType)
                  }
                  helperText={
                    formik.touched.requestType && formik.errors.requestType
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/parametres/workflows/liste"
                  className="no_style"
                >
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPost || loadingPut}
                >
                  Valider
                </Button>
              </Item>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}
