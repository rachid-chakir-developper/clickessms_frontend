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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_ENDOWMENT_PAYMENT } from '../../../../_shared/graphql/queries/EndowmentPaymentQueries';
import {
  POST_ENDOWMENT_PAYMENT,
  PUT_ENDOWMENT_PAYMENT,
} from '../../../../_shared/graphql/mutations/EndowmentPaymentMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';
import { GET_DATAS_ENDOWMENT_PAYMENT } from '../../../../_shared/graphql/queries/DataQueries';
import { PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import { GET_CASH_REGISTERS } from '../../../../_shared/graphql/queries/CashRegisterQueries';
import { GET_BANK_CARDS } from '../../../../_shared/graphql/queries/BankCardQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEndowmentPaymentForm({ idEndowmentPayment, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    amount: yup
      .number('Veuillez entrer un montant valide') // Utilisation de `.number` pour valider un champ numérique.
      .typeError('Le montant de dotation doit être un nombre') // Message d'erreur si la valeur n'est pas un nombre.
      .positive('Le montant de dotation doit être supérieur à 0') // Validation pour un montant positif.
      .required('Le montant de dotation est obligatoire'), // Rend le champ obligatoire.
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      label: '',
      date: dayjs(new Date()),
      beneficiary: null,
      amount: 0,
      paymentMethod: PAYMENT_METHOD.CASH,
      bankCard: null,
      cashRegister: null,
      checkNumber: '',
      bankName: '',
      iban: '',
      endowmentType: null,
      description: '',
      observation: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let {files, ...endowmentPaymentCopy}= values;
      endowmentPaymentCopy.employee = endowmentPaymentCopy.employee ? endowmentPaymentCopy.employee.id : null;
      endowmentPaymentCopy.beneficiary = endowmentPaymentCopy.beneficiary ? endowmentPaymentCopy.beneficiary.id : null;
      endowmentPaymentCopy.bankCard = endowmentPaymentCopy.bankCard && endowmentPaymentCopy.paymentMethod===PAYMENT_METHOD.CREDIT_CARD ? endowmentPaymentCopy.bankCard.id : null;
      endowmentPaymentCopy.cashRegister = endowmentPaymentCopy.cashRegister && endowmentPaymentCopy.paymentMethod===PAYMENT_METHOD.CASH ? endowmentPaymentCopy.cashRegister.id : null;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))
      if (idEndowmentPayment && idEndowmentPayment != '') {
        onUpdateEndowmentPayment({
          id: endowmentPaymentCopy.id,
          endowmentPaymentData: endowmentPaymentCopy,
          files: files
        });
      } else
        createEndowmentPayment({
          variables: {
            endowmentPaymentData: endowmentPaymentCopy,
            files: files
          },
        });
    },
  });
  const [createEndowmentPayment, { loading: loadingPost }] = useMutation(
    POST_ENDOWMENT_PAYMENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...endowmentPaymentCopy } = data.createEndowmentPayment.endowmentPayment;
        //   formik.setValues(endowmentPaymentCopy);
        navigate('/online/finance/dotations-paiements/liste');
      },
      update(cache, { data: { createEndowmentPayment } }) {
        const newEndowmentPayment = createEndowmentPayment.endowmentPayment;

        cache.modify({
          fields: {
            endowmentPayments(existingEndowmentPayments = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingEndowmentPayments.totalCount + 1,
                nodes: [newEndowmentPayment, ...existingEndowmentPayments.nodes],
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
  const [updateEndowmentPayment, { loading: loadingPut }] = useMutation(PUT_ENDOWMENT_PAYMENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...endowmentPaymentCopy } = data.updateEndowmentPayment.endowmentPayment;
      //   formik.setValues(endowmentPaymentCopy);
      navigate('/online/finance/dotations-paiements/liste');
    },
    update(cache, { data: { updateEndowmentPayment } }) {
      const updatedEndowmentPayment = updateEndowmentPayment.endowmentPayment;

      cache.modify({
        fields: {
          endowmentPayments(
            existingEndowmentPayments = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedEndowmentPayments = existingEndowmentPayments.nodes.map((endowmentPayment) =>
              readField('id', endowmentPayment) === updatedEndowmentPayment.id
                ? updatedEndowmentPayment
                : endowmentPayment,
            );

            return {
              totalCount: existingEndowmentPayments.totalCount,
              nodes: updatedEndowmentPayments,
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
  const onUpdateEndowmentPayment = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEndowmentPayment({ variables });
      },
    });
  };

  
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
    } = useQuery(GET_DATAS_ENDOWMENT_PAYMENT, { fetchPolicy: 'network-only' });
    
  const {
      loading: loadingCashRegisters,
      data: cashRegistersData,
      error: cashRegistersError,
      fetchMore: fetchMoreCashRegisters,
    } = useQuery(GET_CASH_REGISTERS, {
      fetchPolicy: 'network-only',
    });
  
  const {
    loading: loadingBankCards,
    data: bankCardsData,
    error: bankCardsError,
    fetchMore: fetchMoreBankCards,
  } = useQuery(GET_BANK_CARDS, {
    fetchPolicy: 'network-only',
  });

  const [getEndowmentPayment, { loading: loadingEndowmentPayment }] = useLazyQuery(
    GET_ENDOWMENT_PAYMENT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, endowment, ...endowmentPaymentCopy } = data.endowmentPayment;
        endowmentPaymentCopy.date = endowmentPaymentCopy.date ? dayjs(endowmentPaymentCopy.date) : null;
        endowmentPaymentCopy.endowmentType = endowmentPaymentCopy.endowmentType ? Number(endowmentPaymentCopy.endowmentType.id): null;
        formik.setValues(endowmentPaymentCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idEndowmentPayment) {
      getEndowmentPayment({ variables: { id: idEndowmentPayment } });
    }
  }, [idEndowmentPayment]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.title}</em></u>
      </Typography>
      {loadingEndowmentPayment && <ProgressService type="form" />}
      {!loadingEndowmentPayment && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
          <Grid item xs={12} sm={6} md={3} >
            <Item>
              <TheTextField
                variant="outlined"
                label="Libellé"
                value={formik.values.label}
                onChange={(e) => formik.setFieldValue('label', e.target.value)}
                disabled={loadingPost || loadingPut}
              />
            </Item>
          </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) =>
                    formik.setFieldValue('date', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                  onInput={(e) => {
                    onGetBeneficiaries(e.target.value)
                  }}
                  onFocus={(e) => {
                    onGetBeneficiaries(e.target.value)
                  }}
                  label="Personne accompagnée"
                  placeholder="Choisissez une personne accompagnée"
                  multiple={false}
                  value={formik.values.beneficiary}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiary', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  id="amount"
                  label="Montant"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={formik.values.amount}
                  onChange={(e) =>
                    formik.setFieldValue('amount', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)} // Gestion des erreurs
                  helperText={formik.touched.amount && formik.errors.amount} // Affiche le message d'erreur
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-label">
                    Type dotation
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="endowmentType"
                    label="Type dotation"
                    value={formik.values.endowmentType}
                    onChange={(e) =>
                      formik.setFieldValue('endowmentType', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value={null}>
                      <em>Choisissez un type</em>
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
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Methode du paiement</InputLabel>
                    <Select
                        value={formik.values.paymentMethod}
                        onChange={(e) => formik.setFieldValue('paymentMethod', e.target.value)}
                        disabled={loadingPost || loadingPut}
                    >
                        {PAYMENT_METHOD.ALL.map((state, index )=>{
                            return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
              </Item>
              {formik.values.paymentMethod===PAYMENT_METHOD.CREDIT_CARD && <Item>
                <TheAutocomplete
                  options={bankCardsData?.bankCards?.nodes}
                  label="Carte bancaire"
                  placeholder="Choisissez une carte"
                  limitTags={2}
                  multiple={false}
                  value={formik.values.bankCard}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('bankCard', newValue);
                  }}
                  disabled={loadingPost || loadingPut}
                />
              </Item>}
              {formik.values.paymentMethod===PAYMENT_METHOD.CASH && <Item>
                <TheAutocomplete
                  options={cashRegistersData?.cashRegisters?.nodes}
                  label="Caisse"
                  placeholder="Choisissez une caisse"
                  limitTags={2}
                  multiple={false}
                  value={formik.values.cashRegister}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('cashRegister', newValue);
                  }}
                  disabled={loadingPost || loadingPut}
                />
              </Item>}
              {formik.values.paymentMethod === PAYMENT_METHOD.BANK_TRANSFER && 
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="RIB ou IBAN"
                    value={formik.values.iban}
                    onChange={(e) =>
                      formik.setFieldValue('iban', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  />
                </Item>}
              {formik.values.paymentMethod === PAYMENT_METHOD.CHECK && <>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Numéro du chèque"
                    value={formik.values.checkNumber}
                    onChange={(e) =>
                      formik.setFieldValue('checkNumber', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Nom de la banque"
                    value={formik.values.bankName}
                    onChange={(e) =>
                      formik.setFieldValue('bankName', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  />
                </Item>
              </>}
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
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Observation"
                  multiline
                  rows={4}
                  value={formik.values.observation}
                  onChange={(e) =>
                    formik.setFieldValue('observation', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/finance/dotations-paiements/liste" className="no_style">
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
