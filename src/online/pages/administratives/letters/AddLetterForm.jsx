import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  Stack,
  Box,
  Typography,
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
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_LETTER } from '../../../../_shared/graphql/queries/LetterQueries';
import {
  POST_LETTER,
  PUT_LETTER,
} from '../../../../_shared/graphql/mutations/LetterMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { GET_PARTNERS } from '../../../../_shared/graphql/queries/PartnerQueries';
import { GET_SUPPLIERS } from '../../../../_shared/graphql/queries/SupplierQueries';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddLetterForm({ idLetter, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    title: yup
      .string("Entrez le titre d'courrier")
      .required("Le titre d'courrier est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      document: undefined,
      number: '',
      title: '',
      letterType: 'INCOMING',
      entryDateTime: dayjs(new Date()),
      description: '',
      observation: '',
      isActive: true,
      establishments: [],
      employees: [],
      beneficiaries: [],
      employee: null,
      sender: {
        type: '',
        id: null,
        name: '',
        otherSender: ''
      },
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...letterCopy } = values;
      letterCopy.establishments = letterCopy.establishments.map((i) => i?.id);
      letterCopy.employees = letterCopy.employees.map((i) => i?.id);
      letterCopy.beneficiaries = letterCopy.beneficiaries.map((i) => i?.id);
      letterCopy.employee = letterCopy.employee ? letterCopy.employee.id : null;
      
      // Process sender data
      if (letterCopy.sender && letterCopy.sender.type) {
        // Only include sender if a type is selected
        const senderData = {
          type: letterCopy.sender.type,
          name: letterCopy.sender.name || '',
          otherSender: letterCopy.sender.otherSender || ''
        };
        
        // Add the appropriate ID based on sender type
        if (letterCopy.sender.type === 'PARTNER' && letterCopy.sender.id) {
          senderData.partner = letterCopy.sender.id;
        } else if (letterCopy.sender.type === 'SUPPLIER' && letterCopy.sender.id) {
          senderData.supplier = letterCopy.sender.id;
        } else if (letterCopy.sender.type === 'FINANCIER' && letterCopy.sender.id) {
          senderData.financier = letterCopy.sender.id;
        } else if (letterCopy.sender.type === 'EMPLOYEE' && letterCopy.sender.id) {
          senderData.employee = letterCopy.sender.id;
        }
        
        letterCopy.sender = senderData;
      } else {
        // If no sender type is selected, don't include sender in the request
        delete letterCopy.sender;
      }
      
      if (idLetter && idLetter != '') {
        onUpdateLetter({
          id: letterCopy.id,
          letterData: letterCopy,
          document: document,
        });
      } else
        createLetter({
          variables: {
            letterData: letterCopy,
            document: document,
          },
        });
    },
  });
   const [getBeneficiaries, {
    loading: loadingBeneficiaries,
    data: beneficiariesData,
    error: beneficiariesError,
    fetchMore: fetchMoreBeneficiaries,
  }] = useLazyQuery(GET_BENEFICIARIES, { variables: { beneficiaryFilter : null, page: 1, limit: 10 } });

  const onGetBeneficiaries = (keyword)=>{
    getBeneficiaries({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }
  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });

