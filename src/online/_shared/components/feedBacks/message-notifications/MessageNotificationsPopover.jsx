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
  Announcement,
} from '@mui/icons-material';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function MessageNotificationsPopover({
  messageNotifications = [],
  notReadCount = 0,
  loadMoreMessageNotification,
  onMarkMessageNotificationsAsRead,
}) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        size="large"
        color={open ? 'default' : 'inherit'}
        onClick={handleOpen}
      >
        <Badge badgeContent={notReadCount} color="error">
          <Announcement />
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
            <Typography variant="subtitle1">Infos et messages</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {notReadCount < 1 && (
                <span>Vous n'avez aucune nouvelle infos</span>
              )}
              {notReadCount === 1 && (
                <span>Vous avez une nouvelle infos</span>
              )}
              {notReadCount > 1 && (
                <span>Vous avez {notReadCount} nouvelles infos</span>
              )}
            </Typography>
          </Box>

          {notReadCount > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={onMarkMessageNotificationsAsRead}>
                <DoneAll />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ height: { xs: 340, sm: 'auto' } }}>
          {notReadCount > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader
                  disableSticky
                  sx={{ py: 1, px: 2.5, typography: 'overline' }}
                >
                  Infos non vues
                </ListSubheader>
              }
            >
              {messageNotifications
                .filter((n) => !n?.isRead)
                .map((messageNotification) => (
                  <MessageNotificationItem
                    key={messageNotification?.id}
                    messageNotification={messageNotification}
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
                Infos vues
              </ListSubheader>
            }
          >
            {messageNotifications
              .map((messageNotification) => (
                <MessageNotificationItem
                  key={messageNotification?.id}
                  messageNotification={messageNotification}
                  onClick={handleClose}
                />
              ))}
          </List>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple onClick={loadMoreMessageNotification}>
            Voir plus
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function MessageNotificationItem({ messageNotification, onClick }) {
  const { setMessageNotificationModal } = useFeedBacks();
  const { avatar, title } = renderContent(messageNotification);

  const onOpenMessageNotificationModal  = (data) => {
    onClick()
    setMessageNotificationModal({
      isOpen: true,
      data,
      onClose: () => {
        setMessageNotificationModal({ isOpen: false });
      },
    });
  };

  return (
      <ListItemButton
        alignItems="flex-start"
        sx={{
          ...(!messageNotification?.isRead && {
            bgcolor: 'action.selected',
          }),
        }}
        onClick={()=>onOpenMessageNotificationModal([messageNotification])}
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
              {`${getFormatDateTime(messageNotification.createdAt)}`}
            </Typography>
          }
        />
      </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(messageNotification) {
  const title = (
    <>
      <Typography variant="subtitle2">{messageNotification.title}</Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {messageNotification.message}
      </Typography>
    </>
  );

  if (messageNotification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={messageNotification.title}
          src={"/assets/icons/ic_messageNotification_package.svg"}
        />
      ),
      title,
    };
  }
  if (messageNotification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={messageNotification.title}
          src="/assets/icons/ic_messageNotification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (messageNotification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={messageNotification.title}
          src="/assets/icons/ic_messageNotification_mail.svg"
        />
      ),
      title,
    };
  }
  if (messageNotification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={messageNotification.title}
          src="/assets/icons/ic_messageNotification_chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: messageNotification?.image
      ? messageNotification?.image
      : null,
    title,
  };
}
