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
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';

export default function VehicleItemCard({
  vehicle,
  onDeleteVehicle,
  onUpdateVehicleState,
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
      <Tooltip title={vehicle?.name}>
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={vehicle?.name}
          src={vehicle?.image ? vehicle?.image : '/default-placeholder.jpg'}
          sx={{ borderRadius: 0.6, height: 100, width: 100 }}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {vehicle?.name}
          </Typography>
          <Typography color="text.primary" fontWeight="regular" fontSize={14}>
            Matricule : <b>{vehicle?.registrationNumber}</b>
          </Typography>
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            fontWeight="regular"
          >
            {`${vehicle?.designation}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeleteVehicle(vehicle?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!vehicle?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!vehicle?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateVehicleState(vehicle?.id)}
            >
              {!vehicle?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/vehicules/modifier/${vehicle?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {vehicle?.folder && (
            <Tooltip title="Pièces jointes">
              <IconButton
                aria-label="Attachment"
                size="small"
                sx={{ flexGrow: 0 }}
                onClick={() => onOpenDialogListLibrary(vehicle?.folder)}
              >
                <Folder fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
