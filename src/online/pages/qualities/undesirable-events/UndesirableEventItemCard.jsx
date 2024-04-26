import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack, Tooltip } from '@mui/material';
import {
  Delete,
  PauseRounded,
  PlayArrowRounded,
  Edit,
  Article,
  Folder,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function UndesirableEventItemCard({
  undesirableEvent,
  onDeleteUndesirableEvent,
  onUpdateUndesirableEventState,
}) {
  //   const theme = useTheme();
  const { setDialogListLibrary } = useFeedBacks();
  const onOpenDialogListLibrary = (folderParent) => {
    setDialogListLibrary({
      isOpen: true,
      folderParent,
      onClose: () => {
        setDialogListLibrary({ isOpen: false });
      },
    });
  };
  return (
    <Card
      variant="outlined"
      sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Tooltip title={undesirableEvent?.title}>
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={undesirableEvent?.title}
          src={
            undesirableEvent?.image
              ? undesirableEvent?.image
              : '/default-placeholder.jpg'
          }
          sx={{ borderRadius: 0.6, height: 100, width: 100 }}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {undesirableEvent?.title}
          </Typography>
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            fontWeight="regular"
          >
            À {`${getFormatDateTime(undesirableEvent?.startingDateTime)}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeleteUndesirableEvent(undesirableEvent?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={!undesirableEvent?.isActive ? 'Activer' : 'Désactiver'}
          >
            <IconButton
              aria-label={!undesirableEvent?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() =>
                onUpdateUndesirableEventState(undesirableEvent?.id)
              }
            >
              {!undesirableEvent?.isActive ? (
                <PlayArrowRounded />
              ) : (
                <PauseRounded />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/qualites/evenements-indesirables/modifier/${undesirableEvent?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {undesirableEvent?.folder && (
            <Tooltip title="Pièces jointes">
              <IconButton
                aria-label="Attachment"
                size="small"
                sx={{ flexGrow: 0 }}
                onClick={() =>
                  onOpenDialogListLibrary(undesirableEvent?.folder)
                }
              >
                <Folder fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Détails">
            <Link
              to={`/online/qualites/evenements-indesirables/details/${undesirableEvent?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Article fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
