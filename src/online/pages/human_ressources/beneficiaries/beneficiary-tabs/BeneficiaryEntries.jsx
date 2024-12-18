import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import { Home } from '@mui/icons-material';
import { Avatar, Chip, Stack } from '@mui/material';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../employees/EmployeeChip';

export default function BeneficiaryEntries({beneficiaryEntries}) {
  return (
    <Timeline position="alternate">
      {beneficiaryEntries?.map((beneficiaryEntry, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Date d'entré :</b> {getFormatDate(beneficiaryEntry?.entryDate) + ' '}<br />
            <b>Date d'échéance :</b> {getFormatDate(beneficiaryEntry?.dueDate) + ' '}<br />
            <b>Date de sortie :</b> {getFormatDate(beneficiaryEntry?.releaseDate) + ' '}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
              <TimelineDot>
                <Home />
              </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              {beneficiaryEntry?.establishments?.map((establishment, index) => <EstablishmentChip key={index} establishment={establishment} />)}
            </Stack>
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              {beneficiaryEntry?.internalReferents?.map((employee, index) => <EmployeeChip key={index} employee={employee} />)}
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}