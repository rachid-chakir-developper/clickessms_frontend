import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  tableCellClasses,
  alpha,
  TableContainer,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Euro, ReceiptLong } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GENERATE_PURCHASE_ORDER_FROM_EXPENSE } from '../../../../_shared/graphql/mutations/ExpenseMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { getFormatDate, getFormatDateTime, getPurchaseOrderStatusLabel } from '../../../../_shared/tools/functions';
import styled from '@emotion/styled';
import PurchaseOrderStatusLabelMenu from '../purchase_orders/PurchaseOrderStatusLabelMenu';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: alpha(
        theme.palette.secondary.main,
        theme.palette.action.activatedOpacity,
      ),
      color: theme.palette.secondary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: selected
        ? alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        : theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    cursor: 'pointer'
  }));

export default function GeneratePurchaseOrderButton({ expense }) {
  const navigate = useNavigate();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [open, setOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);

  const onGeneratePurchaseOrder = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez-vous vraiment générer le bon de commande ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        handleClose();
        generatePurchaseOrder({
          variables: { idExpense: expense.id, idPurchaseOrder: selectedPurchaseOrder || null },
        });
      },
    });
  };

  const [generatePurchaseOrder, { loading: loadingPost }] = useMutation(
    GENERATE_PURCHASE_ORDER_FROM_EXPENSE,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data.generatePurchaseOrder.success) {
          setNotifyAlert({
            isOpen: true,
            message: 'Ajouté avec succès',
            type: 'success',
          });
          let { __typename, ...purchaseOrderCopy } = data.generatePurchaseOrder.purchaseOrder;
          navigate(`/online/achats/bons-commandes/details/${purchaseOrderCopy.id}`);
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non ajouté ! Veuillez réessayer. ${data.generatePurchaseOrder.message}`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { generatePurchaseOrder } }) {
        if (generatePurchaseOrder.success) {
          const newPurchaseOrder = generatePurchaseOrder.purchaseOrder;

          cache.modify({
            fields: {
              purchaseOrders(existingPurchaseOrders = { totalCount: 0, nodes: [] }) {
                const existingPurchaseOrderIndex = existingPurchaseOrders.nodes.findIndex(
                  (purchaseOrder) => purchaseOrder.id === newPurchaseOrder.id
                );

                let updatedPurchaseOrders;

                if (existingPurchaseOrderIndex > -1) {
                  updatedPurchaseOrders = [...existingPurchaseOrders.nodes];
                  updatedPurchaseOrders[existingPurchaseOrderIndex] = newPurchaseOrder;
                } else {
                  updatedPurchaseOrders = [newPurchaseOrder, ...existingPurchaseOrders.nodes];
                }

                return {
                  totalCount: updatedPurchaseOrders.length,
                  nodes: updatedPurchaseOrders,
                };
              },
              expenses(existingExpenses = { totalCount: 0, nodes: [] }, { readField }) {
                const updatedExpenses = existingExpenses.nodes.map((expense) => {
                  const expenseId = readField('id', expense);

                  if (expenseId === newPurchaseOrder?.expense?.id) {
                    const existingExpensePurchaseOrders = readField('purchaseOrders', expense) || [];
                    const existingExpensePurchaseOrderIndex = existingExpensePurchaseOrders.findIndex(
                      (purchaseOrder) => readField('id', purchaseOrder) === newPurchaseOrder.id
                    );

                    let updatedExpensePurchaseOrders = [];

                    if (existingExpensePurchaseOrderIndex > -1) {
                      updatedExpensePurchaseOrders = existingExpensePurchaseOrders.map((purchaseOrder, index) =>
                        index === existingExpensePurchaseOrderIndex ? newPurchaseOrder : purchaseOrder
                      );
                    } else {
                      updatedExpensePurchaseOrders = [newPurchaseOrder, ...existingExpensePurchaseOrders];
                    }

                    return {
                      ...expense,
                      purchaseOrders: updatedExpensePurchaseOrders,
                    };
                  }

                  return expense;
                });

                return {
                  totalCount: updatedExpenses.length,
                  nodes: updatedExpenses,
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
    }
  );

  const handleOpen = () => {
    if (expense?.purchaseOrders?.length > 0) {
      setOpen(true);
    } else {
      onGeneratePurchaseOrder();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPurchaseOrder(null);
  };

  return (
    <>
        <Tooltip title="Générer un bon de commande">
            <IconButton
                onClick={handleOpen}
                >
                <ReceiptLong />
            </IconButton>
        </Tooltip>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Bon(s) déjà associé(s) à cette dépense.</DialogTitle>
            <DialogContent>
                {expense?.purchaseOrders?.length > 0 && 
                <TableContainer>
                    <Table>
                        <TableBody>
                            {expense.purchaseOrders.map((purchaseOrder) => (
                            <StyledTableRow
                                hover
                                key={purchaseOrder.id}
                                onClick={() => navigate(`/online/achats/bons-commandes/details/${purchaseOrder.id}`)}
                            >
                                <StyledTableCell>
                                    {`Bon #${purchaseOrder.number}`}
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${getFormatDateTime(purchaseOrder?.orderDateTime)}`}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <PurchaseOrderStatusLabelMenu disabled={true} purchaseOrder={purchaseOrder} />
                                </StyledTableCell>
                            </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                }
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Annuler
            </Button>
            <Button
                variant="contained"
                onClick={onGeneratePurchaseOrder}
                color="primary"
                disabled={loadingPost}
            >
                Nouvel bon
            </Button>
            </DialogActions>
        </Dialog>
    </>
  );
}
