import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_ACTION_PLAN_ACTION } from '../../../../_shared/graphql/queries/ActionPlanActionQueries';
import {
  POST_ACTION_PLAN_ACTION,
  PUT_ACTION_PLAN_ACTION,
} from '../../../../_shared/graphql/mutations/ActionPlanActionMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { ACTION_STATUS } from '../../../../_shared/tools/constants';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import { GET_ACTION_PLAN_OBJECTIVES } from '../../../../_shared/graphql/queries/ActionPlanObjectiveQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddActionPlanActionForm({ idActionPlanAction, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: { action: '', dueDate: null, employees:[], status: ACTION_STATUS.TO_DO},
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...actionPlanActionCopy } = values;
      actionPlanActionCopy.employees = actionPlanActionCopy.employees.map((i) => i?.id);
      if (idActionPlanAction && idActionPlanAction != '') {
        onUpdateActionPlanAction({
          id: actionPlanActionCopy.id,
          actionPlanActionData: actionPlanActionCopy,
          document: document,
        });
      } else
        createActionPlanAction({
          variables: {
            actionPlanActionData: actionPlanActionCopy,
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

  const [createActionPlanAction, { loading: loadingPost }] = useMutation(POST_ACTION_PLAN_ACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...actionPlanActionCopy } = data.createActionPlanAction.actionPlanAction;
      //   formik.setValues(actionPlanActionCopy);
      navigate('/online/travaux/actions/liste');
    },
    update(cache, { data: { createActionPlanAction } }) {
      const newActionPlanAction = createActionPlanAction.actionPlanAction;

      cache.modify({
        fields: {
          actionPlanActions(existingActionPlanActions = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingActionPlanActions.totalCount + 1,
              nodes: [newActionPlanAction, ...existingActionPlanActions.nodes],
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
  const [updateActionPlanAction, { loading: loadingPut }] = useMutation(PUT_ACTION_PLAN_ACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...actionPlanActionCopy } = data.updateActionPlanAction.actionPlanAction;
      //   formik.setValues(actionPlanActionCopy);
      navigate('/online/travaux/actions/liste');
    },
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_ACTION_PLAN_OBJECTIVES }],
    update(cache, { data: { updateActionPlanAction } }) {
      const updatedActionPlanAction = updateActionPlanAction.actionPlanAction;

      cache.modify({
        fields: {
          actionPlanActions(
            existingActionPlanActions = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedActionPlanActions = existingActionPlanActions.nodes.map((actionPlanAction) =>
              readField('id', actionPlanAction) === updatedActionPlanAction.id
                ? updatedActionPlanAction
                : actionPlanAction,
            );

            return {
              totalCount: existingActionPlanActions.totalCount,
              nodes: updatedActionPlanActions,
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
  const onUpdateActionPlanAction = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateActionPlanAction({ variables });
      },
    });
  };
  const [getActionPlanAction, { loading: loadingActionPlanAction }] = useLazyQuery(GET_ACTION_PLAN_ACTION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, ...actionPlanActionCopy } = data.actionPlanAction;
      actionPlanActionCopy.dueDate = actionPlanActionCopy.dueDate ? dayjs(actionPlanActionCopy.dueDate) : null;
      formik.setValues(actionPlanActionCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idActionPlanAction) {
      getActionPlanAction({ variables: { id: idActionPlanAction } });
    }
  }, [idActionPlanAction]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingActionPlanAction && <ProgressService type="form" />}
      {!loadingActionPlanAction && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid xs={12} sm={12} md={8} item="true">
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Action"
                  multiline
                  rows={5}
                  value={formik.values.action}
                  onChange={(e) =>
                    formik.setFieldValue(
                      'action',
                      e.target.value,
                    )
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
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
            <Grid xs={12} sm={12} md={12}>
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
