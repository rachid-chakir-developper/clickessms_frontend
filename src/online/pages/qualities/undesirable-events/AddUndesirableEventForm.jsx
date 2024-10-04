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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormHelperText,
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_UNDESIRABLE_EVENT } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import {
  POST_UNDESIRABLE_EVENT,
  PUT_UNDESIRABLE_EVENT,
} from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import {
  UNDESIRABLE_EVENT_SEVERITY,
  UNDESIRABLE_EVENT_TYPES,
} from '../../../../_shared/tools/constants';
import { GET_DATAS_UNDESIRABLE_EVENT } from '../../../../_shared/graphql/queries/DataQueries';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddUndesirableEventForm({ idUndesirableEvent, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    title: yup.string().required("Le libellé de l'événement indésirable est obligatoire"),
    frequency: yup.string().nullable().when('$activeStep', {
      is: 3,
      then: yup.string().nonNullable().required('La fréquence de l’événement est obligatoire à cette étape'),
    }),
  });
  
  const formik = useFormik({
    initialValues: {
      id: null,
      image: undefined,
      number: '',
      title: '',
      startingDateTime: dayjs(new Date()),
      endingDateTime: dayjs(new Date()),
      undesirableEventType: UNDESIRABLE_EVENT_TYPES.NORMAL,
      normalTypes: [],
      seriousTypes: [],
      otherTypes: '',
      frequency: null,
      severity: UNDESIRABLE_EVENT_SEVERITY.MEDIUM,
      actionsTakenText: '',
      courseFactsDateTime: dayjs(new Date()),
      courseFactsPlace: '',
      circumstanceEventText: '',
      concernedFamilies: '',
      isActive: true,
      establishments: [],
      employees: [],
      beneficiaries: [],
      notifiedPersons: [],
      otherNotifiedPersons: '',
      employee: null,
      declarants: [],
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, files, ...undesirableEventCopy } = values;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))
      undesirableEventCopy.declarants = undesirableEventCopy.declarants.map(
        (i) => i?.id,
      );
      undesirableEventCopy.establishments =
        undesirableEventCopy.establishments.map((i) => i?.id);
      undesirableEventCopy.employees = undesirableEventCopy.employees.map((i) => i?.id);
      undesirableEventCopy.beneficiaries =
        undesirableEventCopy.beneficiaries.map((i) => i?.id);
      undesirableEventCopy.notifiedPersons =
        undesirableEventCopy.notifiedPersons.map((i) => i?.id);
      undesirableEventCopy.normalTypes = undesirableEventCopy.normalTypes.map(
        (i) => i?.id,
      );
      undesirableEventCopy.seriousTypes = undesirableEventCopy.seriousTypes.map(
        (i) => i?.id,
      );
      undesirableEventCopy.employee = undesirableEventCopy.employee
        ? undesirableEventCopy.employee.id
        : null;
      if (undesirableEventCopy?.id && undesirableEventCopy?.id != '') {
        onUpdateUndesirableEvent({
          id: undesirableEventCopy.id,
          undesirableEventData: undesirableEventCopy,
          image: image,
          files
        });
      } else
        createUndesirableEvent({
          variables: {
            undesirableEventData: undesirableEventCopy,
            image: image,
            files
          },
        });
    },
  });

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
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
  
  const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_UNDESIRABLE_EVENT, { fetchPolicy: 'network-only' });

  const [createUndesirableEvent, { loading: loadingPost }] = useMutation(
    POST_UNDESIRABLE_EVENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...undesirableEventCopy } = data.createUndesirableEvent.undesirableEvent;
        formik.setFieldValue('id', undesirableEventCopy.id);
        handleNext();
        // navigate('/online/qualites/evenements-indesirables/liste');
      },
      update(cache, { data: { createUndesirableEvent } }) {
        const newUndesirableEvent = createUndesirableEvent.undesirableEvent;

        cache.modify({
          fields: {
            undesirableEvents(
              existingUndesirableEvents = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingUndesirableEvents.totalCount + 1,
                nodes: [
                  newUndesirableEvent,
                  ...existingUndesirableEvents.nodes,
                ],
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
  const [updateUndesirableEvent, { loading: loadingPut }] = useMutation(
    PUT_UNDESIRABLE_EVENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...undesirableEventCopy } = data.updateUndesirableEvent.undesirableEvent;
        handleNext();
        // navigate('/online/qualites/evenements-indesirables/liste');
      },
      update(cache, { data: { updateUndesirableEvent } }) {
        const updatedUndesirableEvent = updateUndesirableEvent.undesirableEvent;

        cache.modify({
          fields: {
            undesirableEvents(
              existingUndesirableEvents = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedUndesirableEvents =
                existingUndesirableEvents.nodes.map((undesirableEvent) =>
                  readField('id', undesirableEvent) ===
                  updatedUndesirableEvent.id
                    ? updatedUndesirableEvent
                    : undesirableEvent,
                );

              return {
                totalCount: existingUndesirableEvents.totalCount,
                nodes: updatedUndesirableEvents,
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
    },
  );
  const onUpdateUndesirableEvent = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateUndesirableEvent({ variables });
      },
    });
  };
  const [getUndesirableEvent, { loading: loadingUndesirableEvent }] =
    useLazyQuery(GET_UNDESIRABLE_EVENT, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, completionPercentage, ticket,  ...undesirableEventCopy } = data.undesirableEvent;
        undesirableEventCopy.frequency = undesirableEventCopy.frequency
          ? Number(undesirableEventCopy.frequency.id)
          : null;
        undesirableEventCopy.startingDateTime = dayjs(
          undesirableEventCopy.startingDateTime,
        );
        undesirableEventCopy.courseFactsDateTime = dayjs(
          undesirableEventCopy.courseFactsDateTime,
        );
        undesirableEventCopy.endingDateTime = dayjs(
          undesirableEventCopy.endingDateTime,
        );
        undesirableEventCopy.establishments =
          undesirableEventCopy.establishments
            ? undesirableEventCopy.establishments.map((i) => i?.establishment)
            : [];
        undesirableEventCopy.beneficiaries = undesirableEventCopy.beneficiaries
          ? undesirableEventCopy.beneficiaries.map((i) => i?.beneficiary)
          : [];
        undesirableEventCopy.employees = undesirableEventCopy.employees
          ? undesirableEventCopy.employees.map((i) => i?.employee)
          : [];
        undesirableEventCopy.notifiedPersons =
          undesirableEventCopy.notifiedPersons
            ? undesirableEventCopy.notifiedPersons.map((i) => i?.employee)
            : [];
        formik.setValues(undesirableEventCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idUndesirableEvent) {
      getUndesirableEvent({ variables: { id: idUndesirableEvent } });
    }
  }, [idUndesirableEvent]);

  React.useEffect(() => {
    if (searchParams.get('id') && !idUndesirableEvent) {
      getUndesirableEvent({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 3) navigate('/online/qualites/evenements-indesirables/liste');
    else if (formik.values.id)
      setSearchParams({ step: activeStep + 1, id: formik.values.id });
    else setSearchParams({ step: activeStep + 1 });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (formik.values.id)
      setSearchParams({ step: activeStep + 1, id: formik.values.id });
    else setSearchParams({ step: activeStep + 1 });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const onGoToStep = (step = 0) => {
    if (formik.values.id) {
      setActiveStep(step);
      setSearchParams({ step, id: formik.values.id });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5" sx={{ marginBottom: 4 }}>
        {title}: <em>{formik.values.title}</em>
      </Typography>
      {loadingUndesirableEvent && <ProgressService type="form" />}
      {!loadingUndesirableEvent && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idUndesirableEvent ? true : false}
          >
            <Step>
              <StepLabel
                onClick={() => onGoToStep(0)}
                optional={
                  <Typography variant="caption">Informations générales</Typography>
                }
              >
                Informations générales
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={4} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Libellé de l'EI"
                        id="title"
                        value={formik.values.title}
                        required
                        onChange={(e) =>
                          formik.setFieldValue('title', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.title && Boolean(formik.errors.title)
                        }
                        helperText={formik.touched.title && formik.errors.title}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <TheDateTimePicker
                        label="Date et heure du signalement"
                        value={formik.values.startingDateTime}
                        onChange={(date) =>
                          formik.setFieldValue('startingDateTime', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Structure(s) concernée(s)"
                        placeholder="Ajouter une structure"
                        limitTags={3}
                        value={formik.values.establishments}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('establishments', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={employeesData?.employees?.nodes}
                        onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}
                        label="Décalarant principal"
                        placeholder="Décalarant principal"
                        multiple={false}
                        value={formik.values.employee}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('employee', newValue)
                        }
                      />
                    </Item>
                    <Item>
                      <TheAutocomplete
                        options={employeesData?.employees?.nodes}
                        onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                        label="Autres décalarants"
                        placeholder="Ajouter un autre décalarant"
                        limitTags={3}
                        value={formik.values.declarants}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('declarants', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Type de l'événement indésirable
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Type de l'événement indésirable"
                          value={formik.values.undesirableEventType}
                          required
                          onChange={(e) =>
                            formik.setFieldValue(
                              'undesirableEventType',
                              e.target.value,
                            )
                          }
                        >
                          {UNDESIRABLE_EVENT_TYPES?.ALL?.map((type, index) => {
                            return (
                              <MenuItem key={index} value={type.value}>
                                {type.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    {formik.values.undesirableEventType ===
                      UNDESIRABLE_EVENT_TYPES.NORMAL && (
                      <Item>
                        <SelectCheckmarks
                          options={dataData?.undesirableEventNormalTypes}
                          label="Type (EI)"
                          placeholder="Ajouter un type (EI)"
                          limitTags={3}
                          value={formik.values.normalTypes}
                          onChange={(e, newValue) =>
                            formik.setFieldValue('normalTypes', newValue)
                          }
                        />
                      </Item>
                    )}
                    {formik.values.undesirableEventType ===
                      UNDESIRABLE_EVENT_TYPES.SERIOUS && (
                      <Item>
                        <SelectCheckmarks
                          options={dataData?.undesirableEventSeriousTypes}
                          label="Type (EIG)"
                          placeholder="Ajouter un type (EIG)"
                          limitTags={3}
                          value={formik.values.seriousTypes}
                          onChange={(e, newValue) =>
                            formik.setFieldValue('seriousTypes', newValue)
                          }
                        />
                      </Item>
                    )}
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Autre(s) type(s), préciser"
                        value={formik.values.otherTypes}
                        onChange={(e) =>
                          formik.setFieldValue('otherTypes', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(1)}
                optional={
                  <Typography variant="caption">Personne(s) concernée(s)</Typography>
                }
              >
                Personne(s) concernée(s)
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={4} md={4} >
                    <Item>
                      <TheAutocomplete
                        options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                        label="Professionnel(s) concerné(s)"
                        placeholder="Ajouter un professionnel"
                        limitTags={3}
                        value={formik.values.employees}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('employees', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={beneficiariesData?.beneficiaries?.nodes}
                        onInput={(e) => {
                          onGetBeneficiaries(e.target.value)
                        }}
                        label="Bénificiaire(s) concerné(s)"
                        placeholder="Ajouter un bénificiaire"
                        limitTags={3}
                        value={formik.values.beneficiaries}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('beneficiaries', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Famille(s) concernée(s)"
                        value={formik.values.concernedFamilies}
                        onChange={(e) =>
                          formik.setFieldValue('concernedFamilies', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(2)}
                optional={
                  <Typography variant="caption">Déroulement des faits</Typography>
                }
              >
                Déroulement des faits
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <TheDateTimePicker
                        label="Date et heure de déroulement des faits"
                        value={formik.values.courseFactsDateTime}
                        onChange={(date) =>
                          formik.setFieldValue('courseFactsDateTime', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Lieu de déroulement des faits"
                        value={formik.values.courseFactsPlace}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'courseFactsPlace',
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={8} md={8}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Circonstance de l’événement"
                        multiline
                        rows={5}
                        value={formik.values.circumstanceEventText}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'circumstanceEventText',
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Item>
                      <MultiFileField
                        variant="outlined"
                        label="Pièces jointes"
                        fileValue={formik.values.files}
                        onChange={(files) =>
                          formik.setFieldValue('files', files)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(3)}
                optional={
                  <Typography variant="caption">Informations complémentaires</Typography>
                }
              >
                Informations complémentaires
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <FormControl fullWidth error={Boolean(formik.errors.frequency)} required>
                        <InputLabel id="demo-simple-select-label">
                          Fréquence de l’événement
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="frequency"
                          label="Fréquence de l’événement"
                          value={formik.values.frequency}
                          onChange={(e) =>
                            formik.setFieldValue('frequency', e.target.value)
                          }
                          onBlur={formik.handleBlur}
                        >
                          <MenuItem value={null}>
                            <em>Choisissez une fréquence</em>
                          </MenuItem>
                          {dataData?.frequencies?.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.id}>
                                {data.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <FormHelperText>{formik.errors.frequency}</FormHelperText>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Item>
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Gravité de l’événement
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="severity"
                          label="Gravité de l’événement"
                          value={formik.values.severity}
                          required
                          onChange={(e) =>
                            formik.setFieldValue('severity', e.target.value)
                          }
                          onBlur={formik.handleBlur}
                          error={formik.touched.severity && Boolean(formik.errors.severity)}
                          helperText={formik.touched.severity && formik.errors.severity}
                        >
                          {UNDESIRABLE_EVENT_SEVERITY?.ALL?.map(
                            (type, index) => {
                              return (
                                <MenuItem key={index} value={type.value}>
                                  {type.label}
                                </MenuItem>
                              );
                            },
                          )}
                        </Select>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} >
                    <Item>
                      <TheAutocomplete
                        required
                        options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                        label="Personne(s) immédiatement prévenue(s)"
                        placeholder="Ajouter une personne"
                        limitTags={3}
                        value={formik.values.notifiedPersons}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('notifiedPersons', newValue)
                        }
                      />
                    </Item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Autres, préciser"
                        value={formik.values.otherNotifiedPersons}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'otherNotifiedPersons',
                            e.target.value,
                          )
                        }
                        helperText="Si vous ne trouvez pas la personne dans la liste ci-dessus."
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Mesure(s) prise(s) immédiatement"
                        multiline
                        rows={5}
                        value={formik.values.actionsTakenText}
                        onChange={(e) =>
                          formik.setFieldValue(
                            'actionsTakenText',
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
          </Stepper>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/qualites/evenements-indesirables/liste"
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
