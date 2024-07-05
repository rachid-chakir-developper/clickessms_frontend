import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, Stepper, Step, StepLabel, StepContent, InputAdornment, IconButton } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_MEETING } from '../../../../_shared/graphql/queries/MeetingQueries';
import {
  POST_MEETING,
  PUT_MEETING,
} from '../../../../_shared/graphql/mutations/MeetingMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_DATAS_MEETING } from '../../../../_shared/graphql/queries/DataQueries';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { Close } from '@mui/icons-material';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddMeetingForm({ idMeeting, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    title: yup
      .string("Entrez l'objet de la réunion")
      .required("L'objet de la réunion est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      topic: '',
      meetingMode: 'SIMPLE',
      videoCallLink: '',
      startingDateTime: dayjs(new Date()),
      endingDateTime: dayjs(new Date()),
      description: '',
      observation: '',
      notes: '',
      participants: [],
      absentParticipants: [],
      beneficiaries: [],
      establishments: [],
      employee: null,
      meetingTypes: [],
      otherReasons: '',
      meetingDecisions: [],
      meetingReviewPoints: []
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let meetingCopy = { ...values };
      meetingCopy.participants = meetingCopy.participants.map((i) => i?.id);
      meetingCopy.absentParticipants = meetingCopy.absentParticipants.map((i) => i?.id);
      meetingCopy.beneficiaries = meetingCopy.beneficiaries.map((i) => i?.id);
      meetingCopy.meetingTypes = meetingCopy.meetingTypes.map((i) => i?.id);
      meetingCopy.establishments = meetingCopy.establishments.map((i) => i?.id);
      meetingCopy.employee = meetingCopy.employee ? meetingCopy.employee.id : null;
      if (!meetingCopy?.meetingDecisions) meetingCopy['meetingDecisions'] = [];
      let items = [];
      meetingCopy.meetingDecisions.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.employees = itemCopy.employees.map((i) => i?.id);
        items.push(itemCopy);
      });
      meetingCopy.meetingDecisions = items;
      if (!meetingCopy?.meetingReviewPoints) meetingCopy['meetingReviewPoints'] = [];
      items = [];
      meetingCopy.meetingReviewPoints.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      meetingCopy.meetingReviewPoints = items;
      if (idMeeting && idMeeting != '') {
        onUpdateMeeting({
          id: meetingCopy.id,
          meetingData: meetingCopy,
        });
      } else
        createMeeting({
          variables: {
            meetingData: meetingCopy,
          },
        });
    },
  });
  const {
    loading: loadingBeneficiaries,
    data: beneficiariesData,
    error: beneficiariesError,
    fetchMore: fetchMoreBeneficiaries,
  } = useQuery(GET_BENEFICIARIES, {
    fetchPolicy: 'network-only',
  });
  const {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'network-only',
  });
  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_MEETING, { fetchPolicy: 'network-only' });

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });

  
  const addMeetingDecision = () => {
    formik.setValues({
      ...formik.values,
      meetingDecisions: [
        ...formik.values.meetingDecisions,
        { decision: '', dueDate: null, employees:[]},
      ],
    });
  };

  const removeMeetingDecision = (index) => {
    const updatedReportItems = [...formik.values.meetingDecisions];
    updatedReportItems.splice(index, 1);

    formik.setValues({
      ...formik.values,
      meetingDecisions: updatedReportItems,
    });
  }; 
  const addMeetingReviewPoint = () => {
    formik.setValues({
      ...formik.values,
      meetingReviewPoints: [
        ...formik.values.meetingReviewPoints,
        { pointToReview: ''},
      ],
    });
  };

  const removeMeetingReviewPoint = (index) => {
    const updatedReportItems = [...formik.values.meetingReviewPoints];
    updatedReportItems.splice(index, 1);

    formik.setValues({
      ...formik.values,
      meetingReviewPoints: updatedReportItems,
    });
  };

  const [createMeeting, { loading: loadingPost }] = useMutation(POST_MEETING, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...meetingCopy } = data.createMeeting.meeting;
      //   formik.setValues(meetingCopy);
        formik.setFieldValue('id', meetingCopy.id);
        handleNext();
    },
    update(cache, { data: { createMeeting } }) {
      const newMeeting = createMeeting.meeting;

      cache.modify({
        fields: {
          meetings(existingMeetings = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingMeetings.totalCount + 1,
              nodes: [newMeeting, ...existingMeetings.nodes],
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
  const [updateMeeting, { loading: loadingPut }] = useMutation(PUT_MEETING, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...meetingCopy } = data.updateMeeting.meeting;
      //   formik.setValues(meetingCopy);
      // handleNext();
    },
    update(cache, { data: { updateMeeting } }) {
      const updatedMeeting = updateMeeting.meeting;

      cache.modify({
        fields: {
          meetings(
            existingMeetings = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedMeetings = existingMeetings.nodes.map((meeting) =>
              readField('id', meeting) === updatedMeeting.id
                ? updatedMeeting
                : meeting,
            );

            return {
              totalCount: existingMeetings.totalCount,
              nodes: updatedMeetings,
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
  const onUpdateMeeting = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateMeeting({ variables });
      },
    });
  };
  const [getMeeting, { loading: loadingMeeting }] = useLazyQuery(GET_MEETING, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...meetingCopy1 } = data.meeting;
      let { folder, ...meetingCopy } = meetingCopy1;
      meetingCopy.startingDateTime = dayjs(meetingCopy.startingDateTime);
      meetingCopy.endingDateTime = dayjs(meetingCopy.endingDateTime);
      meetingCopy.participants = meetingCopy.participants
        ? meetingCopy.participants.map((i) => i?.employee)
        : [];
      meetingCopy.beneficiaries = meetingCopy.beneficiaries
        ? meetingCopy.beneficiaries.map((i) => i?.beneficiary)
        : [];
        meetingCopy.establishments =
        meetingCopy.establishments
          ? meetingCopy.establishments.map((i) => i?.establishment)
          : [];
        
        if (!meetingCopy?.meetingDecisions) meetingCopy['meetingDecisions'] = [];
        let items = [];
        meetingCopy.meetingDecisions.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.dueDate = itemCopy.dueDate ? dayjs(itemCopy.dueDate): null;
          items.push(itemCopy);
        });
        meetingCopy.meetingDecisions = items;

        items = [];
        if (!meetingCopy?.meetingReviewPoints) meetingCopy['meetingReviewPoints'] = [];
        meetingCopy.meetingReviewPoints.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        meetingCopy.meetingReviewPoints = items;
      formik.setValues(meetingCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idMeeting) {
      getMeeting({ variables: { id: idMeeting } });
    }
  }, [idMeeting]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idMeeting) {
      getMeeting({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 1) navigate('/online/administratif/reunions/liste');
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
      <Typography component="div" variant="h5">
        {title} {formik.values.title}
      </Typography>
      {loadingMeeting && <ProgressService type="form" />}
      {!loadingMeeting && (
        <form onSubmit={formik.handleSubmit}>
          
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idMeeting ? true : false}
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
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Libellé"
                        id="title"
                        value={formik.values.title}
                        required
                        onChange={(e) =>
                          formik.setFieldValue('title', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheDateTimePicker
                        label="Date et heure de début"
                        value={formik.values.startingDateTime}
                        onChange={(date) =>
                          formik.setFieldValue('startingDateTime', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheDateTimePicker
                        label="Date de fin"
                        value={formik.values.endingDateTime}
                        onChange={(date) =>
                          formik.setFieldValue('endingDateTime', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <SelectCheckmarks
                        options={dataData?.meetingTypes}
                        label="Type de réunion"
                        placeholder="Ajouter un type"
                        limitTags={3}
                        value={formik.values.meetingTypes}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('meetingTypes', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Structures concernées"
                        placeholder="Ajouter une tructure"
                        limitTags={3}
                        value={formik.values.establishments}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('establishments', newValue)
                        }
                      />
                    </Item>
                    <Item>
                      <TheAutocomplete
                        options={beneficiariesData?.beneficiaries?.nodes}
                        label="Bénificiaires concernés"
                        placeholder="Ajouter un bénificiaire"
                        limitTags={3}
                        value={formik.values.beneficiaries}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('beneficiaries', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheAutocomplete
                        options={employeesData?.employees?.nodes}
                        label="Personnes invités"
                        placeholder="Ajouter une personne"
                        limitTags={3}
                        value={formik.values.participants}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('participants', newValue)
                        }
                      />
                    </Item>
                    <Item>
                      <TheAutocomplete
                        options={employeesData?.employees?.nodes}
                        label="Personnes absentes"
                        placeholder="Ajouter une personne"
                        limitTags={3}
                        value={formik.values.absentParticipants}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('absentParticipants', newValue)
                        }
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
                  <Typography variant="caption">Compte-rendu</Typography>
                }
              >
                Compte-rendu 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  
                  <Grid item xs={12} sm={12} md={12}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Prise de notes"
                        multiline
                        minRows={6}
                        value={formik.values.notes}
                        onChange={(e) =>
                          formik.setFieldValue('notes', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} > 
                    <Typography variant="h6">Les décisions</Typography> 
                    {formik.values?.meetingDecisions?.map((item, index) => (
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        key={index}
                      >
                        <Grid item xs={12} sm={12} md={12} >
                          <Item sx={{position: 'relative'}}>
                            <TheTextField
                              variant="outlined"
                              label="Décision"
                              multiline
                              rows={2}
                              value={item.decision}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `meetingDecisions.${index}.decision`,
                                  e.target.value,
                                )
                              }
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeMeetingDecision(index)}
                              edge="end"
                              color="error"
                            >
                              <Close />
                            </IconButton>
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={5} >
                          <Item>
                            <TheDesktopDatePicker
                              label="Échéance"
                              value={item.dueDate}
                              onChange={(date) =>
                                formik.setFieldValue(`meetingDecisions.${index}.dueDate`, date)
                              }
                              disabled={loadingPost || loadingPut}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7} >
                          <Item>
                            <TheAutocomplete
                              options={employeesData?.employees?.nodes}
                              label="Personnes concernées"
                              placeholder="Ajouter une personne"
                              limitTags={3}
                              value={item.employees}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`meetingDecisions.${index}.employees`, newValue)
                              }
                            />
                          </Item>
                      </Grid>
                      </Grid>
                    ))}
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item
                      sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom:4 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addMeetingDecision}
                        disabled={loadingPost || loadingPut}
                      >
                        Ajouter une décision
                      </Button>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={6} item sx={{background: '#f9f9f9'}}>
                    <Typography variant="h6">Les points à revoir</Typography>  
                    {formik.values?.meetingReviewPoints?.map((item, index) => (
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        key={index}
                      >
                        <Grid item xs={12} sm={12} md={12} >
                          <Item sx={{position: 'relative'}}>
                            <TheTextField
                              variant="outlined"
                              label="Point à revoir"
                              multiline
                              rows={2}
                              value={item.pointToReview}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `meetingReviewPoints.${index}.pointToReview`,
                                  e.target.value,
                                )
                              }
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeMeetingReviewPoint(index)}
                              edge="end"
                              color="error"
                            >
                              <Close />
                            </IconButton>
                          </Item>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item
                      sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom:4 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addMeetingReviewPoint}
                        disabled={loadingPost || loadingPut}
                      >
                        Ajouter un point à revoir
                      </Button>
                    </Grid>
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
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/administratif/reunions/liste"
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
