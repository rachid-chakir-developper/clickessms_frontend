import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Stepper, Step, StepLabel, StepContent, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, IconButton, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_DECISION_DOCUMENT } from '../../../../_shared/graphql/queries/DecisionDocumentQueries';
import {
  POST_DECISION_DOCUMENT,
  PUT_DECISION_DOCUMENT,
} from '../../../../_shared/graphql/mutations/DecisionDocumentMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Close } from '@mui/icons-material';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddDecisionDocumentForm({ idDecisionDocument, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    firstName: yup
      .string('Entrez votre prénom')
      .required('Le prénom est obligatoire'),
    lastName: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      photo: undefined,
      coverImage: undefined,
      number: '',
      firstName: '',
      lastName: '',
      gender: null,
      birthDate: dayjs(new Date()),
      admissionDate: dayjs(new Date()),
      latitude: '',
      longitude: '',
      city: '',
      zipCode: '',
      address: '',
      mobile: '',
      fix: '',
      fax: '',
      email: '',
      webSite: '',
      otherContacts: '',
      iban: '',
      bic: '',
      bankName: '',
      description: '',
      observation: '',
      isActive: true,
      decisionDocumentEntries: [],
      decisionDocumentAdmissionDocuments: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { photo, ...decisionDocumentFormCopy } = values;
      let { coverImage, ...decisionDocumentCopy } = decisionDocumentFormCopy;
      if (!decisionDocumentCopy?.decisionDocumentEntries) decisionDocumentCopy['decisionDocumentEntries'] = [];
        let items = [];
        decisionDocumentCopy.decisionDocumentEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.establishments = itemCopy.establishments.map((i) => i?.id);
          itemCopy.internalReferents = itemCopy.internalReferents.map((i) => i?.id);
          items.push(itemCopy);
        });
        decisionDocumentCopy.decisionDocumentEntries = items;
        console.log('decisionDocumentCopy***************************', decisionDocumentCopy)
      if (idDecisionDocument && idDecisionDocument != '') {
        onUpdateDecisionDocument({
          id: decisionDocumentCopy.id,
          decisionDocumentData: decisionDocumentCopy,
          photo: photo,
          coverImage: coverImage,
        });
      } else
        createDecisionDocument({
          variables: {
            decisionDocumentData: decisionDocumentCopy,
            photo: photo,
            coverImage: coverImage,
          },
        });
    },
  });
  const addDecisionDocumentEntry = () => {
    formik.setValues({
      ...formik.values,
      decisionDocumentEntries: [
        ...formik.values.decisionDocumentEntries,
        { establishments: [], internalReferents: [] , entryDate: dayjs(new Date()), releaseDate: dayjs(new Date())},
      ],
    });
  };

  const removeDecisionDocumentEntry = (index) => {
    const updatedDecisionDocumentEntries = [...formik.values.decisionDocumentEntries];
    updatedDecisionDocumentEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      decisionDocumentEntries: updatedDecisionDocumentEntries,
    });
  };

  const addDecisionDocumentAdmissionDocument = () => {
    formik.setValues({
      ...formik.values,
      decisionDocumentAdmissionDocuments: [
        ...formik.values.decisionDocumentAdmissionDocuments,
        { document: undefined, admissionDocumentType: null , startingDate: dayjs(new Date()), endingDate: dayjs(new Date())},
      ],
    });
  };

  const removeDecisionDocumentAdmissionDocument = (index) => {
    const updatedDecisionDocumentAdmissionDocuments = [...formik.values.decisionDocumentAdmissionDocuments];
    updatedDecisionDocumentAdmissionDocuments.splice(index, 1);

    formik.setValues({
      ...formik.values,
      decisionDocumentAdmissionDocuments: updatedDecisionDocumentAdmissionDocuments,
    });
  };

  const [createDecisionDocument, { loading: loadingPost }] = useMutation(
    POST_DECISION_DOCUMENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...decisionDocumentCopy } = data.createDecisionDocument.decisionDocument;
        //   formik.setValues(decisionDocumentCopy);
        formik.setFieldValue('id', decisionDocumentCopy.id);
        handleNext();
      },
      update(cache, { data: { createDecisionDocument } }) {
        const newDecisionDocument = createDecisionDocument.decisionDocument;

        cache.modify({
          fields: {
            beneficiaries(
              existingBeneficiaries = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingBeneficiaries.totalCount + 1,
                nodes: [newDecisionDocument, ...existingBeneficiaries.nodes],
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
  const [updateDecisionDocument, { loading: loadingPut }] = useMutation(
    PUT_DECISION_DOCUMENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...decisionDocumentCopy } =
          data.updateDecisionDocument.decisionDocument;
        //   formik.setValues(decisionDocumentCopy);
        handleNext();
      },
      update(cache, { data: { updateDecisionDocument } }) {
        const updatedDecisionDocument = updateDecisionDocument.decisionDocument;

        cache.modify({
          fields: {
            beneficiaries(
              existingBeneficiaries = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaries = existingBeneficiaries.nodes.map(
                (decisionDocument) =>
                  readField('id', decisionDocument) === updatedDecisionDocument.id
                    ? updatedDecisionDocument
                    : decisionDocument,
              );

              return {
                totalCount: existingBeneficiaries.totalCount,
                nodes: updatedBeneficiaries,
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
  const onUpdateDecisionDocument = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateDecisionDocument({ variables });
      },
    });
  };
  const [getDecisionDocument, { loading: loadingDecisionDocument }] = useLazyQuery(
    GET_DECISION_DOCUMENT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...decisionDocumentCopy1 } = data.decisionDocument;
        let { folder, ...decisionDocumentCopy } = decisionDocumentCopy1;
        decisionDocumentCopy.gender = decisionDocumentCopy.gender
          ? Number(decisionDocumentCopy.gender.id)
          : null;
        decisionDocumentCopy.birthDate = dayjs(decisionDocumentCopy.birthDate);
        decisionDocumentCopy.admissionDate = dayjs(decisionDocumentCopy.admissionDate);
        
        if (!decisionDocumentCopy?.decisionDocumentEntries) decisionDocumentCopy['decisionDocumentEntries'] = [];
        let items = [];
        decisionDocumentCopy.decisionDocumentEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.entryDate = dayjs(itemCopy.entryDate)
          itemCopy.releaseDate = dayjs(itemCopy.releaseDate)
          items.push(itemCopy);
        });
        decisionDocumentCopy.decisionDocumentEntries = items;
        if (!decisionDocumentCopy?.decisionDocumentAdmissionDocuments) decisionDocumentCopy['decisionDocumentAdmissionDocuments'] = [];
        items = [];
        decisionDocumentCopy.decisionDocumentAdmissionDocuments.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = dayjs(itemCopy.startingDate)
          itemCopy.endingDate = dayjs(itemCopy.endingDate)
          itemCopy.admissionDocumentType = itemCopy.admissionDocumentType
          ? Number(itemCopy.admissionDocumentType.id)
          : null;
          items.push(itemCopy);
        });
        decisionDocumentCopy.decisionDocumentAdmissionDocuments = items;
        formik.setValues(decisionDocumentCopy);
      },
      onError: (err) => console.log(err),
    },
  );

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

  React.useEffect(() => {
    if (idDecisionDocument) {
      getDecisionDocument({ variables: { id: idDecisionDocument } });
    }
  }, [idDecisionDocument]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idDecisionDocument) {
      getDecisionDocument({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (formik.values.id)
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
      <Typography component="div" variant="h5"  sx={{ marginBottom: 4 }}>
        {title} {formik.values.number}
      </Typography>
      {loadingDecisionDocument && <ProgressService type="form" />}
      {!loadingDecisionDocument && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idDecisionDocument ? true : false}
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
                  <Grid xs={12} sm={6} md={3}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Titre"
                        value={formik.values.name}
                        onChange={(e) =>
                          formik.setFieldValue('name', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de décision / notification"
                        value={formik.values.decisionDate}
                        onChange={(date) => formik.setFieldValue('decisionDate', date)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de récéption"
                        value={formik.values.receptionDateTime}
                        onChange={(date) => formik.setFieldValue('receptionDateTime', date)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Département financeur"
                        multiple={false}
                        placeholder="Choisissez un département"
                        // value={formik.values.mobile}
                        // onChange={(e, newValue) =>
                        //   formik.setFieldValue('mobile', e.target.newValue)
                        // }
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
                  <Typography variant="caption">Les décisions modificatives </Typography>
                }
              >
                Les décisions modificatives 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={12} sm={12} md={12} item="true">
                      {formik.values?.decisionDocumentEntries?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheAutocomplete
                                options={establishmentsData?.establishments?.nodes}
                                label="Établissements / Services"
                                placeholder="Ajouter un établissement ou service"
                                limitTags={3}
                                value={item.establishments}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`decisionDocumentEntries.${index}.establishments`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheAutocomplete
                                options={employeesData?.employees?.nodes}
                                label="Référents internes"
                                placeholder="Ajouter un référent interne"
                                limitTags={3}
                                value={item.internalReferents}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`decisionDocumentEntries.${index}.internalReferents`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date d’entrée"
                                value={item.entryDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`decisionDocumentEntries.${index}.entryDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de sortie"
                                value={item.releaseDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`decisionDocumentEntries.${index}.releaseDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeDecisionDocumentEntry(index)}
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
                      onClick={addDecisionDocumentEntry}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une entrée
                    </Button>
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
                  to="/online/ressources-humaines/beneficiaires/liste"
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