const [getEmployees, {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
  const onGetEmployees = (keyword)=>{
    getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }

  // Fetch partners data
  const {
    loading: loadingPartners,
    data: partnersData,
    error: partnersError,
  } = useQuery(GET_PARTNERS, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 100 }
  });

  // Fetch suppliers data
  const {
    loading: loadingSuppliers,
    data: suppliersData,
    error: suppliersError,
  } = useQuery(GET_SUPPLIERS, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 100 }
  });

  // Fetch financiers data
  const {
    loading: loadingFinanciers,
    data: financiersData,
    error: financiersError,
  } = useQuery(GET_FINANCIERS, {
    fetchPolicy: 'network-only',
    variables: { page: 1, limit: 100 }
  });

  // Handle sender type change
  const handleSenderTypeChange = (e) => {
    const senderType = e.target.value;
    formik.setFieldValue('sender', {
      ...formik.values.sender,
      type: senderType,
      id: null,
      name: '',
    });
  };

  // Handle sender selection change
  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    let senderName = '';
    let senderObject = null;

    switch (formik.values.sender.type) {
      case 'PARTNER':
        senderObject = partnersData?.partners?.nodes.find(p => p.id === senderId);
        senderName = senderObject?.name || '';
        break;
      case 'SUPPLIER':
        senderObject = suppliersData?.suppliers?.nodes.find(s => s.id === senderId);
        senderName = senderObject?.name || '';
        break;
      case 'FINANCIER':
        senderObject = financiersData?.financiers?.nodes.find(f => f.id === senderId);
        senderName = senderObject?.name || '';
        break;
      case 'EMPLOYEE':
        senderObject = employeesData?.employees?.nodes.find(e => e.id === senderId);
        senderName = senderObject ? `${senderObject.firstName} ${senderObject.lastName}` : '';
        break;
      default:
        break;
    }

    formik.setFieldValue('sender', {
      ...formik.values.sender,
      id: senderId,
      name: senderName,
    });
  };

  const [createLetter, { loading: loadingPost }] = useMutation(POST_LETTER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...letterCopy } = data.createLetter.letter;
      //   formik.setValues(letterCopy);
      navigate('/online/administratif/courriers/liste');
    },
    update(cache, { data: { createLetter } }) {
      const newLetter = createLetter.letter;

      cache.modify({
        fields: {
          letters(existingLetters = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingLetters.totalCount + 1,
              nodes: [newLetter, ...existingLetters.nodes],
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
  const [updateLetter, { loading: loadingPut }] = useMutation(PUT_LETTER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...letterCopy } = data.updateLetter.letter;
      //   formik.setValues(letterCopy);
      navigate('/online/administratif/courriers/liste');
    },
    update(cache, { data: { updateLetter } }) {
      const updatedLetter = updateLetter.letter;

      cache.modify({
        fields: {
          letters(
            existingLetters = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedLetters = existingLetters.nodes.map((letter) =>
              readField('id', letter) === updatedLetter.id
                ? updatedLetter
                : letter,
            );

            return {
              totalCount: existingLetters.totalCount,
              nodes: updatedLetters,
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
  const onUpdateLetter = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateLetter({ variables });
      },
    });
  };
  const [getLetter, { loading: loadingLetter }] = useLazyQuery(GET_LETTER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...letterCopy1 } = data.letter;
      let { folder, ...letterCopy } = letterCopy1;
      letterCopy.entryDateTime = letterCopy.entryDateTime ? dayjs(letterCopy.entryDateTime) : null;
      
      letterCopy.establishments =
      letterCopy.establishments
        ? letterCopy.establishments.map((i) => i?.establishment)
        : [];    

      letterCopy.employees =
      letterCopy.employees
        ? letterCopy.employees.map((i) => i?.employee)
        : [];

      letterCopy.beneficiaries = letterCopy.beneficiaries
        ? letterCopy.beneficiaries.map((i) => i?.beneficiary)
        : [];
        
      // Process sender data if it exists
      if (letterCopy.sender) {
        const senderData = {
          type: letterCopy.sender.senderType || '',
          id: null,
          name: letterCopy.sender.name || '',
          otherSender: letterCopy.sender.otherSender || ''
        };
        
        // Set the appropriate ID based on sender type
        if (letterCopy.sender.senderType === 'PARTNER' && letterCopy.sender.partner) {
          senderData.id = letterCopy.sender.partner.id;
        } else if (letterCopy.sender.senderType === 'SUPPLIER' && letterCopy.sender.supplier) {
          senderData.id = letterCopy.sender.supplier.id;
        } else if (letterCopy.sender.senderType === 'FINANCIER' && letterCopy.sender.financier) {
          senderData.id = letterCopy.sender.financier.id;
        } else if (letterCopy.sender.senderType === 'EMPLOYEE' && letterCopy.sender.employee) {
          senderData.id = letterCopy.sender.employee.id;
        }
        
        letterCopy.sender = senderData;
      } else {
        // Initialize empty sender if none exists
        letterCopy.sender = {
          type: '',
          id: null,
          name: '',
          otherSender: ''
        };
      }
      
      formik.setValues(letterCopy);
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idLetter) {
      getLetter({ variables: { id: idLetter } });
    }
  }, [idLetter]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.title}
      </Typography>
      {loadingLetter && <ProgressService type="form" />}
      {!loadingLetter && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="libellé"
                  id="title"
                  value={formik.values.title}
                  required
                  onChange={(e) =>
                    formik.setFieldValue('title', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Type d'courrier</InputLabel>
                  <Select
                    value={formik.values.letterType}
                    onChange={(e) =>
                      formik.setFieldValue('letterType', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value="INCOMING">Entrant</MenuItem>
                    <MenuItem value="OUTGOING">Sortant</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheDateTimePicker
                  label="Date et heure"
                  value={formik.values.entryDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('entryDateTime', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            
            {/* Sender Type Selection */}
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel>Type d'expéditeur</InputLabel>
                  <Select
                    value={formik.values.sender.type}
                    onChange={handleSenderTypeChange}
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value="">Sélectionner</MenuItem>
                    <MenuItem value="PARTNER">Partenaire</MenuItem>
                    <MenuItem value="SUPPLIER">Fournisseur</MenuItem>
                    <MenuItem value="FINANCIER">Financeur</MenuItem>
                    <MenuItem value="EMPLOYEE">Employé</MenuItem>
                    <MenuItem value="OTHER">Autre</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            
            {/* Sender Selection based on type */}
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                {formik.values.sender.type === 'PARTNER' && (
                  <FormControl fullWidth>
                    <InputLabel>Partenaire</InputLabel>
                    <Select
                      value={formik.values.sender.id || ''}
                      onChange={handleSenderChange}
                      disabled={loadingPost || loadingPut || loadingPartners}
                    >
                      <MenuItem value="">Sélectionner un partenaire</MenuItem>
                      {partnersData?.partners?.nodes?.map((partner) => (
                        <MenuItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
                {formik.values.sender.type === 'SUPPLIER' && (
                  <FormControl fullWidth>
                    <InputLabel>Fournisseur</InputLabel>
                    <Select
                      value={formik.values.sender.id || ''}
                      onChange={handleSenderChange}
                      disabled={loadingPost || loadingPut || loadingSuppliers}
                    >
                      <MenuItem value="">Sélectionner un fournisseur</MenuItem>
                      {suppliersData?.suppliers?.nodes?.map((supplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
                {formik.values.sender.type === 'FINANCIER' && (
                  <FormControl fullWidth>
                    <InputLabel>Financeur</InputLabel>
                    <Select
                      value={formik.values.sender.id || ''}
                      onChange={handleSenderChange}
                      disabled={loadingPost || loadingPut || loadingFinanciers}
                    >
                      <MenuItem value="">Sélectionner un financeur</MenuItem>
                      {financiersData?.financiers?.nodes?.map((financier) => (
                        <MenuItem key={financier.id} value={financier.id}>
                          {financier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
                {formik.values.sender.type === 'EMPLOYEE' && (
                  <TheAutocomplete
                    options={employeesData?.employees?.nodes}
                    onInput={(e) => {
                      onGetEmployees(e.target.value)
                    }}
                    label="Employé expéditeur"
                    placeholder="Sélectionner un employé"
                    value={formik.values.sender.id ? employeesData?.employees?.nodes.find(e => e.id === formik.values.sender.id) : null}
                    onChange={(e, newValue) => {
                      formik.setFieldValue('sender', {
                        ...formik.values.sender,
                        type: 'EMPLOYEE',
                        id: newValue?.id || null,
                        name: newValue ? `${newValue.firstName} ${newValue.lastName}` : '',
                      });
                    }}
                    disabled={loadingPost || loadingPut}
                  />
                )}
                
                {formik.values.sender.type === 'OTHER' && (
                  <TheTextField
                    variant="outlined"
                    label="Autre expéditeur"
                    value={formik.values.sender.otherSender || ''}
                    onChange={(e) =>
                      formik.setFieldValue('sender', {
                        ...formik.values.sender,
                        type: 'OTHER',
                        id: null,
                        name: '',
                        otherSender: e.target.value
                      })
                    }
                    disabled={loadingPost || loadingPut}
                  />
                )}
              </Item>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Pièce jointe"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structures concernées"
                  placeholder="Ajouter une structure"
                  limitTags={3}
                  value={formik.values.establishments}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishments', newValue)
                  }
                />
              </Item>
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                  label="Employées concernées"
                  placeholder="Ajouter un employé"
                  value={formik.values.employees}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employees', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                        onInput={(e) => {
                          onGetBeneficiaries(e.target.value)
                        }}
                  label="Personnes accompagnées"
                  placeholder="Ajouter une personne accompagnée"
                  limitTags={3}
                  value={formik.values.beneficiaries}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiaries', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Commentaire"
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
                  to="/online/administratif/courriers/liste"
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
