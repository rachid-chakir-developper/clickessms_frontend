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

export default function BeneficiaryAdmissionDocuments({beneficiaryAdmissionDocuments}) {
  return (
    <Timeline position="alternate">
      {beneficiaryAdmissionDocuments?.map((beneficiaryAdmissionDocument, index) => (
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Date de début :</b> {getFormatDate(beneficiaryAdmissionDocument?.startingDate) + ' '} <br />
            <b>Date de fin :</b> {getFormatDate(beneficiaryAdmissionDocument?.startingDate) + ' '}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
              <Tooltip title="Cliquez pour voir le doocument">
                <TimelineDot>
                    <FileOpen 
                      sx={{cursor: 'pointer'}}
                      onClick={() => {
                        window.open(beneficiaryAdmissionDocument?.document);
                      }}
                    />
                </TimelineDot>
              </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Button variant="text" size="small" sx={{textTransform: 'capitalize'}}
              onClick={() => {
                window.open(beneficiaryAdmissionDocument?.document);
              }}>
              Voir le doocument
            </Button>
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              {beneficiaryAdmissionDocument?.financier && <Chip
                avatar={
                  <Avatar
                    alt={beneficiaryAdmissionDocument?.financier?.name}
                    src={
                      beneficiaryAdmissionDocument?.financier?.image
                        ? beneficiaryAdmissionDocument?.financier?.image
                        : '/default-placeholder.jpg'
                    }
                  />
                }
                label={beneficiaryAdmissionDocument?.financier?.name}
                variant="outlined"
              />}
            </Stack>
            <Stack direction="row" justifyContent={index%2 === 0 ?  "start" : "end"} spacing={1} sx={{marginY : 1}}>
              {beneficiaryAdmissionDocument?.admissionDocumentType && <Chip
                label={beneficiaryAdmissionDocument?.admissionDocumentType?.name}
                variant="outlined"
              />}
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}