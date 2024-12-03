import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { Stack } from '@mui/material';
import {
  AccessTimeOutlined,
  DoneAll,
  Notifications,
} from '@mui/icons-material';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import { Link } from 'react-router-dom';

export default function NotificationsPopover({
  notifications = [],
  notSeenCount = 0,
  loadMoreNotification,
  onMarkNotificationsAsSeen,
}) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    onMarkNotificationsAsSeen()
    setOpen(null);
  };

  return (
    <>
      <IconButton
        size="large"
        color={open ? 'default' : 'inherit'}
        onClick={handleOpen}
      >
        <Badge badgeContent={notSeenCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
            maxHeight: '500px',
            '&::-webkit-scrollbar': {
              width: '6px',
              display: 'none',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '0px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
            '&:hover': {
              '&::-webkit-scrollbar': {
                display: 'block',
              },
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {notSeenCount < 1 && (
                <span>Vous n'avez aucune nouvelle notification</span>
              )}
              {notSeenCount === 1 && (
                <span>Vous avez une nouvelle notification</span>
              )}
              {notSeenCount > 1 && (
                <span>Vous avez {notSeenCount} nouvelles notifications</span>
              )}
            </Typography>
          </Box>

          {notSeenCount > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={onMarkNotificationsAsSeen}>
                <DoneAll />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ height: { xs: 340, sm: 'auto' } }}>
          {notSeenCount > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{ py: 1, px: 2.5, typography: 'overline' }}
                >
                  Notifications non vues
                </ListSubheader>
              }
            >
              {notifications
                .filter((n) => !n?.isSeen)
                .map((notification) => (
                  <NotificationItem
                    key={notification?.id}
                    notification={notification}
                    onClick={handleClose}
                  />
                ))}
            </List>
          )}

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                Notifications vues
              </ListSubheader>
            }
          >
            {notifications
              .filter((n) => n?.isSeen)
              .map((notification) => (
                <NotificationItem
                  key={notification?.id}
                  notification={notification}
                  onClick={handleClose}
                />
              ))}
          </List>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={loadMoreNotification}>
            Voir plus
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification, onClick }) {
  const { avatar, title } = renderContent(notification);
  const getNotificationPath = ()=>{
    const {task, undesirableEvent, taskAction, meetingDecision, employeeAbsence, expense} = notification
    if(task) return `/online/travaux/interventions/details/${task?.id}`
    if(undesirableEvent) return `/online/qualites/evenements-indesirables/details/${undesirableEvent?.id}`
    if(taskAction) return `/online/travaux/actions/details/${taskAction?.id}`
    if(meetingDecision) return `/online/travaux/actions/`
    if(employeeAbsence) return`/online/planning/absences-employes/details/${employeeAbsence?.id}`
    if(expense) return `/online/achats/depenses-engagements/details/${expense?.id}`
    return '#';
  }
  return (
    <Link
      to={getNotificationPath()}
      className="no_style"
      onClick={onClick}
    >
      <ListItemButton
        alignItems="flex-start"
        sx={{
          ...(!notification?.isSeen && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'background.neutral' }} src={avatar}></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <AccessTimeOutlined
                fontSize="small"
                sx={{ width: 15, height: 15, mr: 0.5 }}
              />
              {`${getFormatDateTime(notification.createdAt)}`}
            </Typography>
          }
        />
      </ListItemButton>
    </Link>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <>
      <Typography variant="subtitle2">{notification.title}</Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {notification.message}
      </Typography>
    </>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: notification?.sender?.employee?.photo
      ? notification?.sender?.employee?.photo
      : null,
    title,
  };
}
