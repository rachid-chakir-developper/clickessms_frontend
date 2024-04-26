import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
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
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_PARTNER } from '../../../../_shared/graphql/queries/PartnerQueries';
import {
  POST_PARTNER,
  PUT_PARTNER,
} from '../../../../_shared/graphql/mutations/PartnerMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddPartnerForm({ idPartner, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      photo: undefined,
      coverImage: undefined,
      number: '',
      name: '',
      managerName: '',
      city: '',
      zipCode: '',
      address: '',
      mobile: '',
      fix: '',
      fax: '',
      email: '',
      webSite: '',
      otherContacts: '',
      iban: '',
      bic: '',
      bankName: '',
      isActive: true,
      description: '',
      observation: '',
      partnerType: 'INDIVIDUAL',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { photo, ...partnerFormCopy } = values;
      let { coverImage, ...partnerCopy } = partnerFormCopy;
      if (idPartner && idPartner != '') {
        onUpdatePartner({
          id: partnerCopy.id,
          partnerData: partnerCopy,
          photo: photo,
          coverImage: coverImage,
        });
      } else
        createPartner({
          variables: {
            partnerData: partnerCopy,
            photo: photo,
            coverImage: coverImage,
          },
        });
    },
  });
  const [createPartner, { loading: loadingPost }] = useMutation(POST_PARTNER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...partnerCopy } = data.createPartner.partner;
      //   formik.setValues(partnerCopy);
      navigate('/online/partenariats/partenaires/liste');
    },
    update(cache, { data: { createPartner } }) {
      const newPartner = createPartner.partner;

      cache.modify({
        fields: {
          partners(existingPartners = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingPartners.totalCount + 1,
              nodes: [newPartner, ...existingPartners.nodes],
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
  const [updatePartner, { loading: loadingPut }] = useMutation(PUT_PARTNER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...partnerCopy } = data.updatePartner.partner;
      //   formik.setValues(partnerCopy);
      navigate('/online/partenariats/partenaires/liste');
    },
    update(cache, { data: { updatePartner } }) {
      const updatedPartner = updatePartner.partner;

      cache.modify({
        fields: {
          partners(
            existingPartners = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedPartners = existingPartners.nodes.map((partner) =>
              readField('id', partner) === updatedPartner.id
                ? updatedPartner
                : partner,
            );

            return {
              totalCount: existingPartners.totalCount,
              nodes: updatedPartners,
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
  const onUpdatePartner = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePartner({ variables });
      },
    });
  };
  const [getPartner, { loading: loadingPartner }] = useLazyQuery(GET_PARTNER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...partnerCopy1 } = data.partner;
      let { folder, ...partnerCopy } = partnerCopy1;
      formik.setValues(partnerCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idPartner) {
      getPartner({ variables: { id: idPartner } });
    }
  }, [idPartner]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingPartner && <ProgressService type="form" />}
      {!loadingPartner && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Référence"
                  value={formik.values.number}
                  disabled
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Photo de couverture"
                  imageValue={formik.values.coverImage}
                  onChange={(imageFile) =>
                    formik.setFieldValue('coverImage', imageFile)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Type de partenaire</InputLabel>
                  <Select
                    value={formik.values.partnerType}
                    onChange={(e) =>
                      formik.setFieldValue('partnerType', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value="BUSINESS">Entreprise</MenuItem>
                    <MenuItem value="INDIVIDUAL">Particulier</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom de responsable"
                  value={formik.values.managerName}
                  onChange={(e) =>
                    formik.setFieldValue('managerName', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Adresse"
                  multiline
                  rows={8}
                  value={formik.values.address}
                  onChange={(e) =>
                    formik.setFieldValue('address', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Mobile"
                  value={formik.values.mobile}
                  onChange={(e) =>
                    formik.setFieldValue('mobile', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Fixe"
                  value={formik.values.fix}
                  onChange={(e) => formik.setFieldValue('fix', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Fax"
                  value={formik.values.fax}
                  onChange={(e) => formik.setFieldValue('fax', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="E-mail"
                  value={formik.values.email}
                  onChange={(e) =>
                    formik.setFieldValue('email', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Site web"
                  value={formik.values.webSite}
                  onChange={(e) =>
                    formik.setFieldValue('webSite', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Autres contacts"
                  value={formik.values.otherContacts}
                  onChange={(e) =>
                    formik.setFieldValue('otherContacts', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="IBAN (RIB)"
                  value={formik.values.iban}
                  onChange={(e) => formik.setFieldValue('iban', e.target.value)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
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
            <Grid xs={12} sm={6} md={6}>
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
            <Grid xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/partenariats/partenaires/liste"
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
