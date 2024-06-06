import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import { FileDownload, FileOpen } from '@mui/icons-material';
import { Avatar, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

export default function EstablishmentActivityAuthorization({activityAuthorizations}) {
  return (
    <Timeline position="alternate">
      {activityAuthorizations?.map((activityAuthorization, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Date de début :</b> {getFormatDate(activityAuthorization?.startingDateTime) + ' '} <br />
            <b>Date de fin :</b> {getFormatDate(activityAuthorization?.startingDateTime) + ' '}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
              <Tooltip title={activityAuthorization?.document ? "Cliquez pour voir le doocument" : "Aucun doocument"}>
                <TimelineDot>
                    <FileOpen 
                      sx={{cursor: 'pointer'}}
                      onClick={() => {
                        activityAuthorization?.document ? window.open(activityAuthorization?.document) : false
                      }}
                    />
                </TimelineDot>
              </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            {activityAuthorization?.document && <Button variant="text" size="small" sx={{textTransform: 'capitalize'}}
              onClick={() => {
                window.open(activityAuthorization?.document);
              }}>
              Voir le document
            </Button>}
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              <Chip
                label={`Capacité: ${activityAuthorization?.capacity} dont temporaire: ${activityAuthorization?.temporaryCapacity}`}
                variant="outlined"
              />
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
