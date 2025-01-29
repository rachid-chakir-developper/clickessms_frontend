import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BANK_ACCOUNT } from '../../../../../_shared/graphql/queries/BankAccountQueries';
import {
  POST_BANK_ACCOUNT,
  PUT_BANK_ACCOUNT,
} from '../../../../../_shared/graphql/mutations/BankAccountMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { ACCOUNT_TYPES } from '../../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBankAccountForm({ idBankAccount, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    iban: yup
      .string("Entrez l'IBAN de compte bancaire")
      .required("IBAN de compte bancaire est obligatoire"),});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      accountNumber: '',
      accountType: 'CURRENT',
      iban: '',
      bic: '',
      bankName: '',
      openingDate: dayjs(new Date()),
      closingDate: null,
      description: '',
      observation: '',
      isActive: true,
      establishment: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...bankAccountCopy } = values;
      bankAccountCopy.establishment = bankAccountCopy.establishment ? bankAccountCopy.establishment.id : null;
      if (idBankAccount && idBankAccount != '') {
        onUpdateBankAccount({
          id: bankAccountCopy.id,
          bankAccountData: bankAccountCopy,
          image: image,
        });
      } else
        createBankAccount({
          variables: {
            bankAccountData: bankAccountCopy,
            image: image,
          },
        });
    },
  });
  const [createBankAccount, { loading: loadingPost }] = useMutation(POST_BANK_ACCOUNT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...bankAccountCopy } = data.createBankAccount.bankAccount;
      //   formik.setValues(bankAccountCopy);
      navigate('/online/finance/tresorerie/comptes-bancaires/liste');
    },
    update(cache, { data: { createBankAccount } }) {
      const newBankAccount = createBankAccount.bankAccount;

      cache.modify({
        fields: {
          bankAccounts(existingBankAccounts = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingBankAccounts.totalCount + 1,
              nodes: [newBankAccount, ...existingBankAccounts.nodes],
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
  const [updateBankAccount, { loading: loadingPut }] = useMutation(PUT_BANK_ACCOUNT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...bankAccountCopy } = data.updateBankAccount.bankAccount;
      //   formik.setValues(bankAccountCopy);
      navigate('/online/finance/tresorerie/comptes-bancaires/liste');
    },
    update(cache, { data: { updateBankAccount } }) {
      const updatedBankAccount = updateBankAccount.bankAccount;

      cache.modify({
        fields: {
          bankAccounts(
            existingBankAccounts = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedBankAccounts = existingBankAccounts.nodes.map((bankAccount) =>
              readField('id', bankAccount) === updatedBankAccount.id
                ? updatedBankAccount
                : bankAccount,
            );

            return {
              totalCount: existingBankAccounts.totalCount,
              nodes: updatedBankAccounts,
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
  const onUpdateBankAccount = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBankAccount({ variables });
      },
    });
  };
  const [getBankAccount, { loading: loadingBankAccount }] = useLazyQuery(GET_BANK_ACCOUNT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...bankAccountCopy1 } = data.bankAccount;
      let { folder, ...bankAccountCopy2 } = bankAccountCopy1;
      let { balance, ...bankAccountCopy } = bankAccountCopy2;
      bankAccountCopy.openingDate = bankAccountCopy.openingDate ? dayjs(bankAccountCopy.openingDate) : null;
      bankAccountCopy.closingDate = bankAccountCopy.closingDate ? dayjs(bankAccountCopy.closingDate) : null;
      formik.setValues(bankAccountCopy);
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
    if (idBankAccount) {
      getBankAccount({ variables: { id: idBankAccount } });
    }
  }, [idBankAccount]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingBankAccount && <ProgressService type="form" />}
      {!loadingBankAccount && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Image"
                  imageValue={formik.values.image}
                  onChange={(imageFile) =>
                    formik.setFieldValue('image', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
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
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                  Type de compte
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type de compte"
                    value={formik.values.accountType}
                    onChange={(e) =>
                      formik.setFieldValue(
                        'accountType',
                        e.target.value,
                      )
                    }
                  >
                    {ACCOUNT_TYPES?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structure concernée"
                  placeholder="Choisissez une structure"
                  multiple={false}
                  value={formik.values.establishment}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishment', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Numéro de compte"
                  value={formik.values.accountNumber}
                  onChange={(e) =>
                    formik.setFieldValue('accountNumber', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="IBAN (RIB)"
                  id="iban"
                  value={formik.values.iban}
                  onBlur={formik.handleBlur}
                  error={formik.touched.iban && Boolean(formik.errors.iban)}
                  helperText={formik.touched.iban && formik.errors.iban}
                  onChange={(e) => formik.setFieldValue('iban', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="BIC"
                  value={formik.values.bic}
                  onChange={(e) => formik.setFieldValue('bic', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
            <Grid item xs={12} sm={6} md={6}>
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
                <Link to="/online/finance/tresorerie/comptes-bancaires/liste" className="no_style">
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
