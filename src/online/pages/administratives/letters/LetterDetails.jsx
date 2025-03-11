import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';

import { LETTER_RECAP } from '../../../../_shared/graphql/queries/LetterQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';

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
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <LetterMiniInfos letter={letterData?.letter} />
          </Grid>
          <Grid item xs={5}>
            <LetterOtherInfos letter={letterData?.letter} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {letterData?.letter?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {letterData?.letter?.observation}
              </Typography>
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
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{letter?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {letter?.title}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Type de courrier : <b>{letter?.letterType === 'INCOMING' ? 'Entrant' : 'Sortant'}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Date et heure : <b>{getFormatDateTime(letter?.entryDateTime)}</b>
              </Typography>
              {letter?.document && (
                <Typography gutterBottom variant="subtitle1" component="div">
                  Pièce jointe : <MuiLink href={letter?.document} target="_blank" rel="noopener">Voir le document</MuiLink>
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
      {letter?.sender && (
        <>
          <Typography gutterBottom variant="subtitle3" component="h3">
            Expéditeur
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            <b>Type: </b>
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
          <Typography gutterBottom variant="body1" component="div">
            <b>Nom: </b>
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
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {letter?.establishments && letter?.establishments.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle3" component="h3">
            Structures concernées
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            {letter?.establishments?.map((est, index) => (
              <Grid item key={index}>
                <Chip 
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
          <Typography gutterBottom variant="subtitle3" component="h3">
            Employés concernés
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            {letter?.employees?.map((emp, index) => (
              <Grid item key={index}>
                <Chip 
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
          <Typography gutterBottom variant="subtitle3" component="h3">
            Personnes accompagnées
          </Typography>
          <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
            {letter?.beneficiaries?.map((beneficiary, index) => (
              <Grid item xs={12} sm={12} md={12} key={index}>
                <Item>
                  <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
                </Item>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  );
}
