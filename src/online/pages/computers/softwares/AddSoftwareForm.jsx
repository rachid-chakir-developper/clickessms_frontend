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
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_SOFTWARE } from '../../../../_shared/graphql/queries/SoftwareQueries';
import {
  POST_SOFTWARE,
  PUT_SOFTWARE,
} from '../../../../_shared/graphql/mutations/SoftwareMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddSoftwareForm({ idSoftware, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom du logiciel')
      .required('Le nom du logiciel est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      barCode: '',
      isBlocked: false,
      isStockAuto: true,
      designation: '',
      buyingPriceHt: 0,
      tva: 0,
      quantity: 0,
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...softwareCopy } = values;
      if (idSoftware && idSoftware != '') {
        onUpdateSoftware({
          id: softwareCopy.id,
          softwareData: softwareCopy,
          image: image,
        });
      } else
        createSoftware({
          variables: {
            softwareData: softwareCopy,
            image: image,
          },
        });
    },
  });
  const [createSoftware, { loading: loadingPost }] = useMutation(
    POST_SOFTWARE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...softwareCopy } = data.createSoftware.software;
        //   formik.setValues(softwareCopy);
        navigate('/online/informatique/logiciels/liste');
      },
      update(cache, { data: { createSoftware } }) {
        const newSoftware = createSoftware.software;

        cache.modify({
          fields: {
            softwares(existingSoftwares = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingSoftwares.totalCount + 1,
                nodes: [newSoftware, ...existingSoftwares.nodes],
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
  const [updateSoftware, { loading: loadingPut }] = useMutation(PUT_SOFTWARE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...softwareCopy } = data.updateSoftware.software;
      //   formik.setValues(softwareCopy);
      navigate('/online/informatique/logiciels/liste');
    },
    update(cache, { data: { updateSoftware } }) {
      const updatedSoftware = updateSoftware.software;

      cache.modify({
        fields: {
          softwares(
            existingSoftwares = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedSoftwares = existingSoftwares.nodes.map((software) =>
              readField('id', software) === updatedSoftware.id
                ? updatedSoftware
                : software,
            );

            return {
              totalCount: existingSoftwares.totalCount,
              nodes: updatedSoftwares,
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
  const onUpdateSoftware = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSoftware({ variables });
      },
    });
  };
  const [getSoftware, { loading: loadingSoftware }] = useLazyQuery(
    GET_SOFTWARE,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...softwareCopy1 } = data.software;
        let { folder, ...softwareCopy } = softwareCopy1;
        formik.setValues(softwareCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idSoftware) {
      getSoftware({ variables: { id: idSoftware } });
    }
  }, [idSoftware]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.name}</em></u>
      </Typography>
      {loadingSoftware && <ProgressService type="form" />}
      {!loadingSoftware && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
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
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  id="name"
                  value={formik.values.name}
                  required
                  onChange={(e) => formik.setFieldValue('name', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Quantité"
                  value={formik.values.quantity}
                  type="number"
                  onChange={(e) =>
                    formik.setFieldValue('quantity', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Prix d'achat HT d'unité"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={formik.values.buyingPriceHt}
                  onChange={(e) =>
                    formik.setFieldValue('buyingPriceHt', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Tva %"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                  value={formik.values.tva}
                  onChange={(e) => formik.setFieldValue('tva', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={2} sm={3} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Code barre"
                  value={formik.values.barCode}
                  onChange={(e) =>
                    formik.setFieldValue('barCode', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={5} md={5}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Désignation"
                  value={formik.values.designation}
                  onChange={(e) =>
                    formik.setFieldValue('designation', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={2} md={2}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Bloqué"
                  checked={formik.values.isBlocked}
                  value={formik.values.isBlocked}
                  onChange={(e) =>
                    formik.setFieldValue('isBlocked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={2} sm={2} md={2}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Stock auto"
                  checked={formik.values.isStockAuto}
                  value={formik.values.isStockAuto}
                  onChange={(e) =>
                    formik.setFieldValue('isStockAuto', e.target.checked)
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
                <Link to="/online/informatique/logiciels/liste" className="no_style">
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
