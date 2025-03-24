import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, Step, StepLabel, StepContent, Stepper, Alert } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_JOB_CANDIDATE_INFORMATION_SHEET } from '../../../../../_shared/graphql/queries/JobCandidateInformationSheetQueries';
import {
  POST_JOB_CANDIDATE_INFORMATION_SHEET,
  PUT_JOB_CANDIDATE_INFORMATION_SHEET,
  PUT_JOB_CANDIDATE_INFORMATION_SHEET_FIELDS,
} from '../../../../../_shared/graphql/mutations/JobCandidateInformationSheetMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { GET_JOB_POSITIONS } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_DATAS_JOB_CANDIDATE_INFORMATION_SHEET } from '../../../../../_shared/graphql/queries/DataQueries';
import { JOB_CANDIDATE_INFORMATION_SHEET_STATUS, NOTIFICATION_PERIOD_UNITS } from '../../../../../_shared/tools/constants';
import { Close } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddJobCandidateInformationSheetForm({ accessToken, title }) {
   const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      isActive: true,
      jobPosition: null,
      description: '',
      observation: '',
      documentRecords: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let jobCandidateInformationSheetCopy = {...values};
      jobCandidateInformationSheetCopy.jobPosition = jobCandidateInformationSheetCopy.jobPosition
        ? jobCandidateInformationSheetCopy.jobPosition.id
        : null;
      jobCandidateInformationSheetCopy.jobCandidate = jobCandidateInformationSheetCopy.jobCandidate
        ? jobCandidateInformationSheetCopy.jobCandidate.id
        : null;
      
      let items = [];
      jobCandidateInformationSheetCopy.documentRecords.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      jobCandidateInformationSheetCopy.documentRecords = items;
      if (jobCandidateInformationSheetCopy?.id && jobCandidateInformationSheetCopy?.id != '') {
        onUpdateJobCandidateInformationSheet({
          accessToken: accessToken,
          jobCandidateInformationSheetData: jobCandidateInformationSheetCopy,
        });
      } else
        return
    },
  });
  
  const [getJobPositions, {
      loading: loadingJobPositions,
      data: jobPositionsData,
      error: jobPositionsError,
      fetchMore: fetchMoreJobPositions,
    }] = useLazyQuery(GET_JOB_POSITIONS, { variables: { jobPositionFilter : null, page: 1, limit: 10 } });
    
    const onGetJobPositions = (keyword)=>{
      getJobPositions({ variables: { jobPositionFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }

  const [updateJobCandidateInformationSheet, { loading: loadingPut }] = useMutation(PUT_JOB_CANDIDATE_INFORMATION_SHEET, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...jobCandidateInformationSheetCopy } = data.updateJobCandidateInformationSheet.jobCandidateInformationSheet;
      //   formik.setValues(jobCandidateInformationSheetCopy);
      handleNext();
    },
    update(cache, { data: { updateJobCandidateInformationSheet } }) {
      const updatedJobCandidateInformationSheet = updateJobCandidateInformationSheet.jobCandidateInformationSheet;

      cache.modify({
        fields: {
          jobCandidateInformationSheets(
            existingJobCandidateInformationSheets = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedJobCandidateInformationSheets = existingJobCandidateInformationSheets.nodes.map((jobCandidateInformationSheet) =>
              readField('id', jobCandidateInformationSheet) === updatedJobCandidateInformationSheet.id
                ? updatedJobCandidateInformationSheet
                : jobCandidateInformationSheet,
            );

            return {
              totalCount: existingJobCandidateInformationSheets.totalCount,
              nodes: updatedJobCandidateInformationSheets,
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
  const onUpdateJobCandidateInformationSheet = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateJobCandidateInformationSheet({ variables });
      },
    });
  };


  const [getDataData, {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  }] = useLazyQuery(GET_DATAS_JOB_CANDIDATE_INFORMATION_SHEET, { fetchPolicy: 'network-only' });


  const addDocumentRecord = (jobCandidateDocumentType) => {
    const { documentRecords } = formik.values;
    // Vérifie si le type de document existe déjà
    const exists = documentRecords.some(
      (record) => Number(record.jobCandidateDocumentType) === Number(jobCandidateDocumentType.id)
    );
  
    if (exists) return; // Ne rien faire si déjà présent
  
    // Ajoute le nouveau document
    formik.setValues({
      ...formik.values,
      documentRecords: [
        ...documentRecords,
        {
          document: undefined,
          name: '',
          jobCandidateDocumentType: jobCandidateDocumentType.id,
          startingDate: null,
          endingDate: null,
          description: '',
          comment: '',
          isNotificationEnabled: false,
          notificationPeriodUnit: NOTIFICATION_PERIOD_UNITS.MONTH,
          notificationPeriodValue: 1,
        },
      ],
    });
  };
  
  
  // Boucle sur les types de documents et ajoute-les si non existants
  dataData?.jobCandidateDocumentTypes?.forEach((data) => {
    addDocumentRecord(data);
  });
  

  const removeDocumentRecord = (index) => {
    const updatedDocumentRecords = [...formik.values.documentRecords];
    updatedDocumentRecords.splice(index, 1);

    formik.setValues({
      ...formik.values,
      documentRecords: updatedDocumentRecords,
    });
  };
  const [getJobCandidateInformationSheet, { loading: loadingJobCandidateInformationSheet }] = useLazyQuery(GET_JOB_CANDIDATE_INFORMATION_SHEET, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, employee, ...jobCandidateInformationSheetCopy } =  data.jobCandidateInformationSheet;
      if (!jobCandidateInformationSheetCopy?.documentRecords) jobCandidateInformationSheetCopy['documentRecords'] = [];
      let items = [];
      jobCandidateInformationSheetCopy.documentRecords.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
        itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
        itemCopy.jobCandidateDocumentType = itemCopy.jobCandidateDocumentType
        ? Number(itemCopy.jobCandidateDocumentType.id)
        : null;
        items.push(itemCopy);
      });
      jobCandidateInformationSheetCopy.documentRecords = items;
      formik.setValues(jobCandidateInformationSheetCopy);
      getDataData()
    },
    onError: (err) => console.log(err),
  });

  const [updateJobCandidateInformationSheetFields, { loading: loadingPost }] = useMutation(PUT_JOB_CANDIDATE_INFORMATION_SHEET_FIELDS, {
        onCompleted: (data) => {
          console.log(data);
          if (data.updateJobCandidateInformationSheetFields.success) {
            setTheStatus('SENT')
            setTimeout(() => {
              window.close();
            }, 1000); // 1 seconde
          }
        },
        update(cache, { data: { updateJobCandidateInformationSheetFields } }) {
          const updatedJobCandidateInformationSheet = updateJobCandidateInformationSheetFields.jobCandidateInformationSheet;
    
          cache.modify({
            fields: {
              jobCandidateInformationSheets(
                existingJobCandidateInformationSheets = { totalCount: 0, nodes: [] },
                { readField },
              ) {
                const updatedJobCandidateInformationSheets = existingJobCandidateInformationSheets.nodes.map((jobCandidateInformationSheet) =>
                  readField('id', jobCandidateInformationSheet) === updatedJobCandidateInformationSheet.id
                    ? updatedJobCandidateInformationSheet
                    : jobCandidateInformationSheet,
                );
    
                return {
                  totalCount: existingJobCandidateInformationSheets.totalCount,
                  nodes: updatedJobCandidateInformationSheets,
                };
              },
            },
          });
        },
      });

  React.useEffect(() => {
    if (accessToken) {
      getJobCandidateInformationSheet({ variables: { accessToken: accessToken } });
    }
  }, [accessToken]);
    React.useEffect(() => {
      if (searchParams.get('id') && !accessToken) {
        getJobCandidateInformationSheet({ variables: { id: searchParams.get('id') } });
      }
    }, []);
  
    const [activeStep, setActiveStep] = React.useState(
      searchParams.get('step') ? Number(searchParams.get('step')) : 0,
    );
    const [theStatus, setTheStatus] = React.useState('PENDING')
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      if(activeStep >= 1){setTheStatus('DONE'); setActiveStep(0)}
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
    if (theStatus === "SENT") {
      return (
        <Stack spacing={2}>
          <Alert severity="success">
            Merci d'avoir rempli la fiche de renseignement. Nous reviendrons vers vous pour la validation.
          </Alert>
          <Typography variant="h6">Terminé</Typography>
        </Stack>
      );
    }
    if (theStatus==='DONE') {
      return (
        <Stack>
          <Typography variant="h6">Terminé</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary"
              onClick={()=> {updateJobCandidateInformationSheetFields({ 
                                                                  variables: {
                                                                      accessToken: accessToken,
                                                                      jobCandidateInformationSheetData: {
                                                                        status: JOB_CANDIDATE_INFORMATION_SHEET_STATUS.SENT
                                                                      }
                                                                  }
                                                                  })
                                                                }}>
              Confirmer mes documents
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setTheStatus('PENDING')}>
              Revenir
            </Button>
          </Box>
        </Stack>
      );
    }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <em><u>{formik.values.cardNumber}</u></em>
      </Typography>
      {loadingJobCandidateInformationSheet && <ProgressService type="form" />}
      {!loadingJobCandidateInformationSheet && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={accessToken ? true : false}
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
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Prénom"
                        value={formik.values.firstName}
                        onChange={(e) => formik.setFieldValue('firstName', e.target.value)}
                        disabled={loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Nom"
                        value={formik.values.lastName}
                        onChange={(e) => formik.setFieldValue('lastName', e.target.value)}
                        disabled={loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Métier"
                        value={formik.values.jobTitle}
                        onChange={(e) => formik.setFieldValue('jobTitle', e.target.value)}
                        disabled={loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="E-mail"
                        value={formik.values.email}
                        onChange={(e) =>
                          formik.setFieldValue('email', e.target.value)
                        }
                        disabled={loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Tél"
                        value={formik.values.phone}
                        onChange={(e) =>
                          formik.setFieldValue('phone', e.target.value)
                        }
                        disabled={loadingPut}
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
                        label="Détail"
                        multiline
                        rows={8}
                        value={formik.values.description}
                        onChange={(e) =>
                          formik.setFieldValue('description', e.target.value)
                        }
                        disabled={loadingPut}
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
                  <Typography variant="caption">Les document(s) </Typography>
                }
              >
                Les document(s) 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.documentRecords?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheFileField variant="outlined"
                                label={
                                  dataData?.jobCandidateDocumentTypes?.find(type => Number(type.id) === Number(item.jobCandidateDocumentType))?.name || "Document"
                                }
                                fileValue={item.document}
                                onChange={(file) => formik.setFieldValue(`documentRecords.${index}.document`, file)}
                                disabled={loadingPut}
                                />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2.5} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Début le"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`documentRecords.${index}.startingDate`, date)
                                }
                                disabled={loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2.5} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Valide jusqu'au"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`documentRecords.${index}.endingDate`, date)
                                }
                                disabled={loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} >
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Commentaire"
                                multiline
                                rows={3}
                                value={item.comment}
                                onChange={(e) =>
                                  formik.setFieldValue(`documentRecords.${index}.comment`, e.target.value)
                                }
                                disabled={loadingPut}
                              />
                            </Item>
                          </Grid>
                        </Grid>
                      ))}
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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPut}
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
