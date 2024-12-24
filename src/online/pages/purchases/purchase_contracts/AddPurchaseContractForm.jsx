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
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_PURCHASE_CONTRACT } from '../../../../_shared/graphql/queries/PurchaseContractQueries';
import {
  POST_PURCHASE_CONTRACT,
  PUT_PURCHASE_CONTRACT,
} from '../../../../_shared/graphql/mutations/PurchaseContractMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { GET_SUPPLIERS } from '../../../../_shared/graphql/queries/SupplierQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddPurchaseContractForm({ idPurchaseContract, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    title: yup
      .string('Entrez le nom du contrat')
      .required('Le nom du contrat est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      document: undefined,
      number: '',
      title: '',
      supplier: null,
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...purchaseContractCopy } = values;
      purchaseContractCopy.supplier = purchaseContractCopy.supplier ? purchaseContractCopy.supplier.id : null;
      if (idPurchaseContract && idPurchaseContract != '') {
        onUpdatePurchaseContract({
          id: purchaseContractCopy.id,
          purchaseContractData: purchaseContractCopy,
          document: document,
        });
      } else
        createPurchaseContract({
          variables: {
            purchaseContractData: purchaseContractCopy,
            document: document,
          },
        });
    },
  });
  const [createPurchaseContract, { loading: loadingPost }] = useMutation(
    POST_PURCHASE_CONTRACT,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...purchaseContractCopy } = data.createPurchaseContract.purchaseContract;
        //   formik.setValues(purchaseContractCopy);
        navigate('/online/achats/base-contrats/liste');
      },
      update(cache, { data: { createPurchaseContract } }) {
        const newPurchaseContract = createPurchaseContract.purchaseContract;

        cache.modify({
          fields: {
            purchaseContracts(existingPurchaseContracts = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingPurchaseContracts.totalCount + 1,
                nodes: [newPurchaseContract, ...existingPurchaseContracts.nodes],
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
  const [updatePurchaseContract, { loading: loadingPut }] = useMutation(PUT_PURCHASE_CONTRACT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...purchaseContractCopy } = data.updatePurchaseContract.purchaseContract;
      //   formik.setValues(purchaseContractCopy);
      navigate('/online/achats/base-contrats/liste');
    },
    update(cache, { data: { updatePurchaseContract } }) {
      const updatedPurchaseContract = updatePurchaseContract.purchaseContract;

      cache.modify({
        fields: {
          purchaseContracts(
            existingPurchaseContracts = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedPurchaseContracts = existingPurchaseContracts.nodes.map((purchaseContract) =>
              readField('id', purchaseContract) === updatedPurchaseContract.id
                ? updatedPurchaseContract
                : purchaseContract,
            );

            return {
              totalCount: existingPurchaseContracts.totalCount,
              nodes: updatedPurchaseContracts,
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
  const onUpdatePurchaseContract = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePurchaseContract({ variables });
      },
    });
  };
  const {
      loading: loadingSuppliers,
      data: suppliersData,
      error: suppliersError,
      fetchMore: fetchMoreSuppliers,
    } = useQuery(GET_SUPPLIERS, {
      fetchPolicy: 'network-only',
    });
  const [getPurchaseContract, { loading: loadingPurchaseContract }] = useLazyQuery(
    GET_PURCHASE_CONTRACT,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...purchaseContractCopy1 } = data.purchaseContract;
        let { folder, ...purchaseContractCopy } = purchaseContractCopy1;
        formik.setValues(purchaseContractCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idPurchaseContract) {
      getPurchaseContract({ variables: { id: idPurchaseContract } });
    }
  }, [idPurchaseContract]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.name}</em></u>
      </Typography>
      {loadingPurchaseContract && <ProgressService type="form" />}
      {!loadingPurchaseContract && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheFileField variant="outlined" label="Document"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                  />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Titre"
                  id="title"
                  value={formik.values.title}
                  required
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheAutocomplete
                  options={suppliersData?.suppliers?.nodes}
                  label="Fournissuer"
                  placeholder="Choisissez un Fournissuer"
                  multiple={false}
                  value={formik.values.supplier}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('supplier', newValue)
                  }
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
                <Link to="/online/achats/base-contrats/liste" className="no_style">
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
