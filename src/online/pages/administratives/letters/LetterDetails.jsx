import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Chip,
  Link as MuiLink,
  Button,
  Stack,
} from '@mui/material';

import { LETTER_RECAP } from '../../../../_shared/graphql/queries/LetterQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import { ArrowBack, Edit, Business, PersonOutline, Phone, Email, Event, Description, Note, Group, People, Info, Send, AttachFile, Person } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function LetterDetails() {
  let { idLetter } = useParams();
  const [
    getLetter,
    { loading: loadingLetter, data: letterData, error: letterError },
  ] = useLazyQuery(LETTER_RECAP);
  React.useEffect(() => {
    if (idLetter) {
      getLetter({ variables: { id: idLetter } });
    }
  }, [idLetter]);

  if (loadingLetter) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/administratif/courriers/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        {letterData?.letter && (
          <Link to={`/online/administratif/courriers/modifier/${letterData.letter.id}`} className="no_style">
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        )}
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <LetterMiniInfos letter={letterData?.letter} />
          </Grid>
          <Grid item xs={5}>
            <LetterOtherInfos letter={letterData?.letter} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />Description
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1">
                  {letterData?.letter?.description ? letterData?.letter?.description : "Aucune description pour l'instant"}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Note sx={{ mr: 1 }} />Observation
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1">
                  {letterData?.letter?.observation ? letterData?.letter?.observation : "Aucune observation pour l'instant"}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1 }} />Informations supplémentaires
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Info sx={{ mr: 1, fontSize: 'small' }} />Ajouté le: {getFormatDateTime(letterData?.letter?.createdAt)}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Info sx={{ mr: 1, fontSize: 'small' }} />Dernière modification: {getFormatDateTime(letterData?.letter?.updatedAt)}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function LetterMiniInfos({ letter }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        //maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Info sx={{ mr: 1 }} />Informations principales
      </Typography>
      <Grid container spacing={2}>
        {letter?.document && letter?.document !== '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="document" src={letter?.document} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Référence : <b>{letter?.number}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Description sx={{ mr: 1, fontSize: 'small' }} />Libellé : <b>{letter?.title}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Send sx={{ mr: 1, fontSize: 'small' }} />Type de courrier : <b>{letter?.letterType === 'INCOMING' ? 'Entrant' : 'Sortant'}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Event sx={{ mr: 1, fontSize: 'small' }} />Date et heure : <b>{getFormatDateTime(letter?.entryDateTime)}</b>
              </Typography>
              {letter?.document && (
                <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachFile sx={{ mr: 1, fontSize: 'small' }} />Pièce jointe : <MuiLink href={letter?.document} target="_blank" rel="noopener" sx={{ ml: 1 }}>Voir le document</MuiLink>
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function LetterOtherInfos({ letter }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Group sx={{ mr: 1 }} />Personnes et entités concernées
      </Typography>

      {letter?.sender && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, fontSize: 'small' }} />Expéditeur
          </Typography>
          <Paper variant="outlined" sx={{ padding: 2, mb: 2 }}>
            <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Type: </b>
              {letter?.sender?.senderType === 'PARTNER'
                ? 'Partenaire'
                : letter?.sender?.senderType === 'SUPPLIER'
                  ? 'Fournisseur'
                  : letter?.sender?.senderType === 'FINANCIER'
                    ? 'Financeur'
                    : letter?.sender?.senderType === 'EMPLOYEE'
                      ? 'Employé'
                      : letter?.sender?.senderType === 'OTHER'
                        ? 'Autre'
                        : ''}
            </Typography>
            <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, fontSize: 'small' }} /><b>Nom: </b>
              {letter?.sender?.senderType === 'EMPLOYEE' && letter?.sender?.employee
                ? `${letter?.sender?.employee?.firstName} ${letter?.sender?.employee?.lastName}`
                : letter?.sender?.senderType === 'PARTNER' && letter?.sender?.partner
                  ? letter?.sender?.partner?.name
                  : letter?.sender?.senderType === 'SUPPLIER' && letter?.sender?.supplier
                    ? letter?.sender?.supplier?.name
                    : letter?.sender?.senderType === 'FINANCIER' && letter?.sender?.financier
                      ? letter?.sender?.financier?.name
                      : letter?.sender?.senderType === 'OTHER'
                        ? letter?.sender?.otherSender
                        : letter?.sender?.name || ''}
            </Typography>
          </Paper>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {letter?.establishments && letter?.establishments.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ mr: 1, fontSize: 'small' }} />Structures concernées
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            {letter?.establishments?.map((est, index) => (
              <Grid item key={index}>
                <Chip
                  icon={<Business fontSize="small" />}
                  label={est?.establishment?.name}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {letter?.employees && letter?.employees.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonOutline sx={{ mr: 1, fontSize: 'small' }} />Employés concernés
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            {letter?.employees?.map((emp, index) => (
              <Grid item key={index}>
                <Chip
                  icon={<PersonOutline fontSize="small" />}
                  label={`${emp?.employee?.firstName} ${emp?.employee?.lastName}`}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {letter?.beneficiaries && letter?.beneficiaries.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 1, fontSize: 'small' }} />Personnes accompagnées
          </Typography>
          <Stack direction="row" flexWrap='wrap' spacing={1}>
            {letter?.beneficiaries?.map((beneficiary, index) => (
              <BeneficiaryChip beneficiary={beneficiary?.beneficiary} key={index}/>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}
