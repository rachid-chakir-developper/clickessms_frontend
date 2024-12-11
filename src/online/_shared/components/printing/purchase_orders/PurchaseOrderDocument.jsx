
import React from 'react';
import { Typography, Paper, Grid, Stack, Box } from '@mui/material';
import { useLazyQuery} from '@apollo/client';
import { GET_PURCHASE_ORDER_RECAP } from '../../../../../_shared/graphql/queries/PurchaseOrderQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { useSession } from '../../../../../_shared/context/SessionProvider';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import PurchaseOrderSpanningDocument from './PurchaseOrderSpanningDocument';
import EstablishmentChip from '../../../../pages/companies/establishments/EstablishmentChip';

export default function PurchaseOrderDocument({purchaseOrder}) {
    const { user } = useSession();
    const [getPurchaseOrder, { 
        loading : loadingPurchaseOrder,
        data: purchaseOrderData, 
        error: purchaseOrderError, 
      }] = useLazyQuery(GET_PURCHASE_ORDER_RECAP)
    React.useEffect(()=>{
        if(purchaseOrder?.id){
            getPurchaseOrder(({ variables: { id: purchaseOrder.id } }));
        }
    }, [purchaseOrder])

    
    if(loadingPurchaseOrder) return <ProgressService type="form" />
    return (
            <>{purchaseOrderData?.purchaseOrder && <Stack sx={{ height : '100%', alignItems : 'center', justifyContent : 'center'}}>
                <Paper elevation={0} sx={{ width: '100%'}}>
                    
                    <Grid container spacing={0.5}>
                        <Grid item xs={5}>
                            <Box sx={{paddingTop: 10}}>
                                <Paper sx={{ padding : 2}} variant="outlined">
                                    <Typography sx={{fontWeight: 700}}>{purchaseOrderData?.purchaseOrder?.supplier?.name}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{purchaseOrderData?.purchaseOrder?.supplier?.address}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{purchaseOrderData?.purchaseOrder?.supplier?.additionalAddress}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{purchaseOrderData?.purchaseOrder?.supplier?.zipCode} - {purchaseOrderData?.purchaseOrder?.supplier?.city}</Typography>
                                    {purchaseOrderData?.purchaseOrder?.supplier?.email && <Typography>{purchaseOrderData?.purchaseOrder?.supplier?.email}</Typography>}
                                    {purchaseOrderData?.purchaseOrder?.supplier?.fix && <Typography>{purchaseOrderData?.purchaseOrder?.supplier?.fix}</Typography>}
                                    {purchaseOrderData?.purchaseOrder?.supplier?.mobile && <Typography>{purchaseOrderData?.purchaseOrder?.supplier?.mobile}</Typography>}
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                        <Grid item xs={5}>
                            <Box sx={{paddingTop: 6}}>
                                <Paper sx={{ padding : 2}} variant="elevation" elevation={0}>
                                    <Typography sx={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic'}}>BON DE COMMANDE</Typography>
                                    <Typography>
                                        N° : <b>{purchaseOrderData?.purchaseOrder?.number}</b><br />
                                        Date : <b>{getFormatDate(purchaseOrderData?.purchaseOrder?.orderDateTime)}</b><br />
                                        Valable jusqu'au <b>{getFormatDate(purchaseOrderData?.purchaseOrder?.validityEndDate)}</b>
                                    </Typography>
                                </Paper>
                            </Box>
                            <Box>
                                <Paper sx={{ padding : 2}} variant="outlined">
                                    <Typography sx={{fontWeight: 700}}>{purchaseOrderData?.purchaseOrder?.establishment?.name}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{purchaseOrderData?.purchaseOrder?.establishment?.address}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{purchaseOrderData?.purchaseOrder?.establishment?.additionalAddress}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{purchaseOrderData?.purchaseOrder?.establishment?.zipCode} - {purchaseOrderData?.purchaseOrder?.establishment?.city}</Typography>
                                    {purchaseOrderData?.purchaseOrder?.establishment?.email && <Typography>{purchaseOrderData?.purchaseOrder?.establishment?.email}</Typography>}
                                    {purchaseOrderData?.purchaseOrder?.establishment?.fix && <Typography>{purchaseOrderData?.purchaseOrder?.establishment?.fix}</Typography>}
                                    {purchaseOrderData?.purchaseOrder?.establishment?.mobile && <Typography>{purchaseOrderData?.purchaseOrder?.establishment?.mobile}</Typography>}
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{paddingTop: 4}}>
                                <Paper sx={{ padding : 0}} variant="elevation" elevation={0}>
                                    <Typography>
                                        <b>{purchaseOrderData?.purchaseOrder?.label}</b>
                                    </Typography>
                                    <Typography
                                        gutterBottom
                                        component="div"
                                        dangerouslySetInnerHTML={{ __html: purchaseOrderData?.purchaseOrder?.description }}
                                    />
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <PurchaseOrderSpanningDocument 
                                order={purchaseOrderData?.purchaseOrder}
                                items={purchaseOrderData?.purchaseOrder?.purchaseOrderItems || []}
                                deposits={purchaseOrderData?.purchaseOrder?.purchaseOrderDeposits || []}
                                />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0.5} sx={{marginBottom: 5}}>
                        <Grid item xs={6}>
                            <Typography sx={{paddingY: 6}}>Date et Signature:</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Stack>}</>
        );
}