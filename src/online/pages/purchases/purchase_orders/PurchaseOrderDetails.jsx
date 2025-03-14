import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from '@mui/material';
import { Edit, List } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GET_PURCHASE_ORDER_RECAP } from '../../../../_shared/graphql/queries/PurchaseOrderQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { formatCurrencyAmount, getFormatDate, getFormatDateTime } from '../../../../_shared/tools/functions';
import PurchaseOrderStatusLabelMenu from './PurchaseOrderStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function PurchaseOrderDetails() {
  let { idPurchaseOrder } = useParams();
  const [getPurchaseOrder, { loading: loadingPurchaseOrder, data: purchaseOrderData }] =
    useLazyQuery(GET_PURCHASE_ORDER_RECAP);

  React.useEffect(() => {
    if (idPurchaseOrder) {
      getPurchaseOrder({ variables: { id: idPurchaseOrder } });
    }
  }, [idPurchaseOrder]);

  if (loadingPurchaseOrder) return <ProgressService type="form" />;

  const purchaseOrder = purchaseOrderData?.purchaseOrder;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/achats/bons-commandes/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        {/* <Link to={`/online/achats/bons-commandes/modifier/${purchaseOrder?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link> */}
      </Box>

      {/* Informations générales */}
      <Section>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>
        <Typography variant="body1">
          <b>Référence : </b> {purchaseOrder?.number}
        </Typography>
        <Typography variant="body1">
          <b>Label : </b> {purchaseOrder?.label}
        </Typography>
        <Typography variant="body1">
          <b>Date: </b> {getFormatDate(purchaseOrder?.orderDateTime)}
        </Typography>
        <Typography variant="body1">
          <b>Valable jusqu'au: </b> {getFormatDate(purchaseOrder?.validityEndDate)}
        </Typography>
        <Typography variant="body1">
          <b>Montant total : </b> {formatCurrencyAmount(purchaseOrder?.totalTtc)}
        </Typography>
        {/* <Typography variant="body1">
          <b>Date de création : </b> {getFormatDateTime(purchaseOrder?.createdAt)}
        </Typography>
        <Typography variant="body1">
          <b>Dernière modification : </b> {getFormatDateTime(purchaseOrder?.updatedAt)}
        </Typography> */}
        <Typography variant="body1">
          <b>Status : </b>
        </Typography>
        <PurchaseOrderStatusLabelMenu purchaseOrder={purchaseOrder} />
      </Section>

      {/* Informations supplémentaires */}
      <Grid container spacing={2}>
        {purchaseOrder?.establishment && (
          <Grid item xs={12} sm={4}>
            <Section>
              <Typography variant="h6">Structure concernée</Typography>
              <EstablishmentChip establishment={purchaseOrder.establishment} />
            </Section>
          </Grid>
        )}
        {purchaseOrder?.employee && (
          <Grid item xs={12} sm={4}>
            <Section>
              <Typography variant="h6">Demandé par</Typography>
              <EmployeeChip employee={purchaseOrder?.employee} />
            </Section>
          </Grid>
        )}
        {purchaseOrder?.generator && (
          <Grid item xs={12} sm={4}>
            <Section>
              <Typography variant="h6">Généré par</Typography>
              <EmployeeChip employee={purchaseOrder?.generator} />
            </Section>
          </Grid>
        )}
      </Grid>

      {/* Détails des articles */}
      <Section>
        <Typography variant="h6" gutterBottom>
          Détails des articles
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Quantité</StyledTableCell>
                <StyledTableCell  align="right">Montant TTC</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseOrder?.purchaseOrderItems?.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{item.description || ''}</StyledTableCell>
                  <StyledTableCell>{item.quantity}</StyledTableCell>
                  <StyledTableCell  align="right">{formatCurrencyAmount(item.amountTtc)}</StyledTableCell>
                </StyledTableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={1} align="right" sx={{ fontWeight: 700, fontStyle: 'italic' }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrencyAmount(purchaseOrder?.totalTtc)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Description */}
      {purchaseOrder?.description && (
        <Section>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography>{purchaseOrder.description}</Typography>
        </Section>
      )}
    </Box>
  );
}
