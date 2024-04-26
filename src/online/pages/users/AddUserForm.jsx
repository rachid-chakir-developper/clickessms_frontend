import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Divider } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  GET_GROUPS,
  GET_PERMISSIONS,
  GET_USER,
} from '../../../_shared/graphql/queries/UserQueries';
import {
  POST_USER,
  PUT_USER,
} from '../../../_shared/graphql/mutations/UserMutations';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import TransferList from '../../../_shared/components/helpers/TransferList';
import { GET_EMPLOYEES } from '../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddUserForm({ idUser, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    username: yup
      .string('Entrez votre username')
      .required(`L'username est obligatoire`),
    lastName: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
    lastName: yup.string('Entrez votre nom').required('Le nom est obligatoire'),
    email: yup
      .string('Entrez votre email')
      .email('Entrez un email valide')
      .required(`L'email est obligatoire`),
  });
  const formik = useFormik({
    initialValues: {
      photo: undefined,
      coverImage: undefined,
      firstName: '',
      lastName: '',
      employee: null,
      email: '',
      username: '',
      description: '',
      observation: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { photo, ...userFormCopy } = values;
      let { coverImage, ...userCopy } = userFormCopy;
      userCopy.employee = userCopy.employee?.id;
      if (idUser && idUser != '') {
        onUpdateUser({
          id: userCopy.id,
          userData: userCopy,
          photo: photo,
          coverImage: coverImage,
          userGroups: userGroups.map((g) => g.id),
          userPermissions: userPermissions.map((p) => p.id),
        });
      } else
        createUser({
          variables: {
            userData: userCopy,
            photo: photo,
            coverImage: coverImage,
            userGroups: userGroups.map((g) => g.id),
            userPermissions: userPermissions.map((p) => p.id),
          },
        });
    },
  });

  const {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 10 },
  });

  const [createUser, { loading: loadingPost }] = useMutation(POST_USER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...userCopy } = data.createUser.user;
      //   formik.setValues(userCopy);
      navigate('/online/utilisateurs/liste');
    },
    update(cache, { data: { createUser } }) {
      const newUser = createUser.user;

      cache.modify({
        fields: {
          users(existingUsers = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingUsers.totalCount + 1,
              nodes: [newUser, ...existingUsers.nodes],
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
  const [updateUser, { loading: loadingPut }] = useMutation(PUT_USER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...userCopy } = data.updateUser.user;
      //   formik.setValues(userCopy);
      navigate('/online/utilisateurs/liste');
    },
    update(cache, { data: { updateUser } }) {
      const updatedUser = updateUser.user;

      cache.modify({
        fields: {
          users(existingUsers = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedUsers = existingUsers.nodes.map((user) =>
              readField('id', user) === updatedUser.id ? updatedUser : user,
            );

            return {
              totalCount: existingUsers.totalCount,
              nodes: updatedUsers,
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
  const onUpdateUser = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateUser({ variables });
      },
    });
  };
  const [getUser, { loading: loadingUser }] = useLazyQuery(GET_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...userCopy1 } = data.user;
      let { currentLatitude, ...userCopy11 } = userCopy1;
      let { currentLongitude, ...userCopy } = userCopy11;
      setUserGroups(userCopy.groups);
      let { groups, ...userCopy2 } = userCopy;
      setUserPermissions(userCopy2.userPermissions);
      let { userPermissions, ...userCopy3 } = userCopy2;
      formik.setValues(userCopy3);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idUser) {
      getUser({ variables: { id: idUser } });
    }
  }, [idUser]);

  const [userGroups, setUserGroups] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const { loadingGroups } = useQuery(GET_GROUPS, {
    onCompleted: (data) => setGroups(data.groups),
    onError: (err) => console.log(err),
  });
  const [userPermissions, setUserPermissions] = React.useState([]);
  const [permissions, setPermissions] = React.useState([]);
  const { loadingPermissions } = useQuery(GET_PERMISSIONS, {
    onCompleted: (data) => setPermissions(data.permissions),
    onError: (err) => console.log(err),
  });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingUser && <ProgressService type="form" />}
      {!loadingUser && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
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
                <TheTextField
                  variant="outlined"
                  label="Prénom"
                  id="firstName"
                  value={formik.values.firstName}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('firstName', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nom"
                  id="lastName"
                  value={formik.values.lastName}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('lastName', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
                  label="Employé"
                  placeholder="Choisissez un employé"
                  limitTags={2}
                  multiple={false}
                  value={formik.values.employee}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('employee', newValue);
                  }}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="username"
                  id="username"
                  value={formik.values.username}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('username', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="E-mail"
                  id="email"
                  value={formik.values.email}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('email', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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
              <Divider variant="middle" />
            </Grid>
            <Grid xs={12} sm={12} md={6}>
              <TransferList
                left={permissions}
                setLeft={setPermissions}
                right={userPermissions}
                setRight={setUserPermissions}
                title="Permissions"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6}>
              <TransferList
                left={groups}
                setLeft={setGroups}
                right={userGroups}
                setRight={setUserGroups}
                title="Groups"
              />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/utilisateurs/liste" className="no_style">
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
