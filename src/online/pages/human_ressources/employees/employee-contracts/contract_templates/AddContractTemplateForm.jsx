import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem,
  Accordion, AccordionActions, AccordionSummary, AccordionDetails
 } from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_CONTRACT_TEMPLATE } from '../../../../../../_shared/graphql/queries/ContractTemplateQueries';
import {
  CONTRACT_TEMPLATE_CONTRACT_TEMPLATE,
  PUT_CONTRACT_TEMPLATE,
} from '../../../../../../_shared/graphql/mutations/ContractTemplateMutations';
import ProgressService from '../../../../../../_shared/services/feedbacks/ProgressService';
import { CONTRACT_TYPES } from '../../../../../../_shared/tools/constants';
import TextEditorField from '../../../../../../_shared/components/form-fields/TextEditorField';
import { ExpandMore } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const FIELDS = {
  Company: {
    label: 'Association',
    keys: [
      { key: "name", label: "Nom de l'association" },
      { key: "logo", label: "Logo de l'association" },
      { key: "opening_date", label: "Date d'ouverture" },
      { key: "closing_date", label: "Date de fermeture" },
      { key: "city", label: "Ville" },
      { key: "country", label: "Pays" },
      { key: "zip_code", label: "Code postal" },
      { key: "address", label: "Adresse" },
      { key: "mobile", label: "Téléphone mobile" },
      { key: "email", label: "Email" },
      { key: "web_site", label: "Site web" },
    ]
  },
  Employee: {
    label: 'Employé',
    keys: [
      { key: "first_name", label: "Prénom" },
      { key: "last_name", label: "Nom de famille" },
      { key: "preferred_name", label: "Nom préféré" },
      { key: "email", label: "Email" },
      { key: "birth_date", label: "Date de naissance" },
      { key: "birth_place", label: "Lieu de naissance" },
      { key: "nationality", label: "Nationalité" },
      { key: "mobile", label: "Téléphone mobile" },
      { key: "address", label: "Adresse" },
      { key: "city", label: "Ville" },
      { key: "zip_code", label: "Code postal" },
    ]
  },
  EmployeeContract: {
    label: 'Contrat',
    keys: [
      { key: "contract_type", label: "Type de contrat" },
      { key: "starting_date", label: "Date de début" },
      { key: "ending_date", label: "Date de fin" },
      { key: "position", label: "Poste" },
      { key: "monthly_gross_salary", label: "Salaire brut mensuel" },
      { key: "salary", label: "Salaire brut annuel" },
      { key: "initial_paid_leave_days", label: "Jours de congés payés initiaux (CP)" },
      { key: "initial_rwt_days", label: "Jours RTT initiaux" },
      { key: "initial_temporary_days", label: "Jours de congé temporaire initiaux (CT)" },
    ]
  },
  Establishment: {
    label: 'Structure',
    keys: [
      { key: "name", label: "Nom de l'établissement" },
      { key: "siret", label: "Numéro SIRET" },
      { key: "finess", label: "Numéro FINESS" },
      { key: "ape_code", label: "Code APE" },
      { key: "city", label: "Ville" },
      { key: "country", label: "Pays" },
      { key: "zip_code", label: "Code postal" },
      { key: "address", label: "Adresse" },
      { key: "additional_address", label: "Adresse complémentaire" },
      { key: "mobile", label: "Téléphone mobile" },
      { key: "email", label: "Email" },
      { key: "web_site", label: "Site web" },
    ]
  },
};

