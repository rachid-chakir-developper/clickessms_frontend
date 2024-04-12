import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack, Tooltip } from '@mui/material';
import { Delete, PauseRounded, PlayArrowRounded, Edit, Article } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function TheObjectItemCard({theObject, onDeleteTheObject, onUpdateTheObjectState}) {
//   const theme = useTheme();
  const [paused, setPaused] = React.useState(false)
  return (
    <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, }}>
      <Tooltip title={theObject?.name}>
        <CardMedia component="img" width="100" height="100" alt={theObject?.name}
          src={ theObject?.image ? theObject?.image : "/default-placeholder.jpg"}
          sx={{ borderRadius: 0.6, height: 100, width: 100}}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {theObject?.name}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton aria-label="delete" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onDeleteTheObject(theObject?.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!theObject?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!theObject?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateTheObjectState(theObject?.id)}
            >
              {!theObject?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link to={`/online/recuperations/objets/modifier/${theObject?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Détails">
            <Link to={`/online/recuperations/objets/details/${theObject?.id}`} className="no_style">
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
