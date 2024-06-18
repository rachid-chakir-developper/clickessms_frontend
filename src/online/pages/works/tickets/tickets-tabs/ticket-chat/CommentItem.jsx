import * as React from 'react';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import { getFormatDateTime } from '../../../../../../_shared/tools/functions';

export default function CommentItem({comment , isLastOne=false, index}) {
  const { creator, createdAt} = comment;
  return (
      <TimelineItem>
        <TimelineOppositeContent color="textSecondary" >
          {getFormatDateTime(createdAt)}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot>
            <Avatar src={creator?.photo ? creator?.photo : '/default-placeholder.jpg'}>
              {`${creator?.firstName.charAt(0)} ${creator?.lastName.charAt(0)}`}
            </Avatar>
          </TimelineDot>
          {!isLastOne && <TimelineConnector  sx={{height: 60}}/>}
        </TimelineSeparator>
        <TimelineContent sx={{ marginLeft: 1, py: '12px', px: 2,  borderRadius: 4, background: index%2 === 0 ?  "#f5f5f5" : "#ffffff" }}>
          <Typography variant="h6" component="div" sx={{marginBottom: 1, fontStyle: 'italic'}}>
            {`${creator?.firstName} ${creator?.lastName}`}
          </Typography>
          <Typography>{comment.text}</Typography>
        </TimelineContent>
      </TimelineItem>
  );
}
