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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BENEFICIARY_ADMISSION } from '../../../../_shared/graphql/queries/BeneficiaryAdmissionQueries';
import {
  POST_BENEFICIARY_ADMISSION,
  PUT_BENEFICIARY_ADMISSION,
} from '../../../../_shared/graphql/mutations/BeneficiaryAdmissionMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { BENEFICIARY_ADMISSION_STATUS_CHOICES, GENDERS } from '../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';
import { GET_DATAS_BENEFICIARY } from '../../../../_shared/graphql/queries/DataQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBeneficiaryAdmissionForm({ idBeneficiaryAdmission, title }) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageActivity = authorizationSystem.requestAuthorization({
    type: 'manageActivity',
  }).authorized;
  const [isNotEditable, setIsNotEditable] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRequestType, setIsRequestType] = React.useState(!canManageActivity);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    firstName: yup.string('Entrez votre prénom').required('Le prénom est obligatoire'),
    lastName: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
    receptionDate: yup.date().nullable().typeError("Veuillez entrer une date valide").required("La date de réception est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      firstName: '',
      lastName: '',
      gender: GENDERS.NOT_SPECIFIED,
      preAdmissionDate: null,
      receptionDate: null,
      birthDate: null,
      birthCity: '',
      birthCountry: '',
      nationality: '',
      professionalStatus: null,
      latitude: '',
      longitude: '',
      city: '',
      zipCode: '',
      address: '',
      additionalAddress: '',
      mobile: '',
      fix: '',
      fax: '',
      email: '',
      webSite: '',
      otherContacts: '',
      isActive: true,
      description: '',
      observation: '',
      responseDate: null,
      statusReason: '',
      files: [],
      financier: null,
      establishments: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if(isNotEditable) return
      let {files, ...beneficiaryAdmissionCopy} = values;
      beneficiaryAdmissionCopy.establishments = beneficiaryAdmissionCopy.establishments.map((i) => i?.id);
      beneficiaryAdmissionCopy.financier = beneficiaryAdmissionCopy.financier ?  beneficiaryAdmissionCopy.financier?.id : null;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))

      if (idBeneficiaryAdmission && idBeneficiaryAdmission != '') {
        onUpdateBeneficiaryAdmission({
          id: beneficiaryAdmissionCopy.id,
          beneficiaryAdmissionData: beneficiaryAdmissionCopy,
          files: files
        });
      } else
        createBeneficiaryAdmission({
          variables: {
            beneficiaryAdmissionData: beneficiaryAdmissionCopy,
            files: files
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

  const {
      loading: loadingFinanciers,
      data: financiersData,
      error: financiersError,
      fetchMore: fetchMoreFinanciers,
    } = useQuery(GET_FINANCIERS, {
      fetchPolicy: 'network-only',
    });

    const {
        loading: loadingDatas,
        data: dataData,
        error: datsError,
        fetchMore: fetchMoreDatas,
      } = useQuery(GET_DATAS_BENEFICIARY, { fetchPolicy: 'network-only' });


  const [createBeneficiaryAdmission, { loading: loadingPost }] = useMutation(POST_BENEFICIARY_ADMISSION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...beneficiaryAdmissionCopy } = data.createBeneficiaryAdmission.beneficiaryAdmission;
      //   formik.setValues(beneficiaryAdmissionCopy);
      formik.setFieldValue('id', beneficiaryAdmissionCopy.id);
      handleNext();
    },
    update(cache, { data: { createBeneficiaryAdmission } }) {
      const newBeneficiaryAdmission = createBeneficiaryAdmission.beneficiaryAdmission;

      cache.modify({
        fields: {
          beneficiaryAdmissions(existingBeneficiaryAdmissions = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingBeneficiaryAdmissions.totalCount + 1,
              nodes: [newBeneficiaryAdmission, ...existingBeneficiaryAdmissions.nodes],
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
  const [updateBeneficiaryAdmission, { loading: loadingPut }] = useMutation(PUT_BENEFICIARY_ADMISSION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...beneficiaryAdmissionCopy } = data.updateBeneficiaryAdmission.beneficiaryAdmission;
      //   formik.setValues(beneficiaryAdmissionCopy);
      handleNext();
    },
    update(cache, { data: { updateBeneficiaryAdmission } }) {
      const updatedBeneficiaryAdmission = updateBeneficiaryAdmission.beneficiaryAdmission;

      cache.modify({
        fields: {
          beneficiaryAdmissions(existingBeneficiaryAdmissions = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedBeneficiaryAdmissions = existingBeneficiaryAdmissions.nodes.map((beneficiaryAdmission) =>
              readField('id', beneficiaryAdmission) === updatedBeneficiaryAdmission.id ? updatedBeneficiaryAdmission : beneficiaryAdmission,
            );

            return {
              totalCount: existingBeneficiaryAdmissions.totalCount,
              nodes: updatedBeneficiaryAdmissions,
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
  const onUpdateBeneficiaryAdmission = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryAdmission({ variables });
      },
    });
  };
  const [getBeneficiaryAdmission, { loading: loadingBeneficiaryAdmission }] = useLazyQuery(GET_BENEFICIARY_ADMISSION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, employee, age, ...beneficiaryAdmissionCopy } = data.beneficiaryAdmission;
      beneficiaryAdmissionCopy.receptionDate = beneficiaryAdmissionCopy.receptionDate ? dayjs(beneficiaryAdmissionCopy.receptionDate) : null;
      beneficiaryAdmissionCopy.preAdmissionDate = beneficiaryAdmissionCopy.preAdmissionDate ? dayjs(beneficiaryAdmissionCopy.preAdmissionDate) : null;
      beneficiaryAdmissionCopy.responseDate = beneficiaryAdmissionCopy.responseDate ? dayjs(beneficiaryAdmissionCopy.responseDate) : null;
      beneficiaryAdmissionCopy.birthDate = beneficiaryAdmissionCopy.birthDate ? dayjs(beneficiaryAdmissionCopy.birthDate) : null;
      beneficiaryAdmissionCopy.professionalStatus = beneficiaryAdmissionCopy.professionalStatus ? Number(beneficiaryAdmissionCopy.professionalStatus.id): null;
      formik.setValues(beneficiaryAdmissionCopy);
      if(!canManageActivity && beneficiaryAdmissionCopy.status !== BENEFICIARY_ADMISSION_STATUS_CHOICES.PENDING) setIsNotEditable(true)
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idBeneficiaryAdmission) {
      getBeneficiaryAdmission({ variables: { id: idBeneficiaryAdmission } });
    }
  }, [idBeneficiaryAdmission]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idBeneficiaryAdmission) {
      getBeneficiaryAdmission({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 1) navigate('/online/ressources-humaines/admissions-beneficiaires/liste');
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

  React.useEffect(() => {
    if ((searchParams.get('type') && searchParams.get('type') === 'REQUEST' && !idBeneficiaryAdmission) || (!canManageActivity && !idBeneficiaryAdmission)) {
        formik.setFieldValue('status', BENEFICIARY_ADMISSION_STATUS_CHOICES.PENDING)
        setIsRequestType(true)
    }
    else if(!canManageActivity){
      setIsRequestType(true)
    }
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingBeneficiaryAdmission && <ProgressService type="form" />}
      {!loadingBeneficiaryAdmission && (
        <form onSubmit={formik.handleSubmit}>
          {isNotEditable && <Alert severity="warning">Pour modifier cette admission, contactez le responsable de l'activité</Alert>}
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idBeneficiaryAdmission ? true : false}
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group" sx={{textAlign: 'left'}}>Civilité</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={formik.values.gender}
                          onChange={(e) =>
                            formik.setFieldValue('gender', e.target.value)
                          }
                        >
                          {GENDERS?.ALL?.map((genre, index) => {
                            return (
                              <FormControlLabel key={index} value={genre.value} control={<Radio />} label={genre.label} />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Nom d’usage"
                        value={formik.values.preferredName}
                        onChange={(e) =>
                          formik.setFieldValue('preferredName', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Nom de naissance"
                        id="lastName"
                        value={formik.values.lastName}
                        required
                        onChange={(e) =>
                          formik.setFieldValue('lastName', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.lastName && Boolean(formik.errors.lastName)
                        }
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Prénom"
                        id="firstName"
                        value={formik.values.firstName}
                        required
                        onChange={(e) =>
                          formik.setFieldValue('firstName', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.firstName && Boolean(formik.errors.firstName)
                        }
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Item>
                          <TheDesktopDatePicker
                            label="Date de naissance"
                            value={formik.values.birthDate}
                            onChange={(date) => formik.setFieldValue('birthDate', date)}
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={12} sm={12} md={5}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Ville de naissance"
                            value={formik.values.birthCity}
                            onChange={(e) =>
                              formik.setFieldValue('birthCity', e.target.value)
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={12} sm={12} md={7}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Pays de naissance"
                            value={formik.values.birthCountry}
                            onChange={(e) =>
                              formik.setFieldValue('birthCountry', e.target.value)
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Nationalité"
                            value={formik.values.nationality}
                            onChange={(e) =>
                              formik.setFieldValue('nationality', e.target.value)
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Adresse"
                            multiline
                            rows={2}
                            value={formik.values.address}
                            onChange={(e) =>
                              formik.setFieldValue('address', e.target.value)
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Complément"
                            value={formik.values.additionalAddress}
                            onChange={(e) =>
                              formik.setFieldValue(
                                'additionalAddress',
                                e.target.value,
                              )
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={5} sm={5} md={5}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Code postal"
                            value={formik.values.zipCode}
                            onChange={(e) =>
                              formik.setFieldValue('zipCode', e.target.value)
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={7} sm={7} md={7}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Ville"
                            value={formik.values.city}
                            onChange={(e) =>
                              formik.setFieldValue('city', e.target.value)
                            }
                            disabled={loadingPost || loadingPut}
                          />
                        </Item>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Numéro de téléphone portable"
                        value={formik.values.mobile}
                        onChange={(e) =>
                          formik.setFieldValue('mobile', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Statut professionnel
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="professionalStatus"
                          label="Statut professionnel"
                          value={formik.values.professionalStatus}
                          onChange={(e) =>
                            formik.setFieldValue('professionalStatus', e.target.value)
                          }
                          disabled={loadingPost || loadingPut}
                        >
                          <MenuItem value={null}>
                            <em>Choisissez un statut</em>
                          </MenuItem>
                          {dataData?.professionalStatuses?.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.id}>
                                {data.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Item>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de réception de la demande d’admission"
                        value={formik.values.receptionDate}
                        onChange={(date) => formik.setFieldValue('receptionDate', date)}
                        disabled={loadingPost || loadingPut}
                        onBlur={formik.handleBlur}
                        slotProps={{
                          textField: {
                            error: Boolean(formik.touched.receptionDate && formik.errors.receptionDate),
                            helperText: formik.touched.receptionDate && formik.errors.receptionDate,
                          }
                        }}
                      />
                    </Item>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de pré-admission"
                        value={formik.values.preAdmissionDate}
                        onChange={(date) => formik.setFieldValue('preAdmissionDate', date)}
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
                  <Typography variant="caption">Autres informations</Typography>
                }
              >
                Autres informations
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={6} md={4} >
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
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={financiersData?.financiers?.nodes}
                        label="Département financeur"
                        multiple={false}
                        placeholder="Choisissez un département"
                        value={formik.values.financier}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('financier', newValue)
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de réponse"
                        value={formik.values.responseDate}
                        onChange={(date) => formik.setFieldValue('responseDate', date)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Motif de réponse"
                        multiline
                        rows={4}
                        value={formik.values.statusReason}
                        onChange={(e) => formik.setFieldValue('statusReason', e.target.value)}
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Détail"
                        multiline
                        rows={4}
                        value={formik.values.description}
                        onChange={(e) => formik.setFieldValue('description', e.target.value)}
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} >
                    <Item>
                      <MultiFileField
                        variant="outlined"
                        label="Pièces jointes"
                        fileValue={formik.values.files}
                        onChange={(files) =>
                          formik.setFieldValue('files', files)
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
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
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/ressources-humaines/admissions-beneficiaires/liste"
                  className="no_style"
                >
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPost || loadingPut || isNotEditable}
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
