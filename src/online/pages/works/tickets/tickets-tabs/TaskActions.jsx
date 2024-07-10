import * as React from 'react';
import { Box, Paper, Typography, Chip, Stack, ListItem, ListItemIcon, ListItemText, List, Avatar } from '@mui/material';

import { getFormatDate } from '../../../../../_shared/tools/functions';
import { AssignmentInd } from '@mui/icons-material';
import TaskActionStatusLabelMenu from '../../actions/TaskActionStatusLabelMenu';

export default function TicketActions({ taskActions }) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          margin: 'auto',
          width: '100%',
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
        }}
      >
      <Typography variant="h6" gutterBottom>
        Les actions
      </Typography>
        {taskActions.length > 0 && (
            <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {taskActions?.map((ticketAction, index) => (
                    <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                    <ListItem
                      alignItems="flex-start"
                      key={index}
                    >
                      <ListItemIcon>
                        <AssignmentInd />
                      </ListItemIcon>
                      <ListItemText
                        primary={ticketAction?.description}
                        secondary={ticketAction?.dueDate ? `Échéance: ${getFormatDate(ticketAction?.dueDate)}` : ''}
                      />
                      <ListItemIcon>
                        <TaskActionStatusLabelMenu taskAction={ticketAction} disabled={true}/>
                      </ListItemIcon>
                    </ListItem>
                    {ticketAction?.employees?.length > 0 && (
                        <>
                          <Typography variant="p" gutterBottom sx={{fontSize: 12, fontStyle: 'italic'}}>
                            Personnes concernées
                          </Typography>
                          <Stack direction="row" flexWrap='wrap' spacing={1}>
                            {ticketAction?.employees?.map((employee, index) => (
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
                            ))}
                          </Stack>
                        </>
                      )}
                  </Box>
                  ))}
                </List>
            </Paper>
        )}
      </Paper>
    );
  }