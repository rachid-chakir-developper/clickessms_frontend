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
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  GET_ESTABLISHMENT_SERVICE,
  GET_ESTABLISHMENT_SERVICES,
} from '../../../../_shared/graphql/queries/EstablishmentServiceQueries';
import {
  POST_ESTABLISHMENT_SERVICE,
  PUT_ESTABLISHMENT_SERVICE,
} from '../../../../_shared/graphql/mutations/EstablishmentServiceMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEstablishmentServiceForm({
  idEstablishmentService,
  title,
}) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      siret: '',
      isActive: true,
      description: '',
      observation: '',
      establishmentServiceType: 'PRIMARY',
      establishment: null,
      establishmentServiceParent: null,
      establishmentServiceChilds: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...establishmentServiceFormCopy } = values;
      let { coverImage, ...establishmentServiceCopy } =
        establishmentServiceFormCopy;
      establishmentServiceCopy.establishmentServiceParent =
        establishmentServiceCopy.establishmentServiceParent
          ? establishmentServiceCopy.establishmentServiceParent.id
          : null;
      establishmentServiceCopy.establishmentServiceChilds =
        establishmentServiceCopy.establishmentServiceChilds.map((i) => i.id);
      establishmentServiceCopy.establishment =
        establishmentServiceCopy.establishment
          ? establishmentServiceCopy.establishment.id
          : null;
      if (idEstablishmentService && idEstablishmentService != '') {
        onUpdateEstablishmentService({
          id: establishmentServiceCopy.id,
          establishmentServiceData: establishmentServiceCopy,
          image: image,
          coverImage: coverImage,
        });
      } else
        createEstablishmentService({
          variables: {
            establishmentServiceData: establishmentServiceCopy,
            image: image,
            coverImage: coverImage,
          },
        });
    },
  });
  const [createEstablishmentService, { loading: loadingPost }] = useMutation(
    POST_ESTABLISHMENT_SERVICE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...establishmentServiceCopy } =
          data.createEstablishmentService.establishmentService;
        //   formik.setValues(establishmentServiceCopy);
        navigate('/online/associations/services/liste');
      },
      update(cache, { data: { createEstablishmentService } }) {
        const newEstablishmentService =
          createEstablishmentService.establishmentService;

        cache.modify({
          fields: {
            establishmentServices(
              existingEstablishmentServices = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingEstablishmentServices.totalCount + 1,
                nodes: [
                  newEstablishmentService,
                  ...existingEstablishmentServices.nodes,
                ],
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
  const [updateEstablishmentService, { loading: loadingPut }] = useMutation(
    PUT_ESTABLISHMENT_SERVICE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...establishmentServiceCopy } =
          data.updateEstablishmentService.establishmentService;
        //   formik.setValues(establishmentServiceCopy);
        navigate('/online/associations/services/liste');
      },
      update(cache, { data: { updateEstablishmentService } }) {
        const updatedEstablishmentService =
          updateEstablishmentService.establishmentService;

        cache.modify({
          fields: {
            establishmentServices(
              existingEstablishmentServices = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEstablishmentServices =
                existingEstablishmentServices.nodes.map(
                  (establishmentService) =>
                    readField('id', establishmentService) ===
                    updatedEstablishmentService.id
                      ? updatedEstablishmentService
                      : establishmentService,
                );

              return {
                totalCount: existingEstablishmentServices.totalCount,
                nodes: updatedEstablishmentServices,
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
  const onUpdateEstablishmentService = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEstablishmentService({ variables });
      },
    });
  };
  const [getEstablishmentService, { loading: loadingEstablishmentService }] =
    useLazyQuery(GET_ESTABLISHMENT_SERVICE, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...establishmentServiceCopy1 } =
          data.establishmentService;
        let { folder, ...establishmentServiceCopy } = establishmentServiceCopy1;
        formik.setValues(establishmentServiceCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idEstablishmentService) {
      getEstablishmentService({ variables: { id: idEstablishmentService } });
    }
  }, [idEstablishmentService]);

  const {
    loading: loadingEstablishmentServices,
    data: establishmentServicesData,
    error: establishmentServicesError,
    fetchMore: fetchMoreEstablishmentServices,
  } = useQuery(GET_ESTABLISHMENT_SERVICES, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingEstablishmentService && <ProgressService type="form" />}
      {!loadingEstablishmentService && (
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
                <TheTextField
                  variant="outlined"
                  label="Raison sociale"
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
                  label="SIRET"
                  value={formik.values.siret}
                  onChange={(e) =>
                    formik.setFieldValue('siret', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
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
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Etablissement"
                  placeholder="Choisissez un établissement"
                  multiple={false}
                  value={formik.values.establishment}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishment', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Type d'service</InputLabel>
                  <Select
                    value={formik.values.establishmentServiceType}
                    onChange={(e) =>
                      formik.setFieldValue(
                        'establishmentServiceType',
                        e.target.value,
                      )
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value="PRIMARY">Primaire</MenuItem>
                    <MenuItem value="SECONDARY">Sécondaire</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              {/* <Item>
                                <ImageFileField variant="outlined" label="Logo de couverture"
                                    imageValue={formik.values.coverImage}
                                    onChange={(imageFile) => formik.setFieldValue('coverImage', imageFile)}
                                    disabled={loadingPost || loadingPut}
                                    />
                            </Item> */}
              {formik.values.establishmentServiceType === 'SECONDARY' && (
                <Item>
                  <TheAutocomplete
                    options={establishmentServicesData?.establishmentServices?.nodes?.filter(
                      (e) => e?.id != idEstablishmentService,
                    )}
                    label="Service parent"
                    placeholder="Choisissez un service"
                    multiple={false}
                    value={formik.values.establishmentServiceParent}
                    onChange={(e, newValue) =>
                      formik.setFieldValue(
                        'establishmentServiceParent',
                        newValue,
                      )
                    }
                  />
                </Item>
              )}
              {formik.values.establishmentServiceType === 'PRIMARY' && (
                <Item>
                  <TheAutocomplete
                    options={establishmentServicesData?.establishmentServices?.nodes?.filter(
                      (e) => e?.id != idEstablishmentService,
                    )}
                    label="Services fils"
                    placeholder="Choisissez des services"
                    limitTags={3}
                    value={formik.values.establishmentServiceChilds}
                    onChange={(e, newValue) =>
                      formik.setFieldValue(
                        'establishmentServiceChilds',
                        newValue,
                      )
                    }
                  />
                </Item>
              )}
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
                  to="/online/associations/services/liste"
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
