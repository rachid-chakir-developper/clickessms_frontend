import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
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
  InputAdornment,
  IconButton,
} from '@mui/material';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  GET_ESTABLISHMENT,
  GET_ESTABLISHMENTS,
} from '../../../../_shared/graphql/queries/EstablishmentQueries';
import {
  POST_ESTABLISHMENT,
  PUT_ESTABLISHMENT,
} from '../../../../_shared/graphql/mutations/EstablishmentMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_DATAS_ESTABLISHMENT } from '../../../../_shared/graphql/queries/DataQueries';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { MEASUREMENT_ACTIVITY_UNITS } from '../../../../_shared/tools/constants';
import { Close } from '@mui/icons-material';
import { getMeasurementActivityUnitLabel } from '../../../../_shared/tools/functions';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEstablishmentForm({ idEstablishment, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      logo: undefined,
      coverImage: undefined,
      number: '',
      name: '',
      siret: '',
      finess: '',
      apeCode: '',
      openingDate: dayjs(new Date()),
      measurementActivityUnit: 'DAY',
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
      establishmentCategory: null,
      establishmentType: null,
      establishmentParent: null,
      establishmentChilds: [],
      managers: [],
      activityAuthorizations : []
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { logo, ...establishmentFormCopy } = values;
      let { coverImage, ...establishmentCopy } = establishmentFormCopy;
      establishmentCopy.establishmentParent =
        establishmentCopy.establishmentParent
          ? establishmentCopy.establishmentParent.id
          : null;
      establishmentCopy.establishmentChilds =
      establishmentCopy.establishmentChilds.map((i) => i.id);
      establishmentCopy.managers = establishmentCopy.managers.map((i) => i?.id);
      if (!establishmentCopy?.activityAuthorizations) establishmentCopy['activityAuthorizations'] = [];
      let items = [];
        establishmentCopy.activityAuthorizations.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        establishmentCopy.activityAuthorizations = items;
      if (establishmentCopy?.id && establishmentCopy?.id != '') {
        onUpdateEstablishment({
          id: establishmentCopy.id,
          establishmentData: establishmentCopy,
          logo: logo,
          coverImage: coverImage,
        });
      } else
        createEstablishment({
          variables: {
            establishmentData: establishmentCopy,
            logo: logo,
            coverImage: coverImage,
          },
        });
    },
  });

  
  const addActivityAuthorization= () => {
    formik.setValues({
      ...formik.values,
      activityAuthorizations: [
        ...formik.values.activityAuthorizations,
        { document: undefined, startingDateTime: dayjs(new Date()), endingDateTime: dayjs(new Date()), capacity: 0},
      ],
    });
  };

  const removeActivityAuthorization= (index) => {
    const updatedDecisionDocumentEntries = [...formik.values.activityAuthorizations];
    updatedDecisionDocumentEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      activityAuthorizations: updatedDecisionDocumentEntries,
    });
  };

  const [createEstablishment, { loading: loadingPost }] = useMutation(
    POST_ESTABLISHMENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...establishmentCopy } = data.createEstablishment.establishment;
        //   formik.setValues(establishmentCopy);
        formik.setFieldValue('id', establishmentCopy.id);
        handleNext();
      },
      update(cache, { data: { createEstablishment } }) {
        const newEstablishment = createEstablishment.establishment;

        cache.modify({
          fields: {
            establishments(
              existingEstablishments = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingEstablishments.totalCount + 1,
                nodes: [newEstablishment, ...existingEstablishments.nodes],
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
  const [updateEstablishment, { loading: loadingPut }] = useMutation(
    PUT_ESTABLISHMENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...establishmentCopy } =
          data.updateEstablishment.establishment;
        //   formik.setValues(establishmentCopy);
        handleNext();
      },
      update(cache, { data: { updateEstablishment } }) {
        const updatedEstablishment = updateEstablishment.establishment;

        cache.modify({
          fields: {
            establishments(
              existingEstablishments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEstablishments = existingEstablishments.nodes.map(
                (establishment) =>
                  readField('id', establishment) === updatedEstablishment.id
                    ? updatedEstablishment
                    : establishment,
              );

              return {
                totalCount: existingEstablishments.totalCount,
                nodes: updatedEstablishments,
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
  const onUpdateEstablishment = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEstablishment({ variables });
      },
    });
  };
  const [getEstablishment, { loading: loadingEstablishment }] = useLazyQuery(
    GET_ESTABLISHMENT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...establishmentCopy1 } = data.establishment;
        let { folder, ...establishmentCopy } = establishmentCopy1;
        establishmentCopy.openingDate = dayjs(
          establishmentCopy.openingDate,
        );

        establishmentCopy.establishmentCategory =
          establishmentCopy.establishmentCategory
            ? Number(establishmentCopy.establishmentCategory.id)
            : null;

        establishmentCopy.establishmentType =
          establishmentCopy.establishmentType
            ? Number(establishmentCopy.establishmentType.id)
            : null;
        
        establishmentCopy.managers = establishmentCopy.managers
        ? establishmentCopy.managers.map((i) => i?.employee)
        : [];

        if (!establishmentCopy?.activityAuthorizations) establishmentCopy['activityAuthorizations'] = [];
        let items = [];
        establishmentCopy.activityAuthorizations.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDateTime = dayjs(itemCopy.startingDateTime)
          itemCopy.endingDateTime = dayjs(itemCopy.endingDateTime)
          items.push(itemCopy);
        });
        establishmentCopy.activityAuthorizations = items;

        formik.setValues(establishmentCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idEstablishment) {
      getEstablishment({ variables: { id: idEstablishment } });
    }
  }, [idEstablishment]);

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });

  const {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_ESTABLISHMENT, { fetchPolicy: 'network-only' });


  React.useEffect(() => {
    if (searchParams.get('id') && !idEstablishment) {
      getEstablishment({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 3) navigate('/online/associations/structures/liste');
    else if (formik.values.id) setSearchParams({ step: activeStep + 1, id: formik.values.id });
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
      <Typography component="div" variant="h5"  sx={{ marginBottom: 4 }}>
        {title} {formik.values.number}
      </Typography>
      {loadingEstablishment && <ProgressService type="form" />}
      {!loadingEstablishment && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idEstablishment ? true : false}
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
                  <Grid xs={2} sm={8} md={8}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Raison sociale"
                        id="name"
                        value={formik.values.name}
                        required
                        onChange={(e) => formik.setFieldValue('name', e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes?.filter(
                          (e) => e?.id != idEstablishment,
                        )}
                        label="Structure parent"
                        placeholder="Choisissez une structure"
                        multiple={false}
                        value={formik.values.establishmentParent}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('establishmentParent', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Catégorie de structure
                        </InputLabel>
                        <Select
                          label="Catégorie de structure"
                          value={formik.values.establishmentCategory}
                          onChange={(e) =>
                            formik.setFieldValue('establishmentCategory', e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>Choisissez une catégorie</em>
                          </MenuItem>
                          {dataData?.establishmentCategories?.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.id}>
                                {data.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Type de structure
                        </InputLabel>
                        <Select
                          label="Type de structure"
                          value={formik.values.establishmentType}
                          onChange={(e) =>
                            formik.setFieldValue('establishmentType', e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>Choisissez un type</em>
                          </MenuItem>
                          {dataData?.establishmentTypes?.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.id}>
                                {data.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes?.filter(
                          (e) => e?.id != idEstablishment,
                        )}
                        label="Structures filles"
                        placeholder="Choisissez des structures"
                        limitTags={3}
                        value={formik.values.establishmentChilds}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('establishmentChilds', newValue)
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
                  <Typography variant="caption">Coordonnées</Typography>
                }
              >
                Coordonnées
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={2} sm={4} md={4}>
                    <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                      <Grid xs={12} sm={12} md={12}>
                        <Item>
                          <TheTextField
                            variant="outlined"
                            label="Adresse (Ligne 1)"
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
                      <Grid xs={12} sm={12} md={12}>
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
                      <Grid xs={5} sm={5} md={5}>
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
                      <Grid xs={7} sm={7} md={7}>
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
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Numéro de téléphone fixe"
                        value={formik.values.fix}
                        onChange={(e) => formik.setFieldValue('fix', e.target.value)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Numéro de Fax"
                        value={formik.values.fax}
                        onChange={(e) => formik.setFieldValue('fax', e.target.value)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
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
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="E-mail"
                        value={formik.values.email}
                        onChange={(e) =>
                          formik.setFieldValue('email', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Site web"
                        value={formik.values.webSite}
                        onChange={(e) =>
                          formik.setFieldValue('webSite', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Coordonnées supplémentaires"
                        value={formik.values.otherContacts}
                        onChange={(e) =>
                          formik.setFieldValue('otherContacts', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={12} md={12}>
                    <Divider variant="middle" />
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(2)}
                optional={
                  <Typography variant="caption">Activité</Typography>
                }
              >
                Activité
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item="true" xs={12} sm={6} md={4}>
                    <Item>
                        <TheDesktopDatePicker
                            label="Date d’ouverture"
                            value={formik.values.openingDate}
                            onChange={(date) =>
                              formik.setFieldValue('openingDate', date)
                            }
                            disabled={loadingPost || loadingPut}
                        />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4} item="true">
                    <Item>
                      <TheAutocomplete
                        options={employeesData?.employees?.nodes}
                        label="Responsables"
                        placeholder="Ajouter un responsable"
                        limitTags={3}
                        value={formik.values.managers}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('managers', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={6} md={4}>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                        Unité de mesure de l'activité
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Unité de mesure de l'activité"
                          value={formik.values.measurementActivityUnit}
                          onChange={(e) =>
                            formik.setFieldValue(
                              'measurementActivityUnit',
                              e.target.value,
                            )
                          }
                        >
                          {MEASUREMENT_ACTIVITY_UNITS?.ALL?.map((type, index) => {
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
                  <Grid 
                    xs={12}
                    sm={12}
                    md={12} item="true">
                      <Typography variant="h6">Les habilitations</Typography>
                      {formik.values?.activityAuthorizations?.map((item, index) => (
                        <Grid
                          container
                          key={index}
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheFileField variant="outlined" label="Document d'admission"
                                fileValue={item.document}
                                onChange={(file) => formik.setFieldValue(`activityAuthorizations.${index}.document`, file)}
                                disabled={loadingPost || loadingPut}
                                />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDateTime}
                                onChange={(date) =>
                                  formik.setFieldValue(`activityAuthorizations.${index}.startingDateTime`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDateTime}
                                onChange={(date) =>
                                  formik.setFieldValue(`activityAuthorizations.${index}.endingDateTime`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Capacité"
                                type="number"
                                value={item.capacity}
                                onChange={(e) =>
                                  formik.setFieldValue(`activityAuthorizations.${index}.capacity`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeActivityAuthorization(index)}
                                edge="end"
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Item>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    item="true"
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addActivityAuthorization}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une habilitation
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(3)}
                optional={
                  <Typography variant="caption">Autres informations</Typography>
                }
              >Autres informations
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <ImageFileField
                        variant="outlined"
                        label="Logo"
                        imageValue={formik.values.logo}
                        onChange={(imageFile) =>
                          formik.setFieldValue('logo', imageFile)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={8} md={8}>
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
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="N°FINESS"
                        value={formik.values.finess}
                        onChange={(e) =>
                          formik.setFieldValue('finess', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="N°SIRET"
                        value={formik.values.siret}
                        onChange={(e) =>
                          formik.setFieldValue('siret', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Code APE"
                        value={formik.values.apeCode}
                        onChange={(e) =>
                          formik.setFieldValue('apeCode', e.target.value)
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
            <Grid xs={12} sm={12} md={12} item="true">
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/associations/structures/liste"
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