export default function AddContractTemplateForm({ idContractTemplate, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      image: undefined,
      title: '',
      content: '',
      contractType: 'CDI',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let {image, ...contractTemplateCopy} = values;
      if (idContractTemplate && idContractTemplate != '') {
        onUpdateContractTemplate({
          id: contractTemplateCopy.id,
          contractTemplateData: contractTemplateCopy,
          image: image,
        });
      } else
        createContractTemplate({
          variables: {
            contractTemplateData: contractTemplateCopy,
            image: image,
          },
        });
    },
  });
  
  const [createContractTemplate, { loading: loadingContractTemplate }] = useMutation(CONTRACT_TEMPLATE_CONTRACT_TEMPLATE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...contractTemplateCopy } = data.createContractTemplate.contractTemplate;
      //   formik.setValues(contractTemplateCopy);
      navigate('/online/ressources-humaines/employes/contrats/templates/liste');
    },
    update(cache, { data: { createContractTemplate } }) {
      const newContractTemplate = createContractTemplate.contractTemplate;

      cache.modify({
        fields: {
          contractTemplates(existingContractTemplates = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingContractTemplates.totalCount + 1,
              nodes: [newContractTemplate, ...existingContractTemplates.nodes],
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
  const [updateContractTemplate, { loading: loadingPut }] = useMutation(PUT_CONTRACT_TEMPLATE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...contractTemplateCopy } = data.updateContractTemplate.contractTemplate;
      //   formik.setValues(contractTemplateCopy);
      navigate('/online/ressources-humaines/employes/contrats/templates/liste');
    },
    update(cache, { data: { updateContractTemplate } }) {
      const updatedContractTemplate = updateContractTemplate.contractTemplate;

      cache.modify({
        fields: {
          contractTemplates(
            existingContractTemplates = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedContractTemplates = existingContractTemplates.nodes.map((contractTemplate) =>
              readField('id', contractTemplate) === updatedContractTemplate.id
                ? updatedContractTemplate
                : contractTemplate,
            );

            return {
              totalCount: existingContractTemplates.totalCount,
              nodes: updatedContractTemplates,
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
  const onUpdateContractTemplate = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateContractTemplate({ variables });
      },
    });
  };
  const [getContractTemplate, { loading: loadingTheContractTemplate }] = useLazyQuery(GET_CONTRACT_TEMPLATE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, isRead, primaryColor, ...contractTemplateCopy } = data.contractTemplate;
      formik.setValues(contractTemplateCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idContractTemplate) {
      getContractTemplate({ variables: { id: idContractTemplate } });
    }
  }, [idContractTemplate]);

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingTheContractTemplate && <ProgressService type="form" />}
      {!loadingTheContractTemplate && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={8} md={8}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="titre"
                  value={formik.values.title}
                  onChange={(e) => formik.setFieldValue('title', e.target.value)}
                  disabled={loadingContractTemplate || loadingPut}
                />
              </Item>
              <Item  sx={{ minHeight: '400px', height: 'calc(100% - 190px);' }}>
                <TextEditorField
                  variant="outlined"
                  label="Détail"
                  placeholder="Contenu..."
                  multiline
                  rows={8}
                  value={formik.values.content}
                  onChange={(value) =>
                    formik.setFieldValue('content', value)
                  }
                  disabled={loadingContractTemplate || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Type de contrat
                  </InputLabel>
                  <Select
                    label="Type de contrat"
                    value={formik.values.contractType}
                    onChange={(e) =>
                      formik.setFieldValue('contractType', e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Choisissez un type</em>
                    </MenuItem>
                    {CONTRACT_TYPES?.ALL?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.value}>
                          {data.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
              <Item>
                <ImageFileField
                  variant="outlined"
                  label="Image de mise en avant"
                  imageValue={formik.values.image}
                  onChange={(imageFile) =>
                    formik.setFieldValue('image', imageFile)
                  }
                  disabled={loadingContractTemplate || loadingPut}
                />
              </Item>
              <Item>
                <Typography component="div" variant="h6">
                  Les clés variables
                </Typography>
                {Object.entries(FIELDS).map(([model, { label, keys }]) => (
                  <Accordion key={model} expanded={expanded === model} onChange={handleChange(model)}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`${model}-content`}
                      id={`${model}-header`}
                    >
                      {label} {/* Affiche le label du modèle */}
                    </AccordionSummary>
                    <AccordionDetails>
                      {keys.map(field => (
                        <Box key={field.key} sx={{textAlign: 'left', paddingY: 1}}>
                          <strong>{field.label}:</strong><br /> {`{{`}{model}__{field.key}{`}}`}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/ressources-humaines/employes/contrats/templates/liste" className="no_style">
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingContractTemplate || loadingPut}
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
