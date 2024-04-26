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
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFormatDateTime } from '../../../../_shared/tools/functions';

export default function LetterItemCard({
  letter,
  onDeleteLetter,
  onUpdateLetterState,
}) {
  //   const theme = useTheme();
  const [paused, setPaused] = React.useState(false);
  return (
    <Card
      variant="outlined"
      sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Tooltip title={letter?.title}>
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={letter?.title}
          src={letter?.image ? letter?.image : '/default-placeholder.jpg'}
          sx={{ borderRadius: 0.6, height: 100, width: 100 }}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {letter?.title}
          </Typography>
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            fontWeight="regular"
          >
            À {`${getFormatDateTime(letter?.startingDateTime)}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeleteLetter(letter?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!letter?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!letter?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateLetterState(letter?.id)}
            >
              {!letter?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/administratif/courriers/modifier/${letter?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Détails">
            <Link
              to={`/online/administratif/courriers/details/${letter?.id}`}
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
