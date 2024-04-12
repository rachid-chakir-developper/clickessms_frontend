import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack, Tooltip } from '@mui/material';
import { Delete, PauseRounded, PlayArrowRounded, Edit, Article } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';

export default function EmployeeGroupItemCard({employeeGroup, onDeleteEmployeeGroup, onUpdateEmployeeGroupState}) {
//   const theme = useTheme();
  const [paused, setPaused] = React.useState(false)
  return (
    <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, }}>
      <Tooltip title={employeeGroup?.name}>
        <CardMedia component="img" width="100" height="100" alt={employeeGroup?.name}
          src={ employeeGroup?.image ? employeeGroup?.image : "/default-placeholder.jpg"}
          sx={{ borderRadius: 0.6, height: 100, width: 100}}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {employeeGroup?.name}
          </Typography>
            <Typography component="div" variant="caption" color="text.secondary" fontWeight="regular" >
              À {`${getFormatDateTime(employeeGroup?.startingDateTime)}`}
            </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton aria-label="delete" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onDeleteEmployeeGroup(employeeGroup?.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!employeeGroup?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!employeeGroup?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateEmployeeGroupState(employeeGroup?.id)}
            >
              {!employeeGroup?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link to={`/online/ressources-humaines/employes/groupes/modifier/${employeeGroup?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Détails">
            <Link to={`/online/ressources-humaines/employes/groupes/details/${employeeGroup?.id}`} className="no_style">
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
