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
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_ENDOWMENT } from '../../../../_shared/graphql/queries/EndowmentQueries';
import {
  POST_ENDOWMENT,
  PUT_ENDOWMENT,
} from '../../../../_shared/graphql/mutations/EndowmentMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_ALL_ACCOUNTING_NATURES, GET_DATAS_ENDOWMENT } from '../../../../_shared/graphql/queries/DataQueries';
import { GENDERS } from '../../../../_shared/tools/constants';
import TheRecurrenceSelect from '../../../../_shared/components/form-fields/TheRecurrenceSelect';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEndowmentForm({ idEndowment, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    amountAllocated: yup
      .number('Veuillez entrer un montant valide') // Utilisation de `.number` pour valider un champ numérique.
      .typeError('Le montant de dotation doit être un nombre') // Message d'erreur si la valeur n'est pas un nombre.
      .positive('Le montant de dotation doit être supérieur à 0') // Validation pour un montant positif.
      .required('Le montant de dotation est obligatoire'), // Rend le champ obligatoire.
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      label: '',
      endowmentType: null,
      amountAllocated: 0,
      startingDateTime: dayjs(new Date()),
      endingDateTime: null,
      recurrenceRule:'RRULE:FREQ=MONTHLY;WKST=MO',
      establishment: null,
      gender: GENDERS.NOT_SPECIFIED,
      ageMin: 0,
      ageMax: 0,
      professionalStatus: null,
      accountingNature: null,
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let endowmentCopy= {...values};
      endowmentCopy.establishment = endowmentCopy.establishment ? endowmentCopy.establishment.id : null;
      endowmentCopy.accountingNature = endowmentCopy.accountingNature ? endowmentCopy.accountingNature.id : null;
      if (idEndowment && idEndowment != '') {
        onUpdateEndowment({
          id: endowmentCopy.id,
          endowmentData: endowmentCopy,
        });
      } else
        createEndowment({
          variables: {
            endowmentData: endowmentCopy,
          },
        });
    },
  });
  const [createEndowment, { loading: loadingPost }] = useMutation(
    POST_ENDOWMENT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...endowmentCopy } = data.createEndowment.endowment;
        //   formik.setValues(endowmentCopy);
        navigate('/online/finance/dotations/liste');
      },
      update(cache, { data: { createEndowment } }) {
        const newEndowment = createEndowment.endowment;

        cache.modify({
          fields: {
            endowments(existingEndowments = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingEndowments.totalCount + 1,
                nodes: [newEndowment, ...existingEndowments.nodes],
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
  const [updateEndowment, { loading: loadingPut }] = useMutation(PUT_ENDOWMENT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...endowmentCopy } = data.updateEndowment.endowment;
      //   formik.setValues(endowmentCopy);
      navigate('/online/finance/dotations/liste');
    },
    update(cache, { data: { updateEndowment } }) {
      const updatedEndowment = updateEndowment.endowment;

      cache.modify({
        fields: {
          endowments(
            existingEndowments = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedEndowments = existingEndowments.nodes.map((endowment) =>
              readField('id', endowment) === updatedEndowment.id
                ? updatedEndowment
                : endowment,
            );

            return {
              totalCount: existingEndowments.totalCount,
              nodes: updatedEndowments,
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
  const onUpdateEndowment = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEndowment({ variables });
      },
    });
  };
  const [getEndowment, { loading: loadingEndowment }] = useLazyQuery(
    GET_ENDOWMENT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, ...endowmentCopy } = data.endowment;
        endowmentCopy.startingDateTime = endowmentCopy.startingDateTime ? dayjs(endowmentCopy.startingDateTime) : null;
        endowmentCopy.endingDateTime = endowmentCopy.endingDateTime ? dayjs(endowmentCopy.endingDateTime) : null;
        endowmentCopy.endowmentType = endowmentCopy.endowmentType ? Number(endowmentCopy.endowmentType.id): null;
        endowmentCopy.professionalStatus = endowmentCopy.professionalStatus ? Number(endowmentCopy.professionalStatus.id): null;
        formik.setValues(endowmentCopy);
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
  });

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_ENDOWMENT, { fetchPolicy: 'network-only' });
    
  const [getAccountingNatures, {
    loading: loadingAccountingNatures,
    data: accountingNaturesData,
    error: accountingNaturesError,
    fetchMore: fetchMoreAccountingNatures,
  }] = useLazyQuery(GET_ALL_ACCOUNTING_NATURES, { variables: { accountingNatureFilter : {listType: 'ALL'}, page: 1, limit: 20 } });
  
  const onGetAccountingNatures = (keyword)=>{
    getAccountingNatures({ variables: { accountingNatureFilter : keyword === '' ? {listType: 'ALL'} : {listType: 'ALL', keyword}, page: 1, limit: 20 } })
  }
      
  

  React.useEffect(() => {
    if (idEndowment) {
      getEndowment({ variables: { id: idEndowment } });
    }
  }, [idEndowment]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.label}</em></u>
      </Typography>
      {loadingEndowment && <ProgressService type="form" />}
      {!loadingEndowment && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  id="label"
                  value={formik.values.label}
                  onChange={(e) => formik.setFieldValue('label', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="endowmentType"
                    label="Type"
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
            <Grid item xs={12} sm={6} md={2.5} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de début"
                  value={formik.values.startingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('startingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de fin"
                  value={formik.values.endingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('endingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  id="amountAllocated"
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
                  onBlur={formik.handleBlur}
                  error={formik.touched.amountAllocated && Boolean(formik.errors.amountAllocated)} // Gestion des erreurs
                  helperText={formik.touched.amountAllocated && formik.errors.amountAllocated} // Affiche le message d'erreur
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4.5} >
              <Item>
                <TheAutocomplete
                  options={accountingNaturesData?.accountingNatures?.nodes}
                  onInput={(e) => {
                          onGetAccountingNatures(e.target.value)
                        }}
                  onFocus={(e) => {
                    onGetAccountingNatures(e.target.value)
                  }}
                  label="Nature"
                  placeholder="Nature"
                  multiple={false}
                  value={formik.values.accountingNature}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('accountingNature', newValue)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Item>
                    <TheRecurrenceSelect
                        label="Répéter"
                        value={formik.values.recurrenceRule}
                        onChange={(rrule) => formik.setFieldValue('recurrenceRule', rrule)}
                        disabled={loadingPost || loadingPut}
                    />
                </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Genre
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="gender"
                    label="Genre"
                    value={formik.values.gender}
                    onChange={(e) =>
                      formik.setFieldValue('gender', e.target.value)
                    }
                  >
                    {GENDERS?.ALL?.map(
                      (type, index) => {
                        return (
                          <MenuItem key={index} value={type.value}>
                            {type.label}
                          </MenuItem>
                        );
                      },
                    )}
                  </Select>
                </FormControl>
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
            <Grid item xs={12} sm={4} md={1.5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Age min"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">ans</InputAdornment>
                    ),
                  }}
                  value={formik.values.ageMin}
                  onChange={(e) =>
                    formik.setFieldValue('ageMin', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={1.5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Age max"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">ans</InputAdornment>
                    ),
                  }}
                  value={formik.values.ageMax}
                  onChange={(e) =>
                    formik.setFieldValue('ageMax', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Détail"
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
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/finance/dotations/liste" className="no_style">
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
