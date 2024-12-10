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
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import { GET_PURCHASE_ORDER_RECAP } from '../../../../_shared/graphql/queries/PurchaseOrderQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  formatCurrencyAmount,
  getFormatDateTime,
} from '../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';
import PurchaseOrderStatusLabelMenu from './PurchaseOrderStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function PurchaseOrderDetails() {
  let { idPurchaseOrder } = useParams();
  const [getPurchaseOrder, { loading: loadingPurchaseOrder, data: purchaseOrderData, error: purchaseOrderError }] =
    useLazyQuery(GET_PURCHASE_ORDER_RECAP);
  React.useEffect(() => {
    if (idPurchaseOrder) {
      getPurchaseOrder({ variables: { id: idPurchaseOrder } });
    }
  }, [idPurchaseOrder]);

  if (loadingPurchaseOrder) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1}}>
        <Link
          to={`/online/achats/bons-commandes/modifier/${purchaseOrderData?.purchaseOrder.id}`}
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
            <PurchaseOrderMiniInfos purchaseOrder={purchaseOrderData?.purchaseOrder} />
          </Grid>
          <Grid item xs={5}>
            <PurchaseOrderOtherInfos purchaseOrder={purchaseOrderData?.purchaseOrder} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <PurchaseOrderItems purchaseOrder={purchaseOrderData?.purchaseOrder} />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {purchaseOrderData?.purchaseOrder?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
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

function PurchaseOrderMiniInfos({ purchaseOrder }) {
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
        {purchaseOrder?.image && purchaseOrder?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="complex" src={purchaseOrder?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {purchaseOrder?.label}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{purchaseOrder?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant : <b>{purchaseOrder?.totalAmount}&nbsp;€</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(purchaseOrder?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(purchaseOrder?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Status: </b>
              </Typography>
              <PurchaseOrderStatusLabelMenu purchaseOrder={purchaseOrder} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function PurchaseOrderOtherInfos({ purchaseOrder }) {
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              {purchaseOrder?.establishment && (
                  <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      La structure concernée
                    </Typography>
                    <EstablishmentChip establishment={purchaseOrder.establishment} />
                  </Paper>
              )}
              {purchaseOrder?.employee && (
                  <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Généré par:
                    </Typography>
                    <EmployeeChip employee={purchaseOrder?.employee} />
                  </Paper>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function PurchaseOrderItems({ purchaseOrder }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
      }}
    >
      {purchaseOrder?.purchaseOrderItems.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
            Détail de le bon de commande selon la nature
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {purchaseOrder?.purchaseOrderItems?.map((purchaseOrderItem, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemText
                      primary={purchaseOrderItem?.accountingNature?.name}
                      secondary={`${formatCurrencyAmount(purchaseOrderItem?.amountTtc)}`}
                    />
                    {purchaseOrderItem?.establishment && (
                        <>
                          <Stack direction="row" flexWrap='wrap' spacing={1}>
                            <EstablishmentChip establishment={purchaseOrderItem?.establishment} />
                          </Stack>
                        </>
                      )}
                  </ListItem>
                  {purchaseOrderItem?.description && purchaseOrderItem?.description != '' && <Typography variant="p" gutterBottom sx={{fontSize: 12, fontStyle: 'italic'}}>
                    {purchaseOrderItem?.description}
                  </Typography>}
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}
