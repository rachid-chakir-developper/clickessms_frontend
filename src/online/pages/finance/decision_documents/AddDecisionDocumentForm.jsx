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
import { GET_DECISION_DOCUMENT } from '../../../../_shared/graphql/queries/DecisionDocumentQueries';
import {
  POST_DECISION_DOCUMENT,
  PUT_DECISION_DOCUMENT,
} from '../../../../_shared/graphql/mutations/DecisionDocumentMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Close } from '@mui/icons-material';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';

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
    name: yup
      .string('Le titre')
      .required('Le titre est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      document: undefined,
      number: '',
      name: '',
      decisionDate: dayjs(new Date()),
      receptionDateTime: dayjs(new Date()),
      description: '',
      observation: '',
      isActive: true,
      financier: null,
      decisionDocumentItems: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...decisionDocumentCopy } = values;
      decisionDocumentCopy.financier = decisionDocumentCopy.financier ? decisionDocumentCopy.financier.id : null;
      if (!decisionDocumentCopy?.decisionDocumentItems) decisionDocumentCopy['decisionDocumentItems'] = [];
        let items = [];
        decisionDocumentCopy.decisionDocumentItems.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.establishment = itemCopy.establishment ? itemCopy.establishment.id : null;
          items.push(itemCopy);
        });
        decisionDocumentCopy.decisionDocumentItems = items;
      if (decisionDocumentCopy?.id && decisionDocumentCopy?.id != '') {
        onUpdateDecisionDocument({
          id: decisionDocumentCopy.id,
          decisionDocumentData: decisionDocumentCopy,
          document: document,
        });
      } else
        createDecisionDocument({
          variables: {
            decisionDocumentData: decisionDocumentCopy,
            document: document,
          },
        });
    },
  });
  const addDecisionDocumentEntry = () => {
    formik.setValues({
      ...formik.values,
      decisionDocumentItems: [
        ...formik.values.decisionDocumentItems,
        { establishment: null , startingDateTime: dayjs(new Date()), endingDateTime: null, price: 0, endowment: 0, occupancyRate: 100, theoreticalNumberUnitWork: 0},
      ],
    });
  };

  const removeDecisionDocumentEntry = (index) => {
    const updatedDecisionDocumentEntries = [...formik.values.decisionDocumentItems];
    updatedDecisionDocumentEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      decisionDocumentItems: updatedDecisionDocumentEntries,
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
            decisionDocuments(
              existingDecisionDocuments = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingDecisionDocuments.totalCount + 1,
                nodes: [newDecisionDocument, ...existingDecisionDocuments.nodes],
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
            decisionDocuments(
              existingDecisionDocuments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedDecisionDocuments = existingDecisionDocuments.nodes.map(
                (decisionDocument) =>
                  readField('id', decisionDocument) === updatedDecisionDocument.id
                    ? updatedDecisionDocument
                    : decisionDocument,
              );

              return {
                totalCount: existingDecisionDocuments.totalCount,
                nodes: updatedDecisionDocuments,
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
        decisionDocumentCopy.decisionDate = decisionDocumentCopy.decisionDate ? dayjs(decisionDocumentCopy.decisionDate) : null;
        decisionDocumentCopy.receptionDateTime = decisionDocumentCopy.receptionDateTime ? dayjs(decisionDocumentCopy.receptionDateTime) : null;
        
        if (!decisionDocumentCopy?.decisionDocumentItems) decisionDocumentCopy['decisionDocumentItems'] = [];
        let items = [];
        decisionDocumentCopy.decisionDocumentItems.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDateTime = itemCopy.startingDateTime ? dayjs(itemCopy.startingDateTime) : null;
          itemCopy.endingDateTime = itemCopy.endingDateTime ? dayjs(itemCopy.endingDateTime) : null;
          items.push(itemCopy);
        });
        decisionDocumentCopy.decisionDocumentItems = items;
        formik.setValues(decisionDocumentCopy);
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
    if(activeStep >= 1) navigate('/online/finance/decisions/liste');
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
                  
                  <Grid item xs={12} sm={6} md={3} >
                    <Item>
                      <TheFileField variant="outlined" label="Document d'admission"
                        fileValue={formik.values.document}
                        onChange={(file) => formik.setFieldValue('document', file)}
                        disabled={loadingPost || loadingPut}
                        />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de décision / notification"
                        value={formik.values.decisionDate}
                        onChange={(date) => formik.setFieldValue('decisionDate', date)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date de récéption"
                        value={formik.values.receptionDateTime}
                        onChange={(date) => formik.setFieldValue('receptionDateTime', date)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.decisionDocumentItems?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={2} >
                            <Item>
                              <TheAutocomplete
                                options={establishmentsData?.establishments?.nodes}
                                label="Établissement / Service"
                                placeholder="Ajouter un établissement ou service"
                                multiple={false}
                                value={item.establishment}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.establishment`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDateTime}
                                onChange={(date) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.startingDateTime`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={2} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDateTime}
                                onChange={(date) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.endingDateTime`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={1.5}>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Prix"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                value={item.price}
                                onChange={(e) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.price`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={1.5}>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Dotation"
                                type="number"
                                value={item.endowment}
                                onChange={(e) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.endowment`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={1.5}>
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Taux d'occupation"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                }}
                                value={item.occupancyRate}
                                onChange={(e) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.occupancyRate`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={1.5}>
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Jours d'ouverture"
                                type="number"
                                value={item.theoreticalNumberUnitWork}
                                onChange={(e) =>
                                  formik.setFieldValue(`decisionDocumentItems.${index}.theoreticalNumberUnitWork`, e.target.value)
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
                    item
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
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/finance/decisions/liste"
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
