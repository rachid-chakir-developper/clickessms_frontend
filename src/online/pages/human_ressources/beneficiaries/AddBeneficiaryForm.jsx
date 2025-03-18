import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Stepper, Step, StepLabel, StepContent, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, IconButton, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BENEFICIARY } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import {
  POST_BENEFICIARY,
  PUT_BENEFICIARY,
} from '../../../../_shared/graphql/mutations/BeneficiaryMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { GET_DATAS_BENEFICIARY } from '../../../../_shared/graphql/queries/DataQueries';
import { Close, ArrowBack } from '@mui/icons-material';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';
import CustomFieldValues from '../../../../_shared/components/form-fields/costum-fields/CustomFieldValues';
import { CAREER_ENTRY_TYPES, GENDERS, NOTIFICATION_PERIOD_UNITS } from '../../../../_shared/tools/constants';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBeneficiaryForm({ idBeneficiary, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const [triggerSave, setTriggerSave] = React.useState(false);
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
      gender: GENDERS.NOT_SPECIFIED,
      birthDate: dayjs(new Date()),
      birthCity: '',
      birthCountry: '',
      nationality: '',
      professionalStatus: null,
      admissionDate: dayjs(new Date()),
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
      iban: '',
      bic: '',
      bankName: '',
      description: '',
      observation: '',
      isActive: true,
      addressBookEntries: [],
      beneficiaryEntries: [],
      beneficiaryAdmissionDocuments: [],
      beneficiaryStatusEntries: [],
      beneficiaryEndowmentEntries: [],
      careerEntries: [],
      documentRecords: [],
    },
    validationSchema: validationSchema,
      onSubmit: (values) => {
        if (activeStep === 8) {
            setTriggerSave(true);
            setTimeout(() => setTriggerSave(false), 100);
            return
        }
        let { photo, ...beneficiaryFormCopy } = values;
        let { coverImage, ...beneficiaryCopy } = beneficiaryFormCopy;
        if (!beneficiaryCopy?.beneficiaryEntries) beneficiaryCopy['beneficiaryEntries'] = [];
        let items = [];
        beneficiaryCopy.beneficiaryEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.establishments = itemCopy.establishments.map((i) => i?.id);
          itemCopy.internalReferents = itemCopy.internalReferents.map((i) => i?.id);
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryEntries = items;
        items = [];
        beneficiaryCopy.beneficiaryAdmissionDocuments.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.financier = itemCopy.financier ? itemCopy.financier.id : null;
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryAdmissionDocuments = items;
        items = [];
        beneficiaryCopy.beneficiaryStatusEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryStatusEntries = items;
        items = [];
        beneficiaryCopy.beneficiaryEndowmentEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryEndowmentEntries = items;
        items = [];
        beneficiaryCopy.addressBookEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        beneficiaryCopy.addressBookEntries = items;
        items = [];
        beneficiaryCopy.careerEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        beneficiaryCopy.careerEntries = items;
        items = [];
        beneficiaryCopy.documentRecords.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        beneficiaryCopy.documentRecords = items;

        if (beneficiaryCopy?.id && beneficiaryCopy?.id != '') {
          onUpdateBeneficiary({
            id: beneficiaryCopy.id,
            beneficiaryData: beneficiaryCopy,
            photo: photo,
            coverImage: coverImage,
          });
        } else
          createBeneficiary({
            variables: {
              beneficiaryData: beneficiaryCopy,
              photo: photo,
              coverImage: coverImage,
            },
          });
      },
  });
  const addBeneficiaryEntry = () => {
    formik.setValues({
      ...formik.values,
      beneficiaryEntries: [
        ...formik.values.beneficiaryEntries,
        { establishments: [], internalReferents: [] , entryDate: dayjs(new Date()), dueDate: null, releaseDate: null},
      ],
    });
  };

  const removeBeneficiaryEntry = (index) => {
    const updatedBeneficiaryEntries = [...formik.values.beneficiaryEntries];
    updatedBeneficiaryEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      beneficiaryEntries: updatedBeneficiaryEntries,
    });
  };

  const addBeneficiaryAdmissionDocument = () => {
    formik.setValues({
      ...formik.values,
      beneficiaryAdmissionDocuments: [
        ...formik.values.beneficiaryAdmissionDocuments,
        { document: undefined, admissionDocumentType: null , financier: null, startingDate: dayjs(new Date()), endingDate: null},
      ],
    });
  };

  const removeBeneficiaryAdmissionDocument = (index) => {
    const updatedBeneficiaryAdmissionDocuments = [...formik.values.beneficiaryAdmissionDocuments];
    updatedBeneficiaryAdmissionDocuments.splice(index, 1);

    formik.setValues({
      ...formik.values,
      beneficiaryAdmissionDocuments: updatedBeneficiaryAdmissionDocuments,
    });
  };
  
  const addBeneficiaryStatusEntry = () => {
    formik.setValues({
      ...formik.values,
      beneficiaryStatusEntries: [
        ...formik.values.beneficiaryStatusEntries,
        { document: undefined, beneficiaryStatus: null, startingDate: dayjs(new Date()), endingDate: null},
      ],
    });
  };

  const removeBeneficiaryStatusEntry = (index) => {
    const updatedBeneficiaryStatusEntries = [...formik.values.beneficiaryStatusEntries];
    updatedBeneficiaryStatusEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      beneficiaryStatusEntries: updatedBeneficiaryStatusEntries,
    });
  };

  const addBeneficiaryEndowmentEntry = () => {
    formik.setValues({
      ...formik.values,
      beneficiaryEndowmentEntries: [
        ...formik.values.beneficiaryEndowmentEntries,
        { initialBalance: 0, endowmentType: null, startingDate: dayjs(new Date()), endingDate: null},
      ],
    });
  };

  const removeBeneficiaryEndowmentEntry = (index) => {
    const updatedBeneficiaryEndowmentEntries = [...formik.values.beneficiaryEndowmentEntries];
    updatedBeneficiaryEndowmentEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      beneficiaryEndowmentEntries: updatedBeneficiaryEndowmentEntries,
    });
  };

  const addAddressBookEntry = () => {
    formik.setValues({
      ...formik.values,
      addressBookEntries: [
        ...formik.values.addressBookEntries,
        { title: '', firstName: '', lastName: '', email: '', fullAddress: '', mobile: '', fix: '', fax: '', description: '' },
      ],
    });
  };

  const removeAddressBookEntry = (index) => {
    const updatedAddressBookEntries = [...formik.values.addressBookEntries];
    updatedAddressBookEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      addressBookEntries: updatedAddressBookEntries,
    });
  };

  const addCareerEntry = () => {
    formik.setValues({
      ...formik.values,
      careerEntries: [
        ...formik.values.careerEntries,
        { careerType: CAREER_ENTRY_TYPES.EDUCATION,
          institution: '',
          title: '',
          startingDate: dayjs(new Date()),
          endingDate: null,
          professionalStatus: null,
          email: '',
          fullAddress: '',
          description: '',
          mobile: '',
          fix: '',
          fax: ''
        },
      ],
    });
  };
  
  const removeCareerEntry = (index) => {
    const updatedCareerEntries = [...formik.values.careerEntries];
    updatedCareerEntries.splice(index, 1);
  
    formik.setValues({
      ...formik.values,
      careerEntries: updatedCareerEntries,
    });
  };
  
  const addDocumentRecord = () => {
    formik.setValues({
      ...formik.values,
      documentRecords: [
        ...formik.values.documentRecords,
        { document: undefined, name: '', beneficiaryDocumentType: null , startingDate: null, endingDate: null, 
          description: '', isNotificationEnabled: false,
          notificationPeriodUnit: NOTIFICATION_PERIOD_UNITS.MONTH, notificationPeriodValue: 1
        },
      ],
    });
  };

  const removeDocumentRecord = (index) => {
    const updatedDocumentRecords = [...formik.values.documentRecords];
    updatedDocumentRecords.splice(index, 1);

    formik.setValues({
      ...formik.values,
      documentRecords: updatedDocumentRecords,
    });
  };

  const [createBeneficiary, { loading: loadingPost }] = useMutation(
    POST_BENEFICIARY,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryCopy } = data.createBeneficiary.beneficiary;
        //   formik.setValues(beneficiaryCopy);
        formik.setFieldValue('id', beneficiaryCopy.id);
        handleNext();
      },
      update(cache, { data: { createBeneficiary } }) {
        const newBeneficiary = createBeneficiary.beneficiary;

        cache.modify({
          fields: {
            beneficiaries(
              existingBeneficiaries = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingBeneficiaries.totalCount + 1,
                nodes: [newBeneficiary, ...existingBeneficiaries.nodes],
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
  const [updateBeneficiary, { loading: loadingPut }] = useMutation(
    PUT_BENEFICIARY,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryCopy } =
          data.updateBeneficiary.beneficiary;
        //   formik.setValues(beneficiaryCopy);
        handleNext();
      },
      update(cache, { data: { updateBeneficiary } }) {
        const updatedBeneficiary = updateBeneficiary.beneficiary;

        cache.modify({
          fields: {
            beneficiaries(
              existingBeneficiaries = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBeneficiaries = existingBeneficiaries.nodes.map(
                (beneficiary) =>
                  readField('id', beneficiary) === updatedBeneficiary.id
                    ? updatedBeneficiary
                    : beneficiary,
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
  const onUpdateBeneficiary = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiary({ variables });
      },
    });
  };
  const [getBeneficiary, { loading: loadingBeneficiary }] = useLazyQuery(
    GET_BENEFICIARY,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, age, customFieldValues, ...beneficiaryCopy } = data.beneficiary;
        beneficiaryCopy.birthDate = beneficiaryCopy.birthDate ? dayjs(beneficiaryCopy.birthDate) : null;
        beneficiaryCopy.admissionDate = beneficiaryCopy.admissionDate ? dayjs(beneficiaryCopy.admissionDate) : null;
        beneficiaryCopy.professionalStatus = beneficiaryCopy.professionalStatus ? Number(beneficiaryCopy.professionalStatus.id): null;
        
        if (!beneficiaryCopy?.beneficiaryEntries) beneficiaryCopy['beneficiaryEntries'] = [];
        let items = [];
        beneficiaryCopy.beneficiaryEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.entryDate = itemCopy.entryDate ? dayjs(itemCopy.entryDate) : null
          itemCopy.dueDate = itemCopy.dueDate ? dayjs(itemCopy.dueDate) : null
          itemCopy.releaseDate = itemCopy.releaseDate ? dayjs(itemCopy.releaseDate) : null
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryEntries = items;
        if (!beneficiaryCopy?.beneficiaryAdmissionDocuments) beneficiaryCopy['beneficiaryAdmissionDocuments'] = [];
        items = [];
        beneficiaryCopy.beneficiaryAdmissionDocuments.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
          itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
          itemCopy.admissionDocumentType = itemCopy.admissionDocumentType
          ? Number(itemCopy.admissionDocumentType.id)
          : null;
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryAdmissionDocuments = items;
        if (!beneficiaryCopy?.beneficiaryStatusEntries) beneficiaryCopy['beneficiaryStatusEntries'] = [];
        items = [];
        beneficiaryCopy.beneficiaryStatusEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
          itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
          itemCopy.beneficiaryStatus = itemCopy.beneficiaryStatus
          ? Number(itemCopy.beneficiaryStatus.id)
          : null;
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryStatusEntries = items;
        if (!beneficiaryCopy?.beneficiaryEndowmentEntries) beneficiaryCopy['beneficiaryEndowmentEntries'] = [];
        items = [];
        beneficiaryCopy.beneficiaryEndowmentEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
          itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
          itemCopy.endowmentType = itemCopy.endowmentType
          ? Number(itemCopy.endowmentType.id)
          : null;
          items.push(itemCopy);
        });
        beneficiaryCopy.beneficiaryEndowmentEntries = items;
        
        if (!beneficiaryCopy?.addressBookEntries) beneficiaryCopy['addressBookEntries'] = [];
        items = [];
        beneficiaryCopy.addressBookEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        beneficiaryCopy.addressBookEntries = items;
        
        if (!beneficiaryCopy?.careerEntries) beneficiaryCopy['careerEntries'] = [];
        items = [];
        beneficiaryCopy.careerEntries.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
          itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
          itemCopy.professionalStatus = itemCopy.professionalStatus
          ? Number(itemCopy.professionalStatus.id)
          : null;
          items.push(itemCopy);
        });
        beneficiaryCopy.careerEntries = items;
        
        if (!beneficiaryCopy?.documentRecords) beneficiaryCopy['documentRecords'] = [];
        items = [];
        beneficiaryCopy.documentRecords.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
          itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
          itemCopy.beneficiaryDocumentType = itemCopy.beneficiaryDocumentType
          ? Number(itemCopy.beneficiaryDocumentType.id)
          : null;
          items.push(itemCopy);
        });
        beneficiaryCopy.documentRecords = items;

        formik.setValues(beneficiaryCopy);
      },
      onError: (err) => console.log(err),
    },
  );

  const {
    loading: loadingFinanciers,
    data: financiersData,
    error: financiersError,
    fetchMore: fetchMoreFinanciers,
  } = useQuery(GET_FINANCIERS, {
    fetchPolicy: 'network-only',
  });

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

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_BENEFICIARY, { fetchPolicy: 'network-only' });

  React.useEffect(() => {
    if (idBeneficiary) {
      getBeneficiary({ variables: { id: idBeneficiary } });
    }
  }, [idBeneficiary]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idBeneficiary) {
      getBeneficiary({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 8) navigate('/online/ressources-humaines/beneficiaires/liste');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="div" variant="h5">
          {title} {formik.values.number}
        </Typography>
        <Link
          to="/online/ressources-humaines/beneficiaires/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
      </Box>
      {loadingBeneficiary && <ProgressService type="form" />}
      {!loadingBeneficiary && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idBeneficiary ? true : false}
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
                      <ImageFileField
                        variant="outlined"
                        label="Photo"
                        imageValue={formik.values.photo}
                        onChange={(imageFile) =>
                          formik.setFieldValue('photo', imageFile)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
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
                          disabled={loadingPost || loadingPut}
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
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Nom d'usage"
                        value={formik.values.preferredName}
                        onChange={(e) =>
                          formik.setFieldValue('preferredName', e.target.value)
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
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(1)}
                optional={
                  <Typography variant="caption">Les contact(s) </Typography>
                }
              >
                Les contact(s) 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.addressBookEntries?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3}>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Titre"
                                value={item.title}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.title`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                                helperText="Ex : Père, Mère, Tuteur, Frère, Sœur..."
                              />
                            </Item>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Prénom"
                                value={item.firstName}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.firstName`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Nom"
                                value={item.lastName}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.lastName`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Téléphone mobile"
                                value={item.mobile}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.mobile`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Adresse E-mail"
                                value={item.email}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.email`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Adresse postale"
                                multiline
                                rows={9}
                                value={item.fullAddress}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.fullAddress`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Note"
                                multiline
                                rows={9}
                                value={item.description}
                                onChange={(e) =>
                                  formik.setFieldValue(`addressBookEntries.${index}.description`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeAddressBookEntry(index)}
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
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addAddressBookEntry}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter un contact
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(2)}
                optional={
                  <Typography variant="caption">Formation(s) / Experience(s)</Typography>
                }
              >
                Formation(s) / Experience(s)
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.careerEntries?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3}>
                            <Item>
                              <FormControl fullWidth>
                                  <InputLabel>Type</InputLabel>
                                  <Select
                                      value={item.careerType}
                                      onChange={(e) =>
                                        formik.setFieldValue(`careerEntries.${index}.careerType`, e.target.value)
                                      }
                                      disabled={loadingPost || loadingPut}
                                  >
                                      {CAREER_ENTRY_TYPES.ALL.map((state, index )=>{
                                          return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                                      })}
                                  </Select>
                              </FormControl>
                            </Item>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label={CAREER_ENTRY_TYPES.INSTITUTION_LABELS[item.careerType] || "Institution"}
                                value={item.institution}
                                onChange={(e) =>
                                  formik.setFieldValue(`careerEntries.${index}.institution`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Titre"
                                value={item.title}
                                onChange={(e) =>
                                  formik.setFieldValue(`careerEntries.${index}.title`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                                helperText={CAREER_ENTRY_TYPES.TEXT_HELPERS[item.careerType] || "Ex : Intitulé du poste"}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Statut professionnel
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="professionalStatus"
                                  label="Statut professionnel"
                                  value={item.professionalStatus}
                                  onChange={(e) =>
                                    formik.setFieldValue(`careerEntries.${index}.professionalStatus`, e.target.value)
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
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`careerEntries.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`careerEntries.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Téléphone mobile"
                                value={item.mobile}
                                onChange={(e) =>
                                  formik.setFieldValue(`careerEntries.${index}.mobile`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Adresse postale"
                                multiline
                                rows={6}
                                value={item.fullAddress}
                                onChange={(e) =>
                                  formik.setFieldValue(`careerEntries.${index}.fullAddress`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Box sx={{position: 'relative'}}>
                              <Item>
                                <TheTextField
                                  variant="outlined"
                                  label="Adresse E-mail"
                                  value={item.email}
                                  onChange={(e) =>
                                    formik.setFieldValue(`careerEntries.${index}.email`, e.target.value)
                                  }
                                  disabled={loadingPost || loadingPut}
                                />
                              </Item>
                              <Item>
                                <TheTextField
                                  variant="outlined"
                                  label="Détail"
                                  multiline
                                  rows={6}
                                  value={item.description}
                                  onChange={(e) =>
                                    formik.setFieldValue(`careerEntries.${index}.description`, e.target.value)
                                  }
                                  disabled={loadingPost || loadingPut}
                                />
                              </Item>
                                <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                  onClick={() => removeCareerEntry(index)}
                                  edge="end"
                                  color="error"
                                >
                                  <Close />
                                </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addCareerEntry}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter un contact
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(3)}
                optional={
                  <Typography variant="caption">Les admission(s)</Typography>
                }
              >
                Les admission(s) 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.beneficiaryAdmissionDocuments?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheFileField variant="outlined" label="Document d'admission"
                                fileValue={item.document}
                                onChange={(file) => formik.setFieldValue(`beneficiaryAdmissionDocuments.${index}.document`, file)}
                                disabled={loadingPost || loadingPut}
                                />
                            </Item>
                          </Grid>
                          {/* <Grid item xs={12} sm={6} md={2.5} >
                            <Item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Type de document d'admission
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Type de document d'admission"
                                  value={item.admissionDocumentType}
                                  onChange={(e) =>
                                    formik.setFieldValue(`beneficiaryAdmissionDocuments.${index}.admissionDocumentType`, e.target.value)
                                  }
                                >
                                  <MenuItem value={null}>
                                    <em>Choisissez un type</em>
                                  </MenuItem>
                                  {dataData?.admissionDocumentTypes?.map((data, index) => {
                                    return (
                                      <MenuItem key={index} value={data.id}>
                                        {data.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </Item>
                          </Grid> */}
                          <Grid item xs={12} sm={6} md={4}>
                            <Item>
                              <TheAutocomplete
                                options={financiersData?.financiers?.nodes}
                                label="Département financeur"
                                multiple={false}
                                placeholder="Choisissez un département"
                                value={item.financier}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`beneficiaryAdmissionDocuments.${index}.financier`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2.5} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date d'admission"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryAdmissionDocuments.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2.5} >
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de sortie"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryAdmissionDocuments.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeBeneficiaryAdmissionDocument(index)}
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
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addBeneficiaryAdmissionDocument}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une admission
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(4)}
                optional={
                  <Typography variant="caption">Déclarer une entrée / sortie</Typography>
                }
              >
                Déclarer une entrée / sortie
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.beneficiaryEntries?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheAutocomplete
                                options={establishmentsData?.establishments?.nodes}
                                label="Structure(s) concernée(s)"
                                placeholder="Ajouter une structure"
                                limitTags={3}
                                value={item.establishments}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`beneficiaryEntries.${index}.establishments`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheAutocomplete
                                options={employeesData?.employees?.nodes}
                                onInput={(e) => {
                                  onGetEmployees(e.target.value)
                                }}
                                label="Référents internes"
                                placeholder="Ajouter un référent interne"
                                limitTags={3}
                                value={item.internalReferents}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`beneficiaryEntries.${index}.internalReferents`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date d'entrée"
                                value={item.entryDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryEntries.${index}.entryDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date d'échéance"
                                value={item.dueDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryEntries.${index}.dueDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2} >
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de sortie"
                                value={item.releaseDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryEntries.${index}.releaseDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeBeneficiaryEntry(index)}
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
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addBeneficiaryEntry}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une entrée
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(5)}
                optional={
                  <Typography variant="caption">Les statut(s) </Typography>
                }
              >
                Les statut(s) 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.beneficiaryStatusEntries?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheFileField variant="outlined" label="Justificatif"
                                fileValue={item.document}
                                onChange={(file) => formik.setFieldValue(`beneficiaryStatusEntries.${index}.document`, file)}
                                disabled={loadingPost || loadingPut}
                                />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Statut
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Statut"
                                  value={item.beneficiaryStatus}
                                  onChange={(e) =>
                                    formik.setFieldValue(`beneficiaryStatusEntries.${index}.beneficiaryStatus`, e.target.value)
                                  }
                                >
                                  <MenuItem value={null}>
                                    <em>Choisissez un status</em>
                                  </MenuItem>
                                  {dataData?.beneficiaryStatuses?.map((data, index) => {
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
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryStatusEntries.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryStatusEntries.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeBeneficiaryStatusEntry(index)}
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
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addBeneficiaryStatusEntry}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter un statut
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step> 
            <Step>
              <StepLabel
                onClick={() => onGoToStep(6)}
                optional={
                  <Typography variant="caption">Les dotation(s) </Typography>
                }
              >
                Les dotation(s) 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.beneficiaryEndowmentEntries?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3.5} >
                            <Item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Type de dotation
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Type de dotation"
                                  value={item.endowmentType}
                                  onChange={(e) =>
                                    formik.setFieldValue(`beneficiaryEndowmentEntries.${index}.endowmentType`, e.target.value)
                                  }
                                >
                                  <MenuItem value={null}>
                                    <em>Choisissez un type de dotation</em>
                                  </MenuItem>
                                  {dataData?.endowmentTypes?.map((data, index) => {
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
                          <Grid item xs={12} sm={6} md={2.5}>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Solde initial"
                                type="number"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">€</InputAdornment>
                                  ),
                                }}
                                value={item.initialBalance}
                                onChange={(e) =>
                                  formik.setFieldValue(`beneficiaryEndowmentEntries.${index}.initialBalance`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryEndowmentEntries.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`beneficiaryEndowmentEntries.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeBeneficiaryEndowmentEntry(index)}
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
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addBeneficiaryEndowmentEntry}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une dotation
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(7)}
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
                              <TheFileField variant="outlined" label="Document"
                                fileValue={item.document}
                                onChange={(file) => formik.setFieldValue(`documentRecords.${index}.document`, file)}
                                disabled={loadingPost || loadingPut}
                                />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            {/* <Item>
                              <TheTextField
                                variant="outlined"
                                label="Nom"
                                value={item.name}
                                onChange={(e) =>
                                  formik.setFieldValue(`documentRecords.${index}.name`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item> */}
                            <Item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Type
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Type"
                                  value={item.beneficiaryDocumentType}
                                  onChange={(e) =>
                                    formik.setFieldValue(`documentRecords.${index}.beneficiaryDocumentType`, e.target.value)
                                  }
                                >
                                  <MenuItem value={null}>
                                    <em>Choisissez un type</em>
                                  </MenuItem>
                                  {dataData?.beneficiaryDocumentTypes?.map((data, index) => {
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
                          <Grid item xs={12} sm={6} md={2} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Début le"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`documentRecords.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Valide jusqu'au"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`documentRecords.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4} >
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Description"
                                multiline
                                rows={3}
                                value={item.description}
                                onChange={(e) =>
                                  formik.setFieldValue(`documentRecords.${index}.description`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeDocumentRecord(index)}
                                edge="end"
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Item>
                            <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              key={index}
                            >
                              <Grid item xs={12} sm={item.isNotificationEnabled ? 4 : 12} md={item.isNotificationEnabled ? 4 : 12} >
                                  <TheSwitch
                                    variant="outlined"
                                    label="Notifier ?"
                                    checked={item.isNotificationEnabled}
                                    value={item.isNotificationEnabled}
                                    onChange={(e) =>
                                      formik.setFieldValue(`documentRecords.${index}.isNotificationEnabled`, e.target.checked)
                                    }
                                    disabled={loadingPost || loadingPut}
                                  />
                              </Grid>
                              {item.isNotificationEnabled && <>
                                <Grid item xs={12} sm={3} md={3} >
                                    <TheTextField
                                        variant="outlined"
                                        type="number"
                                        value={item.notificationPeriodValue}
                                        onChange={(e) =>
                                          formik.setFieldValue(`documentRecords.${index}.notificationPeriodValue`, e.target.value)
                                        }
                                        disabled={loadingPost || loadingPut}
                                      />
                                </Grid>
                                <Grid item xs={12} sm={5} md={5} >
                                    <FormControl fullWidth>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={item.notificationPeriodUnit}
                                        onChange={(e) =>
                                          formik.setFieldValue(`documentRecords.${index}.notificationPeriodUnit`, e.target.value)
                                        }
                                        disabled={loadingPost || loadingPut}
                                      >
                                        {NOTIFICATION_PERIOD_UNITS?.ALL?.map((type, index) => {
                                          return (
                                            <MenuItem key={index} value={type.value}>
                                              {type.label}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                </Grid></>
                              }
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    md={12}
                    item
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addDocumentRecord}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter un Document
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step> 
            <Step>
              <StepLabel
                onClick={() => onGoToStep(8)}
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
                  <Grid item xs={12} sm={12} md={12} >
                    <CustomFieldValues 
                      formModel="Beneficiary"
                      idObject={formik.values.id}
                      disabled={loadingPost || loadingPut}
                      triggerSave={triggerSave}
                      onSaved={(data, err)=> {if(data) handleNext()}}
                    />
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
                  to="/online/ressources-humaines/beneficiaires/liste"
                  className="no_style"
                >
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Terminer
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
