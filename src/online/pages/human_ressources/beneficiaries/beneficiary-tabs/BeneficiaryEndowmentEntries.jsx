import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { formatCurrencyAmount, getFormatDate } from '../../../../../_shared/tools/functions';
import { FolderShared, Money  } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

export default function BeneficiaryEndowmentEntries({beneficiaryEndowmentEntries}) {
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
    </Stack>
  );
}
