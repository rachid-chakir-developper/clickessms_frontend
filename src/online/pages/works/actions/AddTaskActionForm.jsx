import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_TASK_ACTION } from '../../../../_shared/graphql/queries/TaskActionQueries';
import {
  POST_TASK_ACTION,
  PUT_TASK_ACTION,
} from '../../../../_shared/graphql/mutations/TaskActionMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { ACTION_STATUS } from '../../../../_shared/tools/constants';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import { GET_TICKETS } from '../../../../_shared/graphql/queries/TicketQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddTaskActionForm({ idTaskAction, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: { description: '', dueDate: null, employees:[], status: ACTION_STATUS.TO_DO},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...taskActionCopy } = values;
      taskActionCopy.employees = taskActionCopy.employees.map((i) => i?.id);
      if (idTaskAction && idTaskAction != '') {
        onUpdateTaskAction({
          id: taskActionCopy.id,
          taskActionData: taskActionCopy,
          document: document,
        });
      } else
        createTaskAction({
          variables: {
            taskActionData: taskActionCopy,
            document: document,
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

  const [createTaskAction, { loading: loadingPost }] = useMutation(POST_TASK_ACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...taskActionCopy } = data.createTaskAction.taskAction;
      //   formik.setValues(taskActionCopy);
      navigate('/online/travaux/actions/liste');
    },
    update(cache, { data: { createTaskAction } }) {
      const newTaskAction = createTaskAction.taskAction;

      cache.modify({
        fields: {
          taskActions(existingTaskActions = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingTaskActions.totalCount + 1,
              nodes: [newTaskAction, ...existingTaskActions.nodes],
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
  const [updateTaskAction, { loading: loadingPut }] = useMutation(PUT_TASK_ACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...taskActionCopy } = data.updateTaskAction.taskAction;
      //   formik.setValues(taskActionCopy);
      navigate('/online/travaux/actions/liste');
    },
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_TICKETS }],
    update(cache, { data: { updateTaskAction } }) {
      const updatedTaskAction = updateTaskAction.taskAction;

      cache.modify({
        fields: {
          taskActions(
            existingTaskActions = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedTaskActions = existingTaskActions.nodes.map((taskAction) =>
              readField('id', taskAction) === updatedTaskAction.id
                ? updatedTaskAction
                : taskAction,
            );

            return {
              totalCount: existingTaskActions.totalCount,
              nodes: updatedTaskActions,
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
  const onUpdateTaskAction = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTaskAction({ variables });
      },
    });
  };
  const [getTaskAction, { loading: loadingTaskAction }] = useLazyQuery(GET_TASK_ACTION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, ...taskActionCopy } = data.taskAction;
      taskActionCopy.dueDate = taskActionCopy.dueDate ? dayjs(taskActionCopy.dueDate) : null;
      formik.setValues(taskActionCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idTaskAction) {
      getTaskAction({ variables: { id: idTaskAction } });
    }
  }, [idTaskAction]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingTaskAction && <ProgressService type="form" />}
      {!loadingTaskAction && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={12} md={8} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Action"
                  multiline
                  rows={5}
                  value={formik.values.description}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'description',
                      e.target.value,
                    )
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDesktopDatePicker
                  label="Échéance"
                  value={formik.values.dueDate}
                  onChange={(date) =>
                    formik.setFieldValue('dueDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
                  label="Personnes concernées"
                  placeholder="Ajouter une personne"
                  limitTags={3}
                  value={formik.values.employees}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employees', newValue)
                  }
                />
              </Item>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Statut</InputLabel>
                    <Select
                        value={formik.values.status}
                        onChange={(e) => formik.setFieldValue('status', e.target.value)}
                        disabled={loadingPost || loadingPut}
                    >
                    {ACTION_STATUS?.ALL?.map((type, index) => {
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
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/travaux/actions/liste"
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
