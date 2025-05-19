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
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
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
import { WORKFLOW_FALLBACK_TYPES, WORKFLOW_REQUEST_TYPES, WORKFLOW_VALIDATOR_TYPES } from '../../../../_shared/tools/constants';
import { getWorkflowFallbackTypeLabel } from '../../../../_shared/tools/functions';
import FallbackRuleList from './FallbackRuleList';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { ROLES } from '../../../../_shared/components/app/menu/CustomizedRolesLabelMenu';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { GET_DATAS_VALIDATION_WORKFLOW } from '../../../../_shared/graphql/queries/DataQueries';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_EMPLOYEE_GROUPS } from '../../../../_shared/graphql/queries/EmployeeGroupQueries';

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
      requestType: WORKFLOW_REQUEST_TYPES?.LEAVE,
      description: '',
      validationSteps:[{
      order: 0,
      comment: '',
      validationRules:[
        { 
          targetEmployeeGroups: [],
          targetEmployees: [],
          targetRoles: [],
          targetPositions: [],
          validatorType: WORKFLOW_VALIDATOR_TYPES.ROLE,
          validatorEmployees: [],
          validatorRoles: [],
          validatorPositions: [],
        }
      ],
      fallbackRules:[
        {
          fallbackType: WORKFLOW_FALLBACK_TYPES.REPLACEMENT,
          fallbackRoles: [],
          fallbackEmployees: [],
          fallbackPositions: [],
          order: 0
        },
        {
          fallbackType: WORKFLOW_FALLBACK_TYPES.HIERARCHY,
          fallbackRoles: [],
          fallbackEmployees: [],
          fallbackPositions: [],
          order: 1
        },
        {
          fallbackType: WORKFLOW_FALLBACK_TYPES.ADMIN,
          fallbackRoles: [],
          fallbackEmployees: [],
          fallbackPositions: [],
          order: 2
        }
      ]
      }
      ]

    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let validationWorkflowCopy = {...values};
      if (validationWorkflowCopy.id && validationWorkflowCopy.id != '') {
        onUpdateValidationWorkflow({
          id: validationWorkflowCopy.id,
          validationWorkflowData: validationWorkflowCopy,
        });
      } else
        createValidationWorkflow({
          variables: {
            validationWorkflowData: validationWorkflowCopy,
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
  const [getEmployees, {
      loading: loadingEmployees,
      data: employeesData,
      error: employeesError,
      fetchMore: fetchMoreEmployees,
    }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 30 } });
    
    const onGetEmployees = (keyword)=>{
      getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 30 } })
    }

  const [getEmployeeGroups, {
      loading: loadingEmployeeGroups,
      data: employeeGroupsData,
      error: employeeGroupsError,
      fetchMore: fetchMoreEmployeeGroups,
    }] = useLazyQuery(GET_EMPLOYEE_GROUPS, { variables: { employeeGroupFilter : null, page: 1, limit: 30 } });
    
    const onGetEmployeeGroups = (keyword)=>{
      getEmployeeGroups({ variables: { employeeGroupFilter : keyword === '' ? null : {keyword}, page: 1, limit: 30 } })
    }

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_VALIDATION_WORKFLOW, { fetchPolicy: 'network-only' });

  const [getValidationWorkflow, { loading: loadingValidationWorkflow }] = useLazyQuery(
    GET_VALIDATION_WORKFLOW,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, validationSteps, ...validationWorkflowCopy } = data.validationWorkflow;
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
                <FormControl fullWidth error={formik.touched.requestType && Boolean(formik.errors.requestType)}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    id="requestType"
                    name="requestType" 
                    value={formik.values.requestType}
                    onChange={(e) => formik.setFieldValue('requestType', e.target.value)}
                    disabled={loadingPost || loadingPut}
                    onBlur={formik.handleBlur}
                  >
                    {WORKFLOW_REQUEST_TYPES.ALL.map((state, index) => (
                      <MenuItem key={index} value={state.value}>
                        {state.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* Move helperText here */}
                  {formik.touched.requestType && formik.errors.requestType && (
                    <FormHelperText>{formik.errors.requestType}</FormHelperText>
                  )}
                </FormControl>
              </Item>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12}>
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
            </Grid> */}
            {formik.values?.validationSteps?.map((validationStep, indexStep) => 
              <Grid item xs={12} sm={12} md={12} key={indexStep}>
                <Box sx={{position: 'relative'}}>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{backgroundColor: indexStep%2 ? '' : '#f1f1f1', marginY:2, padding: 1, border: '1px solid #ccc'}}
                  >
                    {/* <Grid item xs={12} sm={12} md={12}>
                      <Item>
                        <TheTextField
                          variant="outlined"
                          label="Commentaire"
                          multiline
                          rows={4}
                          value={validationStep?.comment}
                          onChange={(e) =>
                            formik.setFieldValue(`validationSteps.${indexStep}.comment`, e.target.value)
                          }
                          disabled={loadingPost || loadingPut}
                        />
                      </Item>
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={12}>
                    {validationStep?.validationRules?.map((validationRule, indexRule) => 
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        key={indexRule}
                        sx={{backgroundColor: indexRule%2 ? '' : '#f1f1f1', marginY:2, padding: 1, border: '1px solid #ccc'}}
                      >
                        <Grid item xs={12} sm={6} md={6} >
                          <Item>
                            <TheAutocomplete
                              options={ROLES.filter(option=>option?.value!=='SUPER_ADMIN')}
                              label="Rôles demandeurs"
                              placeholder="Sélectionnez un ou plusieurs rôles"
                              limitTags={3}
                              value={validationRule.targetRoles}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.targetRoles`, newValue)
                              }
                            />
                          </Item>
                          <Item>
                            <SelectCheckmarks
                              options={dataData?.employeePositions || []}
                              label="Postes demandeurs"
                              placeholder="Ajouter un poste"
                              limitTags={3}
                              value={validationRule.targetPositions}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.targetPositions`, newValue)
                              }
                            />
                          </Item>
                          <Item>
                            <TheAutocomplete
                              options={employeeGroupsData?.employeeGroups?.nodes}
                              onInput={(e) => {
                                onGetEmployeeGroups(e.target.value)
                              }}
                              label="Groupes employé demandeurs"
                              placeholder="Sélectionnez un ou plusieurs groupes employé"
                              limitTags={3}
                              value={validationRule.targetEmployeeGroups}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.targetEmployeeGroups`, newValue)
                              }
                            />
                          </Item>
                          <Item>
                            <TheAutocomplete
                              options={employeesData?.employees?.nodes}
                              onInput={(e) => {
                                onGetEmployees(e.target.value)
                              }}
                              label="Employés demandeurs"
                              placeholder="Sélectionnez un ou plusieurs employés"
                              limitTags={3}
                              value={validationRule.targetEmployees}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.targetEmployees`, newValue)
                              }
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} >
                          <Item>
                            <TheAutocomplete
                              options={ROLES.filter(option=>option?.value!=='SUPER_ADMIN')}
                              label="Rôles validateurs"
                              placeholder="Sélectionnez un ou plusieurs rôles"
                              limitTags={3}
                              value={validationRule.validatorRoles}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.validatorRoles`, newValue)
                              }
                            />
                          </Item>
                          <Item>
                            <SelectCheckmarks
                              options={dataData?.employeePositions || []}
                              label="Postes validateurs"
                              placeholder="Ajouter un poste"
                              limitTags={3}
                              value={validationRule.validatorPositions}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.validatorPositions`, newValue)
                              }
                            />
                          </Item>
                          <Item>
                            <TheAutocomplete
                              options={employeesData?.employees?.nodes}
                              onInput={(e) => {
                                onGetEmployees(e.target.value)
                              }}
                              label="Employés validateurs"
                              placeholder="Sélectionnez un ou plusieurs employés"
                              limitTags={3}
                              value={validationRule.validatorEmployees}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`validationSteps.${indexStep}.validationRules.${indexRule}.validatorEmployees`, newValue)
                              }
                            />
                          </Item>
                        </Grid>
                      </Grid>
                    )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <FallbackRuleList
                        fallbackRules={validationStep?.fallbackRules || []}
                        formik={formik}
                        indexStep={indexStep}
                        loading={loadingPost || loadingPut}
                      />
                    </Grid>
                  </Grid>             
                </Box>
              </Grid>
            )}
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
