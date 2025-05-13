import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  Stack,
  Box,
  Typography,
  Button,
  Divider,
  FormHelperText,
} from '@mui/material';
import dayjs from 'dayjs';
import moment from 'moment';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_ADVANCE } from '../../../../_shared/graphql/queries/AdvanceQueries';
import { CREATE_ADVANCE, UPDATE_ADVANCE } from '../../../../_shared/graphql/mutations/AdvanceMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDatePicker from '../../../../_shared/components/form-fields/TheDatePicker';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddAdvanceForm({ idAdvance, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);

  // Validation du formulaire
  const validationSchema = yup.object({
    amount: yup
      .number()
      .integer('Le montant doit être un nombre entier')
      .positive('Le montant doit être positif')
      .required('Le montant est obligatoire'),
    month: yup
      .string()
      .required('Le mois est obligatoire'),
  });

  // Configuration du formulaire
  const formik = useFormik({
    initialValues: {
      amount: '',
      month: dayjs(new Date()).startOf('month').format('YYYY-MM-DD'),
      reason: '',
      employee: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        if (!idAdvance) {
          const result = await createAdvance({
            variables: {
              advanceData: {
                employee: parseInt(values.employee?.id, 10),
                amount: parseInt(values.amount, 10),
                month: values.month ? moment(values.month).format("YYYY-MM-DD") : null,
                reason: values.reason,
              },
            },
          });

          if (result && result.data && result.data.createAdvance && result.data.createAdvance.advance) {
            setNotifyAlert({
              isOpen: true,
              message: 'Demande d\'acompte créée avec succès',
              type: 'success',
            });
            navigate('/online/ressources-humaines/acomptes/liste');
          } else {
            setNotifyAlert({
              isOpen: true,
              message: 'Une erreur est survenue lors de la création',
              type: 'error',
            });
          }
        } else {
          onUpdateAdvance({
            id: idAdvance,
            advanceData: {
              employee: parseInt(values.employee?.id, 10),
              amount: parseInt(values.amount, 10),
              month: values.month ? moment(values.month).format("YYYY-MM-DD") : null,
              reason: values.reason,
            },
          });
        }
      } catch (error) {
        console.error("Mutation error:", error);

        // Essayer d'extraire un message d'erreur plus précis
        let errorMessage = 'Une erreur est survenue lors de la création';

        // Vérifier les erreurs GraphQL
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const graphQLError = error.graphQLErrors[0];
          console.error("GraphQL error:", graphQLError);

          // Certaines erreurs Django sont encapsulées dans message
          errorMessage = graphQLError.message || errorMessage;

          // Vérifier si l'erreur contient des détails supplémentaires
          if (graphQLError.extensions && graphQLError.extensions.exception) {
            errorMessage = graphQLError.extensions.exception.message || errorMessage;
          }
        }

        // Vérifier les erreurs réseau
        if (error.networkError && error.networkError.result && error.networkError.result.errors) {
          const networkError = error.networkError.result.errors[0];
          console.error("Network error:", networkError);
          errorMessage = networkError.message || errorMessage;
        }

        setNotifyAlert({
          isOpen: true,
          message: errorMessage,
          type: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Récupération des employés pour le sélecteur
  const {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
  } = useQuery(GET_EMPLOYEES, {
    variables: { page: 1, limit: 100 },
    fetchPolicy: 'network-only',
  });

  // Fonction pour récupérer un employé spécifique par son ID
  const findEmployeeById = (id) => {
    if (!employeesData || !employeesData.employees || !employeesData.employees.nodes) return null;
    return employeesData.employees.nodes.find(emp => emp.id === id) || null;
  };

  // Mutation pour créer un acompte
  const [createAdvance, { loading: loadingCreate }] = useMutation(CREATE_ADVANCE, {
    onError: (err) => {
      console.error("Mutation error:", err);

      // Essayer d'extraire un message d'erreur plus précis
      let errorMessage = 'Une erreur est survenue lors de la création';

      // Vérifier les erreurs GraphQL
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphQLError = err.graphQLErrors[0];
        console.error("GraphQL error:", graphQLError);

        // Certaines erreurs Django sont encapsulées dans message
        errorMessage = graphQLError.message || errorMessage;

        // Vérifier si l'erreur contient des détails supplémentaires
        if (graphQLError.extensions && graphQLError.extensions.exception) {
          errorMessage = graphQLError.extensions.exception.message || errorMessage;
        }
      }

      // Vérifier les erreurs réseau
      if (err.networkError && err.networkError.result && err.networkError.result.errors) {
        const networkError = err.networkError.result.errors[0];
        console.error("Network error:", networkError);
        errorMessage = networkError.message || errorMessage;
      }

      setNotifyAlert({
        isOpen: true,
        message: errorMessage,
        type: 'error',
      });
    },
  });

  // Mutation pour mettre à jour un acompte
  const [updateAdvance, { loading: loadingUpdate }] = useMutation(UPDATE_ADVANCE, {
    onError: (err) => {
      console.error("Update error:", err);

      // Essayer d'extraire un message d'erreur plus précis
      let errorMessage = 'Une erreur est survenue lors de la mise à jour';

      // Vérifier les erreurs GraphQL
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphQLError = err.graphQLErrors[0];
        console.error("GraphQL error:", graphQLError);

        // Certaines erreurs Django sont encapsulées dans message
        errorMessage = graphQLError.message || errorMessage;

        // Vérifier si l'erreur contient des détails supplémentaires
        if (graphQLError.extensions && graphQLError.extensions.exception) {
          errorMessage = graphQLError.extensions.exception.message || errorMessage;
        }
      }

      // Vérifier les erreurs réseau
      if (err.networkError && err.networkError.result && err.networkError.result.errors) {
        const networkError = err.networkError.result.errors[0];
        console.error("Network error:", networkError);
        errorMessage = networkError.message || errorMessage;
      }

      setNotifyAlert({
        isOpen: true,
        message: errorMessage,
        type: 'error',
      });
    },
  });

  // Fonction pour lancer la mise à jour
  const onUpdateAdvance = async ({ id, advanceData }) => {
    setConfirmDialog({
      isOpen: true,
      title: 'CONFIRMATION',
      subTitle: 'Voulez-vous vraiment modifier cette demande d\'acompte ?',
      onConfirm: async () => {
        setConfirmDialog({ isOpen: false });
        try {
          const result = await updateAdvance({
            variables: {
              id: id,
              advanceData: advanceData,
            },
          });

          if (result && result.data && result.data.updateAdvance && result.data.updateAdvance.advance) {
            setNotifyAlert({
              isOpen: true,
              message: 'Demande d\'acompte mise à jour avec succès',
              type: 'success',
            });
            navigate('/online/ressources-humaines/acomptes/liste');
          } else {
            setNotifyAlert({
              isOpen: true,
              message: 'Une erreur est survenue lors de la mise à jour',
              type: 'error',
            });
          }
        } catch (error) {
          console.error("Mutation error:", error);

          // Extraire un message d'erreur plus précis
          let errorMessage = 'Une erreur est survenue lors de la mise à jour';

          // Vérifier les erreurs GraphQL
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const graphQLError = error.graphQLErrors[0];
            console.error("GraphQL error:", graphQLError);

            // Certaines erreurs Django sont encapsulées dans message
            errorMessage = graphQLError.message || errorMessage;

            // Vérifier si l'erreur contient des détails supplémentaires
            if (graphQLError.extensions && graphQLError.extensions.exception) {
              errorMessage = graphQLError.extensions.exception.message || errorMessage;
            }
          }

          // Vérifier les erreurs réseau
          if (error.networkError && error.networkError.result && error.networkError.result.errors) {
            const networkError = error.networkError.result.errors[0];
            console.error("Network error:", networkError);
            errorMessage = networkError.message || errorMessage;
          }

          setNotifyAlert({
            isOpen: true,
            message: errorMessage,
            type: 'error',
          });
        }
      },
    });
  };

  // Requête pour récupérer les détails d'un acompte existant
  const [getAdvance, { loading: loadingAdvance }] = useLazyQuery(GET_ADVANCE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const advance = data.advance;
      if (advance) {
        // Attendre que les données des employés soient chargées
        const waitForEmployees = () => {
          if (employeesData && employeesData.employees) {
            const employee = findEmployeeById(advance.employee.id);
            formik.setValues({
              amount: advance.amount,
              month: advance.month,
              reason: advance.reason || '',
              employee: employee,
            });
            setSelectedEmployee(employee);
          } else {
            setTimeout(waitForEmployees, 100);
          }
        };
        waitForEmployees();
      }
    },
    onError: (err) => {
      console.error(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Erreur lors du chargement de la demande d\'acompte',
        type: 'error',
      });
      navigate('/online/ressources-humaines/acomptes/liste');
    },
  });

  // Chargement des données si on est en mode édition
  React.useEffect(() => {
    if (idAdvance) {
      getAdvance({ variables: { id: idAdvance } });
    }
  }, [idAdvance]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}
      </Typography>

      {(loadingAdvance || loadingCreate || loadingUpdate) && <ProgressService type="form" />}

      {!loadingAdvance && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >

            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheDatePicker
                  label="Mois de l'acompte *"
                  value={formik.values.month}
                  onChange={(date) => {
                    // S'assurer que la date est au format YYYY-MM-DD et au 1er jour du mois
                    const formattedDate = dayjs(date).startOf('month').format('YYYY-MM-DD');
                    formik.setFieldValue('month', formattedDate);
                  }}
                  views={['year', 'month']}
                  format="MM/YYYY"
                  error={formik.touched.month && Boolean(formik.errors.month)}
                  helperText={formik.touched.month && formik.errors.month}
                />
              </Item>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  fullWidth
                  id="amount"
                  name="amount"
                  label="Montant *"
                  type="number"
                  inputProps={{
                    step: "1", // N'accepter que des nombres entiers
                    min: "0" // Montant positif uniquement
                  }}
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Item>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  fullWidth
                  id="reason"
                  name="reason"
                  label="Motif de la demande"
                  multiline
                  rows={4}
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                />
              </Item>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Box textAlign="right">
                <Button
                  component={Link}
                  to="/online/ressources-humaines/acomptes/liste"
                  sx={{ marginRight: '10px' }}
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loadingCreate || loadingUpdate}
                >
                  {idAdvance ? 'Modifier' : 'Enregistrer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
} 