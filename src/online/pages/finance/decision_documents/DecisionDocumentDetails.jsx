import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, Typography, Grid } from '@mui/material';
import styled from '@emotion/styled';
import { Edit, ArrowBack, Description, EventNote, AccountBalance } from '@mui/icons-material';
import { GET_DECISION_DOCUMENT } from '../../../../_shared/graphql/queries/DecisionDocumentQueries';
import { getFormatDate } from '../../../../_shared/tools/functions';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function DecisionDocumentDetails() {
  let { idDecisionDocument } = useParams();
  const [getDecisionDocument, { loading, data: decisionDocumentData }] = useLazyQuery(GET_DECISION_DOCUMENT);

  React.useEffect(() => {
    if (idDecisionDocument) {
      getDecisionDocument({ variables: { id: idDecisionDocument } });
    }
  }, [idDecisionDocument]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/finance/decisions/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/finance/decisions/modifier/${decisionDocumentData?.decisionDocument?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {loading ? (
        <ProgressService type="form" />
      ) : (
        decisionDocumentData?.decisionDocument && <DecisionDocumentDetailsPage decisionDocument={decisionDocumentData.decisionDocument} />
      )}
    </Stack>
  );
}

const DecisionDocumentDetailsPage = ({ decisionDocument }) => {
  const {
    id,
    number,
    name,
    decisionDate,
    receptionDateTime,
    description,
    observation,
    financier,
    decisionDocumentItems,
  } = decisionDocument;

  return (
    <Grid container spacing={3}>
      {/* Informations principales */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} />Informations principales
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Description sx={{ mr: 1, fontSize: 'small' }} /><b>Référence :</b> {number}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Description sx={{ mr: 1, fontSize: 'small' }} /><b>Titre :</b> {name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventNote sx={{ mr: 1, fontSize: 'small' }} /><b>Date de décision :</b> {decisionDate ? getFormatDate(decisionDate) : 'Non défini'}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventNote sx={{ mr: 1, fontSize: 'small' }} /><b>Date de réception :</b> {receptionDateTime ? getFormatDate(receptionDateTime) : 'Non défini'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountBalance sx={{ mr: 1, fontSize: 'small' }} /><b>Département financeur :</b> {financier?.name || 'Non défini'}
            </Typography>
          </Paper>
        </Paper>
      </Grid>

      {/* Décisions modificatives */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} />Décisions modificatives
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            {decisionDocumentItems?.length > 0 ? (
              decisionDocumentItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Structure {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Structure :</b> {item.establishment?.name || 'Non défini'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Date de début :</b> {item.startingDateTime ? getFormatDate(item.startingDateTime) : 'Non défini'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Date de fin :</b> {item.endingDateTime ? getFormatDate(item.endingDateTime) : 'Non défini'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Prix :</b> {item.price ? `${item.price} €` : 'Non défini'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Dotation :</b> {item.endowment ? `${item.endowment} €` : 'Non défini'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Taux d'occupation :</b> {item.occupancyRate ? `${item.occupancyRate}%` : 'Non défini'}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <b>Jours d'ouverture :</b> {item.theoreticalNumberUnitWork || 'Non défini'}
                  </Typography>
                  {index < decisionDocumentItems.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))
            ) : (
              <Typography variant="body2">Aucune décision modificative</Typography>
            )}
          </Paper>
        </Paper>
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} />Description
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {description || "Aucune description pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>

      {/* Observation */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} />Observation
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {observation || "Aucune observation pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
}; 