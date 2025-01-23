import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, Divider } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BANK_CARD } from '../../../../../_shared/graphql/queries/BankCardQueries';
import {
  POST_BANK_CARD,
  PUT_BANK_CARD,
} from '../../../../../_shared/graphql/mutations/BankCardMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_BANK_ACCOUNTS } from '../../../../../_shared/graphql/queries/BankAccountQueries';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import ImageFileField from '../../../../../_shared/components/form-fields/ImageFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBankCardForm({ idBankCard, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      title: '',
      expirationDate: dayjs(new Date()),
      cardNumber: '',
      cardholderName: '',
      cvv: '',
      bankAccount: null,
      description: '',
      observation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...bankCardCopy } = values;
      bankCardCopy.bankAccount = bankCardCopy.bankAccount
        ? bankCardCopy.bankAccount.id
        : null;
      if (idBankCard && idBankCard != '') {
        onUpdateBankCard({
          id: bankCardCopy.id,
          bankCardData: bankCardCopy,
          image: image,
        });
      } else
        createBankCard({
          variables: {
            bankCardData: bankCardCopy,
            image: image,
          },
        });
    },
  });
  const {
    loading: loadingBankAccounts,
    data: bankAccountsData,
    error: bankAccountsError,
    fetchMore: fetchMoreBankAccounts,
  } = useQuery(GET_BANK_ACCOUNTS, {
    fetchPolicy: 'network-only',
  });

  const [createBankCard, { loading: loadingPost }] = useMutation(POST_BANK_CARD, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...bankCardCopy } = data.createBankCard.bankCard;
      //   formik.setValues(bankCardCopy);
      navigate('/online/finance/tresorerie/cartes-bancaires/liste');
    },
    update(cache, { data: { createBankCard } }) {
      const newBankCard = createBankCard.bankCard;

      cache.modify({
        fields: {
          bankCards(existingBankCards = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingBankCards.totalCount + 1,
              nodes: [newBankCard, ...existingBankCards.nodes],
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
  const [updateBankCard, { loading: loadingPut }] = useMutation(PUT_BANK_CARD, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...bankCardCopy } = data.updateBankCard.bankCard;
      //   formik.setValues(bankCardCopy);
      navigate('/online/finance/tresorerie/cartes-bancaires/liste');
    },
    update(cache, { data: { updateBankCard } }) {
      const updatedBankCard = updateBankCard.bankCard;

      cache.modify({
        fields: {
          bankCards(
            existingBankCards = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedBankCards = existingBankCards.nodes.map((bankCard) =>
              readField('id', bankCard) === updatedBankCard.id
                ? updatedBankCard
                : bankCard,
            );

            return {
              totalCount: existingBankCards.totalCount,
              nodes: updatedBankCards,
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
  const onUpdateBankCard = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBankCard({ variables });
      },
    });
  };
  const [getBankCard, { loading: loadingBankCard }] = useLazyQuery(GET_BANK_CARD, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, name, ...bankCardCopy } =  data.bankCard;
      bankCardCopy.expirationDate = bankCardCopy.expirationDate ? dayjs(bankCardCopy.expirationDate) : null;
      formik.setValues(bankCardCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idBankCard) {
      getBankCard({ variables: { id: idBankCard } });
    }
  }, [idBankCard]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <em><u>{formik.values.cardNumber}</u></em>
      </Typography>
      {loadingBankCard && <ProgressService type="form" />}
      {!loadingBankCard && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
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
                  label="Titre"
                  value={formik.values.title}
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheAutocomplete
                  options={bankAccountsData?.bankAccounts?.nodes}
                  label="Compte banciare"
                  placeholder="Choisissez un compte banciare ?"
                  multiple={false}
                  value={formik.values.bankAccount}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('bankAccount', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Nom sur la carte"
                      value={formik.values.cardholderName}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'cardholderName',
                          e.target.value,
                        )
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Numéro de la carte"
                      value={formik.values.cardNumber}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'cardNumber',
                          e.target.value,
                        )
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <Item>
                    <TheDesktopDatePicker
                      label="Date d'expiration"
                      openTo="month"
                      views={['month', 'year']}
                      format="MM/YYYY"
                      value={formik.values.expirationDate}
                      onChange={(date) => formik.setFieldValue('expirationDate', date)}
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="CVV"
                      placeholder="Code de sécurité"
                      value={formik.values.cvv}
                      onChange={(e) =>
                        formik.setFieldValue('cvv', e.target.value)
                      }
                      disabled={loadingPost || loadingPut}
                    />
                  </Item>
                </Grid>
              </Grid>
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
                <Link
                  to="/online/finance/tresorerie/cartes-bancaires/liste"
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
