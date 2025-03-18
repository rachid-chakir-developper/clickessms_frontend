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
import { GET_SCE_MEMBER } from '../../../../_shared/graphql/queries/SceMemberQueries';
import {
  POST_SCE_MEMBER,
  PUT_SCE_MEMBER,
} from '../../../../_shared/graphql/mutations/SceMemberMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { CSE_ROLE_CHOICES } from '../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddSceMemberForm({ idSceMember, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      employee: null,
      role: 'MEMBER',
      description: '',
      observation: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let sceMemberCopy = {...values};
      sceMemberCopy.employee = sceMemberCopy.employee?.id;
      if (idSceMember && idSceMember != '') {
        onUpdateSceMember({
          id: sceMemberCopy.id,
          sceMemberData: sceMemberCopy,
        });
      } else
        createSceMember({
          variables: {
            sceMemberData: sceMemberCopy,
          },
        });
    },
  });
  const [createSceMember, { loading: loadingPost }] = useMutation(
    POST_SCE_MEMBER,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...sceMemberCopy } = data.createSceMember.sceMember;
        //   formik.setValues(sceMemberCopy);
        navigate('/online/cse/membres/liste');
      },
      update(cache, { data: { createSceMember } }) {
        const newSceMember = createSceMember.sceMember;
        if(newSceMember){
          cache.modify({
            fields: {
              sceMembers(existingSceMembers = { totalCount: 0, nodes: [] }) {
                return {
                  totalCount: existingSceMembers.totalCount + 1,
                  nodes: [newSceMember, ...existingSceMembers.nodes],
                };
              },
            },
          });
        }
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
  const [updateSceMember, { loading: loadingPut }] = useMutation(PUT_SCE_MEMBER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...sceMemberCopy } = data.updateSceMember.sceMember;
      //   formik.setValues(sceMemberCopy);
      navigate('/online/cse/membres/liste');
    },
    update(cache, { data: { updateSceMember } }) {
      const updatedSceMember = updateSceMember.sceMember;

      cache.modify({
        fields: {
          sceMembers(
            existingSceMembers = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedSceMembers = existingSceMembers.nodes.map((sceMember) =>
              readField('id', sceMember) === updatedSceMember.id
                ? updatedSceMember
                : sceMember,
            );

            return {
              totalCount: existingSceMembers.totalCount,
              nodes: updatedSceMembers,
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
  const onUpdateSceMember = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateSceMember({ variables });
      },
    });
  };

  const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }

  const [getSceMember, { loading: loadingSceMember }] = useLazyQuery(
    GET_SCE_MEMBER,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...sceMemberCopy1 } = data.sceMember;
        let { folder, ...sceMemberCopy } = sceMemberCopy1;
        formik.setValues(sceMemberCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idSceMember) {
      getSceMember({ variables: { id: idSceMember } });
    }
  }, [idSceMember]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingSceMember && <ProgressService type="form" />}
      {!loadingSceMember && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
  onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

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
            
            <Grid item xs={12} sm={4} md={4}>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Rôle</InputLabel>
                    <Select
                        value={formik.values.role}
                        onChange={(e) => formik.setFieldValue('role', e.target.value)}
                        disabled={loadingPost || loadingPut}
                    >
                    {CSE_ROLE_CHOICES?.ALL?.map((type, index) => {
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
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Détail"
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
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/cse/membres/liste"
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
