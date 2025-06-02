import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { WorkspacePremium } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';
import { getFormatDate, getGovernanceRoleLabel } from '../../../../_shared/tools/functions';

export default function GovernanceMemberRolesTimeline({ governanceMemberRoles }) {
  return (
    <Timeline position="left">
      {governanceMemberRoles?.map((governanceMemberRole, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            <b>Élu le :</b> {getFormatDate(governanceMemberRole?.startingDateTime)}<br />
            <b>Fin du mandat le :</b> {getFormatDate(governanceMemberRole?.endingDateTime)}
          </TimelineOppositeContent>

          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
              <WorkspacePremium />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Chip
              label={governanceMemberRole?.role === 'OTHER' ? governanceMemberRole?.otherRole : getGovernanceRoleLabel(governanceMemberRole?.role)}
              color="primary"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
