import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';
import CommentItem from './CommentItem';
import { Box } from '@mui/material';

export default function ListComments({comments}) {
  const messagesEndRef = React.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  React.useEffect(() => {
    scrollToBottom();
  }, [comments]);
  return (
    <>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.,
          },
        }}
      >
          {comments?.map((comment, index) => (
                  <CommentItem key={index} index={index} comment={comment} isLastOne={index >= comments?.length - 1}/>
              ))}
      </Timeline>
      <Box ref={messagesEndRef} />
    </>
  );
}
