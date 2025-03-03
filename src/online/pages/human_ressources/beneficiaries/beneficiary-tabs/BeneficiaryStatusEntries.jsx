import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import { FolderShared  } from '@mui/icons-material';
import { Avatar, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

export default function BeneficiaryStatusEntries({beneficiaryStatusEntries}) {
  return (
    <Timeline position="alternate">
      {beneficiaryStatusEntries?.map((beneficiaryStatusEntry, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Date de début :</b> {getFormatDate(beneficiaryStatusEntry?.startingDate) + ' '} <br />
            <b>Date de fin :</b> {getFormatDate(beneficiaryStatusEntry?.endingDate) + ' '}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
              <Tooltip title={beneficiaryStatusEntry?.document ? "Cliquez pour voir le justificatif" : "Aucun justificatif"}>
                <TimelineDot>
                    <FolderShared 
                      sx={{cursor: 'pointer'}}
                      onClick={() => {
                        beneficiaryStatusEntry?.document ? window.open(beneficiaryStatusEntry?.document) : false
                      }}
                    />
                </TimelineDot>
              </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            {beneficiaryStatusEntry?.document && <Button variant="text" size="small" sx={{textTransform: 'capitalize'}}
              onClick={() => {
                window.open(beneficiaryStatusEntry?.document);
              }}>
              Voir le justificatif
            </Button>}
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              {beneficiaryStatusEntry?.beneficiaryStatus && <Chip
                label={beneficiaryStatusEntry?.beneficiaryStatus?.name}
                variant="outlined"
              />}
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
