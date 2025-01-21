import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem, InputAdornment, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BUDGET } from '../../../../_shared/graphql/queries/BudgetQueries';
import {
  POST_BUDGET,
  PUT_BUDGET,
} from '../../../../_shared/graphql/mutations/BudgetMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import AccountingNatureTreeViewForm from './AccountingNatureTreeViewForm';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBudgetForm({ idBudget, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    amountAllocated: yup
      .number("Entrez le Montant prévu de budget")
      .required("Montant prévu de budget est obligatoire"),});
  const formik = useFormik({
    initialValues: {
      number: '',
      name: '',
      amountAllocated: 0,
      amountSpent: 0,
      startingDate: dayjs(new Date()),
      endingDate: null,
      description: '',
      observation: '',
      isActive: true,
      establishment: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let budgetCopy = {...values};
      budgetCopy.establishment = budgetCopy.establishment ? budgetCopy.establishment.id : null;
      if (budgetCopy?.id && budgetCopy?.id != '') {
        onUpdateBudget({
          id: budgetCopy.id,
          budgetData: budgetCopy,
        });
      } else
        createBudget({
          variables: {
            budgetData: budgetCopy,
          },
        });
    },
  });
  const [createBudget, { loading: loadingPost }] = useMutation(POST_BUDGET, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...budgetCopy } = data.createBudget.budget;
      //   formik.setValues(budgetCopy);
      formik.setFieldValue('id', budgetCopy.id);
      handleNext();
    },
    update(cache, { data: { createBudget } }) {
      const newBudget = createBudget.budget;

      cache.modify({
        fields: {
          budgets(existingBudgets = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingBudgets.totalCount + 1,
              nodes: [newBudget, ...existingBudgets.nodes],
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
  const [updateBudget, { loading: loadingPut }] = useMutation(PUT_BUDGET, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...budgetCopy } = data.updateBudget.budget;
      //   formik.setValues(budgetCopy);
      handleNext();
    },
    update(cache, { data: { updateBudget } }) {
      const updatedBudget = updateBudget.budget;

      cache.modify({
        fields: {
          budgets(
            existingBudgets = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedBudgets = existingBudgets.nodes.map((budget) =>
              readField('id', budget) === updatedBudget.id
                ? updatedBudget
                : budget,
            );

            return {
              totalCount: existingBudgets.totalCount,
              nodes: updatedBudgets,
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
  const onUpdateBudget = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBudget({ variables });
      },
    });
  };
  const [getBudget, { loading: loadingBudget }] = useLazyQuery(GET_BUDGET, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...budgetCopy1 } = data.budget;
      let { folder, ...budgetCopy2 } = budgetCopy1;
      let { balance, ...budgetCopy } = budgetCopy2;
      budgetCopy.startingDate = budgetCopy.startingDate ? dayjs(budgetCopy.startingDate) : null;
      budgetCopy.endingDate = budgetCopy.endingDate ? dayjs(budgetCopy.endingDate) : null;
      formik.setValues(budgetCopy);
    },
    onError: (err) => console.log(err),
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
    if (idBudget) {
      getBudget({ variables: { id: idBudget } });
    }
  }, [idBudget]); 
  React.useEffect(() => {
    if (searchParams.get('id') && !idBudget) {
      getBudget({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 1) navigate('/online/finance/budgets/liste');
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
        {title} {formik.values.number}
      </Typography>
      {loadingBudget && <ProgressService type="form" />}
      {!loadingBudget && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idBudget ? true : false}
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
                        value={formik.values.name}
                        onChange={(e) => formik.setFieldValue('name', e.target.value)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Établissement / Service"
                        placeholder="Choisissez un établissement ou un service"
                        multiple={false}
                        value={formik.values.establishment}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('establishment', newValue)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheDesktopDatePicker
                        label="Année"
                        format="YYYY"
                        views={['year']}
                        value={formik.values.startingDate}
                        onChange={(date) =>
                          formik.setFieldValue('startingDate', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Montant prévu"
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                          ),
                        }}
                        value={formik.values.amountAllocated}
                        onChange={(e) =>
                          formik.setFieldValue('amountAllocated', e.target.value)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={8}>
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
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(1)}
                optional={
                  <Typography variant="caption">Détails</Typography>
                }
              >
                Détails
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12}>
                    <Item>
                      <AccountingNatureTreeViewForm budget={formik.values} />
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
                {activeStep===0 && <><Link
                  to="/online/finance/budgets/liste"
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
                </Button></>}
                {activeStep!==0 && <Link
                  to="/online/finance/budgets/liste"
                  className="no_style"
                >
                  <Button variant="contained" sx={{ marginRight: '10px' }}>
                  Terminer
                  </Button>
                </Link>}
              </Item>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}
