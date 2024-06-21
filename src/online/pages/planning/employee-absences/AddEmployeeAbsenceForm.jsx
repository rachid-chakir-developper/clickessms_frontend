import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_EMPLOYEE_ABSENCE } from '../../../../_shared/graphql/queries/EmployeeAbsenceQueries';
import {
  POST_EMPLOYEE_ABSENCE,
  PUT_EMPLOYEE_ABSENCE,
} from '../../../../_shared/graphql/mutations/EmployeeAbsenceMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_DATAS_EMPLOYEE_ABSENCE } from '../../../../_shared/graphql/queries/DataQueries';
import { ABSENCE_TYPES, LEAVE_TYPE_CHOICES } from '../../../../_shared/tools/constants';
import { useSession } from '../../../../_shared/context/SessionProvider';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEmployeeAbsenceForm({
  idEmployeeAbsence,
  title,
}) {
  const { user } = useSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLeaveType, setIsLeaveType] = React.useState(false);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      absenceType: ABSENCE_TYPES.ABSENCE,
      leaveType: LEAVE_TYPE_CHOICES.ABSENCE,
      startingDateTime: dayjs(new Date()),
      endingDateTime: dayjs(new Date()),
      comment: '',
      observation: '',
      employees: [],
      employee: null,
      reasons: [],
      otherReasons: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let employeeAbsenceCopy = { ...values };
      employeeAbsenceCopy.employees =
        employeeAbsenceCopy.employees.map((i) => i?.id);
      employeeAbsenceCopy.reasons = employeeAbsenceCopy.reasons.map(
        (i) => i?.id,
      );
      employeeAbsenceCopy.employee = employeeAbsenceCopy.employee
        ? employeeAbsenceCopy.employee.id
        : null;
      if (idEmployeeAbsence && idEmployeeAbsence != '') {
        onUpdateEmployeeAbsence({
          id: employeeAbsenceCopy.id,
          employeeAbsenceData: employeeAbsenceCopy,
        });
      } else
        createEmployeeAbsence({
          variables: {
            employeeAbsenceData: employeeAbsenceCopy,
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
  });

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_EMPLOYEE_ABSENCE, { fetchPolicy: 'network-only' });

  const [createEmployeeAbsence, { loading: loadingPost }] = useMutation(
    POST_EMPLOYEE_ABSENCE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...employeeAbsenceCopy } =
          data.createEmployeeAbsence.employeeAbsence;
        //   formik.setValues(employeeAbsenceCopy);
        navigate('/online/planning/absences-employes/liste');
      },
      update(cache, { data: { createEmployeeAbsence } }) {
        const newEmployeeAbsence =
          createEmployeeAbsence.employeeAbsence;

        cache.modify({
          fields: {
            employeeAbsences(
              existingEmployeeAbsences = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingEmployeeAbsences.totalCount + 1,
                nodes: [
                  newEmployeeAbsence,
                  ...existingEmployeeAbsences.nodes,
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
  const [updateEmployeeAbsence, { loading: loadingPut }] = useMutation(
    PUT_EMPLOYEE_ABSENCE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...employeeAbsenceCopy } =
          data.updateEmployeeAbsence.employeeAbsence;
        //   formik.setValues(employeeAbsenceCopy);
        navigate('/online/planning/absences-employes/liste');
      },
      update(cache, { data: { updateEmployeeAbsence } }) {
        const updatedEmployeeAbsence =
          updateEmployeeAbsence.employeeAbsence;

        cache.modify({
          fields: {
            employeeAbsences(
              existingEmployeeAbsences = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEmployeeAbsences =
                existingEmployeeAbsences.nodes.map((employeeAbsence) =>
                  readField('id', employeeAbsence) ===
                  updatedEmployeeAbsence.id
                    ? updatedEmployeeAbsence
                    : employeeAbsence,
                );

              return {
                totalCount: existingEmployeeAbsences.totalCount,
                nodes: updatedEmployeeAbsences,
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
  const onUpdateEmployeeAbsence = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEmployeeAbsence({ variables });
      },
    });
  };
  const [getEmployeeAbsence, { loading: loadingEmployeeAbsence }] =
    useLazyQuery(GET_EMPLOYEE_ABSENCE, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, duration, ...employeeAbsenceCopy } = data.employeeAbsence;
        employeeAbsenceCopy.startingDateTime = dayjs(
          employeeAbsenceCopy.startingDateTime,
        );
        employeeAbsenceCopy.endingDateTime = dayjs(
          employeeAbsenceCopy.endingDateTime,
        );
        employeeAbsenceCopy.employees =
          employeeAbsenceCopy.employees
            ? employeeAbsenceCopy.employees.map((i) => i?.employee)
            : [];
        formik.setValues(employeeAbsenceCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idEmployeeAbsence) {
      getEmployeeAbsence({ variables: { id: idEmployeeAbsence } });
    }
  }, [idEmployeeAbsence]);

  React.useEffect(() => {
    if (searchParams.get('type') === ABSENCE_TYPES.LEAVE && !idEmployeeAbsence) {
      formik.setFieldValue('absenceType', ABSENCE_TYPES.LEAVE)
      formik.setFieldValue('leaveType', LEAVE_TYPE_CHOICES.ANNUAL)
      setIsLeaveType(true)
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingEmployeeAbsence && <ProgressService type="form" />}
      {!loadingEmployeeAbsence && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  value={formik.values.title}
                  onChange={(e) =>
                    formik.setFieldValue('title', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            {!isLeaveType && <Grid xs={12} sm={6} md={8} item="true">
              <Item>
                <TheAutocomplete
                  disabled={isLeaveType}
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
            </Grid>}
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheDateTimePicker
                  label="Date et heure de début"
                  value={formik.values.startingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('startingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheDateTimePicker
                  label="Date de fin"
                  value={formik.values.endingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('endingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={2} sm={4} md={4}>
              {/* <Item>
                <FormControl fullWidth>
                  <InputLabel>Type </InputLabel>
                  <Select
                    value={formik.values.absenceType}
                    onChange={(e) =>
                      {formik.setFieldValue('absenceType', e.target.value)
                      if(e.target.value === ABSENCE_TYPES.ABSENCE ) formik.setFieldValue('leaveType', LEAVE_TYPE_CHOICES.ABSENCE)}
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    {ABSENCE_TYPES?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item> */}
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formik.values.leaveType}
                    onChange={(e) =>
                      {formik.setFieldValue('leaveType', e.target.value)
                      if(e.target.value === LEAVE_TYPE_CHOICES.ABSENCE ) formik.setFieldValue('absenceType', ABSENCE_TYPES.ABSENCE)}
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    {LEAVE_TYPE_CHOICES?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <SelectCheckmarks
                  options={dataData?.absenceReasons}
                  label="Motifs"
                  placeholder="Ajouter un motif"
                  limitTags={3}
                  value={formik.values.reasons}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('reasons', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Autres motifs"
                  value={formik.values.otherReasons}
                  onChange={(e) =>
                    formik.setFieldValue('otherReasons', e.target.value)
                  }
                  helperText="Si vous ne trouvez pas le motif dans la liste dessus."
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
                  label="Commentaire"
                  multiline
                  rows={4}
                  value={formik.values.comment}
                  onChange={(e) =>
                    formik.setFieldValue('comment', e.target.value)
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
                  to="/online/planning/absences-employes/liste"
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
