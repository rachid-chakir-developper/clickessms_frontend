import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { getFormatDate } from '../../../../../_shared/tools/functions';
import { FileDownload, FileOpen, Home, Person } from '@mui/icons-material';
import { Avatar, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

export default function VehicleEmployees({vehicleEmployees}) {
  return (
    <Timeline position="alternate">
      {vehicleEmployees?.map((vehicleEmployee, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Date de début :</b> {getFormatDate(vehicleEmployee?.startingDate) + ' '} <br />
            <b>Date de fin :</b> {getFormatDate(vehicleEmployee?.startingDate) + ' '}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <Person />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              {vehicleEmployee?.employees?.map((employee, index) => {
                return (
                  <Chip
                    key={index}
                    avatar={
                      <Avatar
                        alt={`${employee?.firstName} ${employee?.lastName}`}
                        src={
                          employee?.photo
                            ? employee?.photo
                            : '/default-placeholder.jpg'
                        }
                      />
                    }
                    label={`${employee?.firstName} ${employee?.lastName}`}
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
