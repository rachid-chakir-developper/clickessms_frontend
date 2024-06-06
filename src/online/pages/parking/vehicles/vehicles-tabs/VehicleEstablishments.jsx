import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import { FileDownload, FileOpen, Home } from '@mui/icons-material';
import { Avatar, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

export default function VehicleEstablishments({vehicleEstablishments}) {
  return (
    <Timeline position="alternate">
      {vehicleEstablishments?.map((vehicleEstablishment, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Date de début :</b> {getFormatDate(vehicleEstablishment?.startingDate) + ' '} <br />
            <b>Date de fin :</b> {getFormatDate(vehicleEstablishment?.startingDate) + ' '}
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
              {vehicleEstablishment?.establishments?.map((establishment, index) => {
                return (
                  <Chip
                    key={index}
                    avatar={
                      <Avatar
                        alt={establishment?.name}
                        src={
                          establishment?.logo
                            ? establishment?.logo
                            : '/default-placeholder.jpg'
                        }
                      />
                    }
                    label={establishment?.name}
                    variant="outlined"
                  />
                );
              })}
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
