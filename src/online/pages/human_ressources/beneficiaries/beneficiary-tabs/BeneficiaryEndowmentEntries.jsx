import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { formatCurrencyAmount, getFormatDate } from '../../../../../_shared/tools/functions';
import {  Money  } from '@mui/icons-material';
import { Box, Button, Chip, Card, CardContent, Typography, Grid, Stack, Tooltip } from '@mui/material';

const BalanceDetails = ({ balanceDetails }) => {
    const { details, totals }  = typeof balanceDetails === 'string'? JSON.parse(balanceDetails) : balanceDetails || {};
  return (<>
    { (details || totals) && <Box>

            {/* Totaux */}
            {totals && <Box mt={3}>
                <Typography variant="body1" sx={{fontWeight: 700}}>Totaux</Typography>
                <Box sx={{paddingLeft: 2}}>
                    <Typography variant="body1">Solde total: <b>{formatCurrencyAmount(totals.balance)}</b></Typography>
                    <Typography variant="body1">Dotations versées totales: {formatCurrencyAmount(totals.endowments_paid)}</Typography>
                    <Typography variant="body1">Dépenses totales: {formatCurrencyAmount(totals.expenses)}</Typography>
                </Box>
            </Box>}
            {/* Détails des dotations */}
            {details && <Box sx={{paddingTop: 2}}> 
                <Typography variant="body1" sx={{fontStyle: 'italic', fontWeight: 700}} gutterBottom>
                    Détails par type de dotation
                </Typography>
                <Grid container spacing={3}>
                    {Object.keys(details).map((type) => (
                        <Grid item xs={12} sm={12} md={12} key={type}>
                            <Card>
                            <CardContent>
                                <Typography variant="body1" sx={{fontStyle: 'italic', fontWeight: 500}}>{type}</Typography>
                                <Box sx={{paddingLeft: 2}}>
                                    <Typography variant="body1">Solde initial: {formatCurrencyAmount(details[type].initial_balance)}</Typography>
                                    <Typography variant="body1">Dotations versées: {formatCurrencyAmount(details[type].endowments_paid)}</Typography>
                                    <Typography variant="body1">Dépenses: {formatCurrencyAmount(details[type].expenses)}</Typography>
                                </Box>
                            </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>}
        </Box>}
    </>
  );
};

export default function BeneficiaryEndowmentEntries({beneficiary}) {
    const { beneficiaryEndowmentEntries, balanceDetails } = beneficiary

    return (
        <Stack direction="row" justifyContent="center" spacing={1} sx={{marginY : 1}}>
            <Timeline position="alternate">
                {beneficiaryEndowmentEntries?.map((beneficiaryEndowmentEntry, index) => (
                    <TimelineItem key={index}>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                    >
                        <b>Date de début :</b> {getFormatDate(beneficiaryEndowmentEntry?.startingDate) + ' '} <br />
                        <b>Date de fin :</b> {getFormatDate(beneficiaryEndowmentEntry?.endingDate) + ' '}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <Tooltip>
                            <TimelineDot>
                                <Money />
                            </TimelineDot>
                        </Tooltip>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
                            <Box>
                                {beneficiaryEndowmentEntry?.endowmentType && <Chip
                                    label={beneficiaryEndowmentEntry?.endowmentType?.name}
                                    variant="outlined"
                                />}
                                <Typography variant="body2">
                                    <b>Solde initial:</b>{formatCurrencyAmount(beneficiaryEndowmentEntry?.initialBalance)}
                                </Typography>
                            </Box>
                        </Stack>
                    </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
            <BalanceDetails balanceDetails={balanceDetails} />
        </Stack>
    );
}
