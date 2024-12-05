import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_CASH_REGISTER } from '../../../../../_shared/graphql/queries/CashRegisterQueries';
import {
  POST_CASH_REGISTER,
  PUT_CASH_REGISTER,
} from '../../../../../_shared/graphql/mutations/CashRegisterMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_BANK_ACCOUNTS } from '../../../../../_shared/graphql/queries/BankAccountQueries';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_ESTABLISHMENTS } from '../../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../../../_shared/graphql/queries/EmployeeQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCashRegisterForm({ idCashRegister, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      name: '',
      description: '',
      openingDate: dayjs(new Date()),
      closingDate: null,
      establishments: [],
      managers: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...cashRegisterCopy } = values;
      cashRegisterCopy.establishments = cashRegisterCopy.establishments.map((i) => i?.id);
      cashRegisterCopy.managers = cashRegisterCopy.managers.map((i) => i?.id);
      if (idCashRegister && idCashRegister != '') {
        onUpdateCashRegister({
          id: cashRegisterCopy.id,
          cashRegisterData: cashRegisterCopy
        });
      } else
        createCashRegister({
          variables: {
            cashRegisterData: cashRegisterCopy
          },
        });
    },
  });

  
  const [createCashRegister, { loading: loadingPost }] = useMutation(POST_CASH_REGISTER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...cashRegisterCopy } = data.createCashRegister.cashRegister;
      //   formik.setValues(cashRegisterCopy);
      navigate('/online/finance/tresorerie/caisses/liste');
    },
    update(cache, { data: { createCashRegister } }) {
      const newCashRegister = createCashRegister.cashRegister;

      cache.modify({
        fields: {
          cashRegisters(existingCashRegisters = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingCashRegisters.totalCount + 1,
              nodes: [newCashRegister, ...existingCashRegisters.nodes],
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
  const [updateCashRegister, { loading: loadingPut }] = useMutation(PUT_CASH_REGISTER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...cashRegisterCopy } = data.updateCashRegister.cashRegister;
      //   formik.setValues(cashRegisterCopy);
      navigate('/online/finance/tresorerie/caisses/liste');
    },
    update(cache, { data: { updateCashRegister } }) {
      const updatedCashRegister = updateCashRegister.cashRegister;

      cache.modify({
        fields: {
          cashRegisters(
            existingCashRegisters = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedCashRegisters = existingCashRegisters.nodes.map((cashRegister) =>
              readField('id', cashRegister) === updatedCashRegister.id
                ? updatedCashRegister
                : cashRegister,
            );

            return {
              totalCount: existingCashRegisters.totalCount,
              nodes: updatedCashRegisters,
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
  const onUpdateCashRegister = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCashRegister({ variables });
      },
    });
  };
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

  const [getCashRegister, { loading: loadingCashRegister }] = useLazyQuery(GET_CASH_REGISTER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, balance, ...cashRegisterCopy } = data.cashRegister;
      cashRegisterCopy.openingDate = cashRegisterCopy.openingDate ? dayjs(cashRegisterCopy.openingDate) : null;
      cashRegisterCopy.closingDate = cashRegisterCopy.closingDate ? dayjs(cashRegisterCopy.closingDate) : null;
      cashRegisterCopy.establishments =
      cashRegisterCopy.establishments
        ? cashRegisterCopy.establishments.map((i) => i?.establishment)
        : [];
      cashRegisterCopy.managers = cashRegisterCopy.managers
        ? cashRegisterCopy.managers.map((i) => i?.employee)
        : [];
      formik.setValues(cashRegisterCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idCashRegister) {
      getCashRegister({ variables: { id: idCashRegister } });
    }
  }, [idCashRegister]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingCashRegister && <ProgressService type="form" />}
      {!loadingCashRegister && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  value={formik.values.name}
                  onChange={(e) => formik.setFieldValue('name', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
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
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
            <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
                  onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}
                  label="Responsables"
                  placeholder="Ajouter un responsables"
                  limitTags={2}
                  value={formik.values.managers}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('managers', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDesktopDatePicker
                  label="Date d'ouverture"
                  value={formik.values.openingDate}
                  onChange={(date) =>
                    formik.setFieldValue('openingDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de fermeture"
                  value={formik.values.closingDate}
                  onChange={(date) =>
                    formik.setFieldValue('closingDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Détail"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={(e) => formik.setFieldValue('description', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/finance/tresorerie/caisses/liste"
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
