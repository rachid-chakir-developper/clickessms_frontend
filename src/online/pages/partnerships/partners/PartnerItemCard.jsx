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
  Folder,
  AccountBox,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function PartnerItemCard({
  partner,
  onDeletePartner,
  onUpdatePartnerState,
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
      <Tooltip title={partner?.name}>
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={partner?.name}
          src={partner?.photo ? partner?.photo : '/default-placeholder.jpg'}
          sx={{ borderRadius: 0.6, height: 100, width: 100 }}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {partner?.name}
          </Typography>
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            fontWeight="regular"
          >
            {`${partner?.email}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeletePartner(partner?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!partner?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!partner?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdatePartnerState(partner?.id)}
            >
              {!partner?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/partenariats/partenaires/modifier/${partner?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {partner?.folder && (
            <Tooltip title="Pièces jointes">
              <IconButton
                aria-label="Attachment"
                size="small"
                sx={{ flexGrow: 0 }}
                onClick={() => onOpenDialogListLibrary(partner?.folder)}
              >
                <Folder fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Détails">
            <Link
              to={`/online/partenariats/partenaires/details/${partner?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <AccountBox fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
