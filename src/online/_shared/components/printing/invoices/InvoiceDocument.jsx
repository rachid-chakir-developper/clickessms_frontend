
import React from 'react';
import { Typography, Paper, Grid, Stack, Box } from '@mui/material';
import { useLazyQuery} from '@apollo/client';
import { GET_INVOICE_RECAP } from '../../../../../_shared/graphql/queries/InvoiceQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { useSession } from '../../../../../_shared/context/SessionProvider';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import InvoiceSpanningDocument from './InvoiceSpanningDocument';
import AmountInWords from '../../../../../_shared/components/money/AmountInWords';

export default function InvoiceDocument({invoice}) {
    const { user } = useSession();
    const [getInvoice, { 
        loading : loadingInvoice,
        data: invoiceData, 
        error: invoiceError, 
      }] = useLazyQuery(GET_INVOICE_RECAP)
    React.useEffect(()=>{
        if(invoice?.id){
            getInvoice(({ variables: { id: invoice.id } }));
        }
    }, [invoice])

    
    if(loadingInvoice) return <ProgressService type="form" />
    return (
            <>{invoiceData?.invoice && <Stack sx={{ height : '100%', alignItems : 'center', justifyContent : 'center'}}>
                <Paper elevation={0} sx={{ width: '100%'}}>
                    
                    <Grid container spacing={0.5}>
                        <Grid item xs={4}>
                            <Box sx={{paddingTop: 0}}>
                                <Paper sx={{ padding : 2}} variant="outlined">
                                    <Typography>Monsieur le Président du</Typography>
                                    <Typography sx={{fontWeight: 700}}>{invoiceData?.invoice?.clientName}</Typography>
                                    <Typography sx={{whiteSpace : 'pre-line'}}>{invoiceData?.invoice?.clientInfos}</Typography>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent : 'center', alignItems: 'center'}}>
                                {invoiceData?.invoice?.logo && <img src={invoiceData?.invoice?.logo} alt={invoiceData?.invoice?.establishmentName} height={100} />}
                                <Typography sx={{fontWeight: 700}}>{invoiceData?.invoice?.establishmentName}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{paddingTop: 6}}>
                                <Paper sx={{ padding : 2}} variant="elevation" elevation={0}>
                                    <Typography sx={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic'}}>FACTURE</Typography>
                                    <Typography>
                                        N° : <b>{invoiceData?.invoice?.number}</b><br />
                                        Date : <b>{getFormatDate(invoiceData?.invoice?.emissionDate)}</b><br />
                                        Date d'échéance : <b>{getFormatDate(invoiceData?.invoice?.dueDate)}</b>
                                    </Typography>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <InvoiceSpanningDocument 
                                invoice={invoiceData?.invoice}
                                items={invoiceData?.invoice?.invoiceItems || []}
                                />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0.5} sx={{marginBottom: 5}}>
                        <Grid item xs={12}>
                            <Box sx={{paddingY: 6}}>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent: 'center'}}>
                            <Box>
                                {invoiceData?.invoice?.signatures?.map((signature)=>
                                    <>
                                        <Typography sx={{fontWeight: 700}}>{signature?.authorName}</Typography>
                                        <Typography sx={{fontWeight: 700, fontStyle: 'italic', marginBottom:3}}>{signature?.authorPosition}</Typography>
                                        {signature?.base64Encoded && <img src={signature?.base64Encoded} height={100} />}
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{paddingTop: 20}}>
                                <Typography variant="small" component="small">Le montant total s'élève à <em><AmountInWords amount={Number(invoiceData?.invoice?.totalTtc)} /></em></Typography>
                            </Box>
                            <Box sx={{paddingTop: 2}}>
                                <Typography variant="small" component="small" sx={{fontStyle: 'italic', fontSize: 10}}>
                                    Pas d'escompte pour règlement anticipé. En cas de retard de paiement, une pénalité égale à 3 fois le taux intérêt légal sera exigible (Article L 441-10, alinéa 12 du Code de Commerce).
                                    Pour tout professionnel, en sus des indemnités de retard, toute somme, y compris l'acompte, non payée à sa date d'exigibilité produira de plein droit le paiement d'une indemnité
                                    forfaitaire de 40 euros due au titre des frais de recouvrement (Art. 441-6, I al. 12 du code de commerce et D. 441-5 ibidem).

                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Stack>}</>
        );
}