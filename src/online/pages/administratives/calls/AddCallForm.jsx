import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  Stack,
  Box,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_CALL } from '../../../../_shared/graphql/queries/CallQueries';
import {
  POST_CALL,
  PUT_CALL,
} from '../../../../_shared/graphql/mutations/CallMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import SearchNumbersAutocomplete from '../../../../_shared/components/form-fields/SearchNumbersAutocomplete';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCallForm({ idCall, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      title: '',
      callType: 'INCOMING',
      entryDateTime: dayjs(new Date()),
      description: '',
      observation: '',
      isActive: true,
      isCreateUndesirableEventFrom: false,
      establishments: [],
      employees: [],
      beneficiaries: [],
      employee: null,
      caller: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...callCopy } = values;
      callCopy.establishments = callCopy.establishments.map((i) => i?.id);
      callCopy.employees = callCopy.employees.map((i) => i?.id);
      callCopy.beneficiaries = callCopy.beneficiaries.map((i) => i?.id);
      console.log('callCopy.caller****************', callCopy.caller);
      if (typeof callCopy?.caller === 'string') {
        callCopy.caller = { phone: callCopy.caller, callerType: 'PhoneNumber' };
      } else {
        switch (callCopy?.caller?.callerType) {
          case 'Employee':
            callCopy.caller = {
              employee: callCopy.caller.caller.id,
              callerType: 'Employee',
            };
            break;
          case 'Client':
            callCopy.caller = {
              client: callCopy.caller.caller.id,
              callerType: 'Client',
            };
            break;
          case 'Beneficiary':
            callCopy.caller = {
              beneficiary: callCopy.caller.caller.id,
              callerType: 'Beneficiary',
            };
            break;
          case 'Supplier':
            callCopy.caller = {
              supplier: callCopy.caller.caller.id,
              callerType: 'Supplier',
            };
            break;
          case 'Establishment':
            callCopy.caller = {
              establishment: callCopy.caller.caller.id,
              callerType: 'Establishment',
            };
            break;
          case 'Partner':
            callCopy.caller = {
              partner: callCopy.caller.caller.id,
              callerType: 'Partner',
            };
            break;

          default:
            callCopy.caller = {
              phoneNumber: callCopy.caller.caller.id,
              callerType: 'PhoneNumber',
            };
            break;
        }
      }
      if (idCall && idCall != '') {
        onUpdateCall({
          id: callCopy.id,
          callData: callCopy,
          image: image,
        });
      } else
        createCall({
          variables: {
            callData: callCopy,
            image: image,
          },
        });
    },
  });
   const [getBeneficiaries, {
    loading: loadingBeneficiaries,
    data: beneficiariesData,
    error: beneficiariesError,
    fetchMore: fetchMoreBeneficiaries,
  }] = useLazyQuery(GET_BENEFICIARIES, { variables: { beneficiaryFilter : null, page: 1, limit: 10 } });

  const onGetBeneficiaries = (keyword)=>{
    getBeneficiaries({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }
  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });

const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }


  const [createCall, { loading: loadingPost }] = useMutation(POST_CALL, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...callCopy } = data.createCall.call;
      //   formik.setValues(callCopy);
      navigate('/online/administratif/appels/liste');
    },
    update(cache, { data: { createCall } }) {
      const newCall = createCall.call;

      cache.modify({
        fields: {
          calls(existingCalls = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingCalls.totalCount + 1,
              nodes: [newCall, ...existingCalls.nodes],
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
  const [updateCall, { loading: loadingPut }] = useMutation(PUT_CALL, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...callCopy } = data.updateCall.call;
      //   formik.setValues(callCopy);
      navigate('/online/administratif/appels/liste');
    },
    update(cache, { data: { updateCall } }) {
      const updatedCall = updateCall.call;

      cache.modify({
        fields: {
          calls(existingCalls = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedCalls = existingCalls.nodes.map((call) =>
              readField('id', call) === updatedCall.id ? updatedCall : call,
            );

            return {
              totalCount: existingCalls.totalCount,
              nodes: updatedCalls,
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
  const onUpdateCall = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCall({ variables });
      },
    });
  };
  const [getCall, { loading: loadingCall }] = useLazyQuery(GET_CALL, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...callCopy1 } = data.call;
      let { folder, ...callCopy } = callCopy1;
      callCopy.entryDateTime = callCopy.entryDateTime ? dayjs(callCopy.entryDateTime) : null;
      
      callCopy.establishments =
      callCopy.establishments
        ? callCopy.establishments.map((i) => i?.establishment)
        : [];    

      callCopy.employees =
      callCopy.employees
        ? callCopy.employees.map((i) => i?.employee)
        : [];
      callCopy.beneficiaries = callCopy.beneficiaries
        ? callCopy.beneficiaries.map((i) => i?.beneficiary)
        : [];
      switch (callCopy?.caller?.callerType) {
        case 'Employee':
          callCopy.caller = {
            caller: callCopy.caller.employee,
            callerType: 'Employee',
          };
          break;
        case 'Client':
          callCopy.caller = {
            caller: callCopy.caller.client,
            callerType: 'Client',
          };
          break;
        case 'Beneficiary':
          callCopy.caller = {
            caller: callCopy.caller.beneficiary,
            callerType: 'Beneficiary',
          };
          break;
        case 'Supplier':
          callCopy.caller = {
            caller: callCopy.caller.supplier,
            callerType: 'Supplier',
          };
          break;
        case 'Establishment':
          callCopy.caller = {
            caller: callCopy.caller.establishment,
            callerType: 'Establishment',
          };
          break;
        case 'Partner':
          callCopy.caller = {
            caller: callCopy.caller.partner,
            callerType: 'Partner',
          };
          break;

        default:
          callCopy.caller = {
            caller: callCopy.caller.phoneNumber,
            callerType: 'PhoneNumber',
          };
          break;
      }
      console.log(callCopy.caller);

      formik.setValues(callCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idCall) {
      getCall({ variables: { id: idCall } });
    }
  }, [idCall]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.title}
      </Typography>
      {loadingCall && <ProgressService type="form" />}
      {!loadingCall && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  id="title"
                  value={formik.values.title}
                  onChange={(e) =>
                    formik.setFieldValue('title', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Type d'appel</InputLabel>
                  <Select
                    value={formik.values.callType}
                    onChange={(e) =>
                      formik.setFieldValue('callType', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value="INCOMING">Entrant</MenuItem>
                    <MenuItem value="OUTGOING">Sortant</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheDateTimePicker
                  label="Date et heure"
                  value={formik.values.entryDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('entryDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item></Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <SearchNumbersAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                        onInput={(e) => {
                          onGetBeneficiaries(e.target.value)
                        }}
                  label="Qui a appelé ?"
                  placeholder="qui a appelé ?"
                  value={formik.values.caller}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('caller', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structures concernées"
                  placeholder="Ajouter une structure"
                  limitTags={3}
                  value={formik.values.establishments}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishments', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                  label="Employées concernées"
                  placeholder="Ajouter un employé"
                  value={formik.values.employees}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employees', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                        onInput={(e) => {
                          onGetBeneficiaries(e.target.value)
                        }}
                  label="Personnes accompagnées"
                  placeholder="Ajouter une personne accompagnée"
                  limitTags={3}
                  value={formik.values.beneficiaries}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiaries', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Commentaire"
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
                  to="/online/administratif/appels/liste"
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
