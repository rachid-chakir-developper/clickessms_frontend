import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';

import { FRAME_DOCUMENT_RECAP } from '../../../../_shared/graphql/queries/FrameDocumentQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
} from '../../../../_shared/tools/functions';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function FrameDocumentDetails() {
  let { idFrameDocument } = useParams();
  const [
    getFrameDocument,
    { loading: loadingFrameDocument, data: frameDocumentData, error: frameDocumentError },
  ] = useLazyQuery(FRAME_DOCUMENT_RECAP);
  React.useEffect(() => {
    if (idFrameDocument) {
      getFrameDocument({ variables: { id: idFrameDocument } });
    }
  }, [idFrameDocument]);

  if (loadingFrameDocument) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/administratif/documents-cadres/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link
          to={`/online/administratif/documents-cadres/modifier/${frameDocumentData?.frameDocument?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <FrameDocumentMiniInfos frameDocument={frameDocumentData?.frameDocument} />
          </Grid>
          <Grid item xs={5}>
            <FrameDocumentOtherInfos frameDocument={frameDocumentData?.frameDocument} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {frameDocumentData?.frameDocument?.description}
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

function FrameDocumentMiniInfos({ frameDocument }) {
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
        {frameDocument?.image && frameDocument?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={frameDocument?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{frameDocument?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {frameDocument?.name}
              </Typography>
              {frameDocument?.document && <Button variant="outlined" size="small" sx={{textTransform: 'capitalize'}}
                                                  onClick={() => {
                                                    window.open(frameDocument?.document);
                                                  }}>
                                                  Voir le document
                                                </Button>}
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(frameDocument?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(frameDocument?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function FrameDocumentOtherInfos({ frameDocument }) {
  return (<>
      {frameDocument?.establishments.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
          }}
        >
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les structures concernées
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {frameDocument?.establishments?.map((establishment, index) => (
                <EstablishmentChip key={index} establishment={establishment} />
              ))}
            </Stack>
          </Paper>
        </Paper>
      )}
      </>
  );
}
