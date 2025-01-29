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
import { GET_SPACE_ROOM } from '../../../../_shared/graphql/queries/SpaceRoomQueries';
import {
  POST_SPACE_ROOM,
  PUT_SPACE_ROOM,
} from '../../../../_shared/graphql/mutations/SpaceRoomMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import { ROOM_TYPE_CHOICES } from '../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddSpaceRoomForm({ idSpaceRoom, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom du salle')
      .required('Le nom du salle est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      roomType: ROOM_TYPE_CHOICES.MEETING,
      capacity: null,
      establishment: null,
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...spaceRoomCopy } = values;
      spaceRoomCopy.establishment = spaceRoomCopy.establishment ? spaceRoomCopy.establishment.id : null;
      if (idSpaceRoom && idSpaceRoom != '') {
        onUpdateSpaceRoom({
          id: spaceRoomCopy.id,
          spaceRoomData: spaceRoomCopy,
          image: image,
        });
      } else
        createSpaceRoom({
          variables: {
            spaceRoomData: spaceRoomCopy,
            image: image,
          },
        });
    },
  });
  const [createSpaceRoom, { loading: loadingPost }] = useMutation(
    POST_SPACE_ROOM,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...spaceRoomCopy } = data.createSpaceRoom.spaceRoom;
        //   formik.setValues(spaceRoomCopy);
        navigate('/online/batiment-immobilier/salles/liste');
      },
      update(cache, { data: { createSpaceRoom } }) {
        const newSpaceRoom = createSpaceRoom.spaceRoom;

        cache.modify({
          fields: {
            spaceRooms(existingSpaceRooms = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingSpaceRooms.totalCount + 1,
                nodes: [newSpaceRoom, ...existingSpaceRooms.nodes],
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
  const [updateSpaceRoom, { loading: loadingPut }] = useMutation(PUT_SPACE_ROOM, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...spaceRoomCopy } = data.updateSpaceRoom.spaceRoom;
      //   formik.setValues(spaceRoomCopy);
      navigate('/online/batiment-immobilier/salles/liste');
    },
    update(cache, { data: { updateSpaceRoom } }) {
      const updatedSpaceRoom = updateSpaceRoom.spaceRoom;

      cache.modify({
        fields: {
          spaceRooms(
            existingSpaceRooms = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedSpaceRooms = existingSpaceRooms.nodes.map((spaceRoom) =>
              readField('id', spaceRoom) === updatedSpaceRoom.id
                ? updatedSpaceRoom
                : spaceRoom,
            );

            return {
              totalCount: existingSpaceRooms.totalCount,
              nodes: updatedSpaceRooms,
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
  const onUpdateSpaceRoom = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSpaceRoom({ variables });
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
  const [getSpaceRoom, { loading: loadingSpaceRoom }] = useLazyQuery(
    GET_SPACE_ROOM,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...spaceRoomCopy1 } = data.spaceRoom;
        let { folder, ...spaceRoomCopy } = spaceRoomCopy1;
        formik.setValues(spaceRoomCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idSpaceRoom) {
      getSpaceRoom({ variables: { id: idSpaceRoom } });
    }
  }, [idSpaceRoom]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.name}</em></u>
      </Typography>
      {loadingSpaceRoom && <ProgressService type="form" />}
      {!loadingSpaceRoom && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Capacité"
                  value={formik.values.capacity}
                  type="number"
                  onChange={(e) =>
                    formik.setFieldValue('capacity', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                <Link to="/online/batiment-immobilier/salles/liste" className="no_style">
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
