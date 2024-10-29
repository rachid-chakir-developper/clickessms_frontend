import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Stack, Tooltip } from '@mui/material';
import {
  Delete,
  PauseRounded,
  PlayArrowRounded,
  Edit,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function CompanyItemCard({
  company,
  onDeleteCompany,
  onUpdateCompanyState,
}) {
  //   const theme = useTheme();
  const [paused, setPaused] = React.useState(false);
  return (
    <Card
      variant="outlined"
      sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <Tooltip title={`${company?.firstName} ${company?.lastName}`}>
        <CardMedia
          component="img"
          width="100"
          height="100"
          alt={`${company?.firstName} ${company?.lastName}`}
          src={company?.photo ? company?.photo : '/default-placeholder.jpg'}
          sx={{ borderRadius: 0.6, height: 100, width: 100 }}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {`${company?.firstName} ${company?.lastName}`}
          </Typography>
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            fontWeight="regular"
          >
            {`${company?.email}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {company?.employee && (
            <Tooltip
              title={`L'employé: ${company?.employee?.firstName} ${company?.employee?.lastName}`}
            >
              <Link
                to={`/online/employes/details/${company?.employee?.id}`}
                className="no_style"
              >
                <Avatar
                  alt={`${company?.employee?.firstName} ${company?.employee?.lastName}`}
                  src={company?.employee?.photo}
                />
              </Link>
            </Tooltip>
          )}
          {company?.partner && (
            <Tooltip
              title={`Le partenaire: ${company?.partner?.name}`}
            >
              <Link
                to={`/online/partenariats/partenaires/details/${company?.partner?.id}`}
                className="no_style"
              >
                <Avatar
                  alt={`${company?.partner?.name}`}
                  src={company?.partner?.photo}
                />
              </Link>
            </Tooltip>
          )}
          {company?.financier && (
            <Tooltip
              title={`Le financeur: ${company?.financier?.name}`}
            >
              <Link
                to={`/online/partenariats/financeurs/details/${company?.financier?.id}`}
                className="no_style"
              >
                <Avatar
                  alt={`${company?.financier?.name}`}
                  src={company?.financier?.photo}
                />
              </Link>
            </Tooltip>
          )}
          {company?.supplier && (
            <Tooltip
              title={`Le fournisseur: ${company?.supplier?.name}`}
            >
              <Link
                to={`/online/achats/fournisseurs/details/${company?.supplier?.id}`}
                className="no_style"
              >
                <Avatar
                  alt={`${company?.supplier?.name}`}
                  src={company?.supplier?.photo}
                />
              </Link>
            </Tooltip>
          )}
          <Tooltip title="Supprimer">
            <IconButton
              aria-label="delete"
              size="small"
              sx={{ flexGrow: 0 }}
              onClick={() => onDeleteCompany(company?.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!company?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!company?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateCompanyState(company?.id)}
            >
              {!company?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link
              to={`/online/associations/modifier/${company?.id}`}
              className="no_style"
            >
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
