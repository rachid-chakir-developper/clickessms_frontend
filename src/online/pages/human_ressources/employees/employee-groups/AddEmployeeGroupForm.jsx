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
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../../_shared/components/form-fields/ImageFileField';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_EMPLOYEE_GROUP } from '../../../../../_shared/graphql/queries/EmployeeGroupQueries';
import {
  POST_EMPLOYEE_GROUP,
  PUT_EMPLOYEE_GROUP,
} from '../../../../../_shared/graphql/mutations/EmployeeGroupMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../../_shared/components/form-fields/theSwitch';
import TheDateTimePicker from '../../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_EMPLOYEES } from '../../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEmployeeGroupForm({ idEmployeeGroup, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string("Entrez le nom d'événement")
      .required("Le nom d'événement est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      description: '',
      observation: '',
      isActive: true,
      employees: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...employeeGroupCopy } = values;
      employeeGroupCopy.employees = employeeGroupCopy.employees.map(
        (i) => i?.id,
      );
      if (idEmployeeGroup && idEmployeeGroup != '') {
        onUpdateEmployeeGroup({
          id: employeeGroupCopy.id,
          employeeGroupData: employeeGroupCopy,
          image: image,
        });
      } else
        createEmployeeGroup({
          variables: {
            employeeGroupData: employeeGroupCopy,
            image: image,
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

  const [createEmployeeGroup, { loading: loadingPost }] = useMutation(
    POST_EMPLOYEE_GROUP,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...employeeGroupCopy } =
          data.createEmployeeGroup.employeeGroup;
        //   formik.setValues(employeeGroupCopy);
        navigate('/online/ressources-humaines/employes/groupes/liste');
      },
      update(cache, { data: { createEmployeeGroup } }) {
        const newEmployeeGroup = createEmployeeGroup.employeeGroup;

        cache.modify({
          fields: {
            employeeGroups(
              existingEmployeeGroups = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingEmployeeGroups.totalCount + 1,
                nodes: [newEmployeeGroup, ...existingEmployeeGroups.nodes],
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
  const [updateEmployeeGroup, { loading: loadingPut }] = useMutation(
    PUT_EMPLOYEE_GROUP,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...employeeGroupCopy } =
          data.updateEmployeeGroup.employeeGroup;
        //   formik.setValues(employeeGroupCopy);
        navigate('/online/ressources-humaines/employes/groupes/liste');
      },
      update(cache, { data: { updateEmployeeGroup } }) {
        const updatedEmployeeGroup = updateEmployeeGroup.employeeGroup;

        cache.modify({
          fields: {
            employeeGroups(
              existingEmployeeGroups = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEmployeeGroups = existingEmployeeGroups.nodes.map(
                (employeeGroup) =>
                  readField('id', employeeGroup) === updatedEmployeeGroup.id
                    ? updatedEmployeeGroup
                    : employeeGroup,
              );

              return {
                totalCount: existingEmployeeGroups.totalCount,
                nodes: updatedEmployeeGroups,
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
  const onUpdateEmployeeGroup = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEmployeeGroup({ variables });
      },
    });
  };
  const [getEmployeeGroup, { loading: loadingEmployeeGroup }] = useLazyQuery(
    GET_EMPLOYEE_GROUP,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...employeeGroupCopy } = data.employeeGroup;
        employeeGroupCopy.employees = employeeGroupCopy.employees
          ? employeeGroupCopy.employees.map((i) => i?.employee)
          : [];
        formik.setValues(employeeGroupCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idEmployeeGroup) {
      getEmployeeGroup({ variables: { id: idEmployeeGroup } });
    }
  }, [idEmployeeGroup]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingEmployeeGroup && <ProgressService type="form" />}
      {!loadingEmployeeGroup && (
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
            <Grid xs={12} sm={12} md={12} item>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
                  label="Employés"
                  placeholder="Ajouter un employé"
                  limitTags={3}
                  value={formik.values.employees}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employees', newValue)
                  }
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
                  to="/online/ressources-humaines/employes/groupes/liste"
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
