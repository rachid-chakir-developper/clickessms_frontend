import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, MenuItem, Popover, Stack, Tooltip } from '@mui/material';
import {
  Delete,
  PauseRounded,
  PlayArrowRounded,
  Edit,
  AccountBox,
  MoreVert,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';

export default function BeneficiaryGroupItemCard({
  beneficiaryGroup,
  onDeleteBeneficiaryGroup,
  onUpdateBeneficiaryGroupState,
}) {
  //   const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const onGoToDetails = ()=>{
    navigate(`/online/ressources-humaines/beneficiaires/groupes/details/${beneficiaryGroup?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative', p: 1}}
    >
      <Tooltip title={beneficiaryGroup?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={beneficiaryGroup?.name}
            src={
              beneficiaryGroup?.image
                ? beneficiaryGroup?.image
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
                <Typography color="text.primary" fontWeight="medium" fontSize={18}>
                  {beneficiaryGroup?.name}
                </Typography>
                <Typography
                  component="div"
                  variant="caption"
                  color="text.secondary"
                  fontWeight="regular"
                >
                  À {`${getFormatDateTime(beneficiaryGroup?.startingDateTime)}`}
                </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Tooltip>
      <Stack direction="row" alignItems="start" spacing={1.5} sx={{position: 'absolute', top: 0, right: 0, zIndex: 10}}>
          <IconButton onClick={handleOpenMenu}>
              <MoreVert />
          </IconButton>
          <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
              {beneficiaryGroup?.beneficiaryGroupParent && (
              <Tooltip
                title={`L'éstablishment parent: ${beneficiaryGroup?.beneficiaryGroupParent?.name}`}
              >
                <Link
                  to={`/online/ressources-humaines/beneficiaires/groupes/details/${beneficiaryGroup?.beneficiaryGroupParent?.id}`}
                  className="no_style"
                >
                  <MenuItem onClick={handleCloseMenu}>
                    <Avatar
                      alt={`${beneficiaryGroup?.beneficiaryGroupParent?.name}`}
                      src={beneficiaryGroup?.beneficiaryGroupParent?.image}
                    />
                  </MenuItem>
                </Link>
              </Tooltip>
            )}
            {onDeleteBeneficiaryGroup && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeleteBeneficiaryGroup(beneficiaryGroup?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {onUpdateBeneficiaryGroupState && (
              <Tooltip
                title={!beneficiaryGroup?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!beneficiaryGroup?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdateBeneficiaryGroupState(beneficiaryGroup?.id); handleCloseMenu()}}
                >
                  {!beneficiaryGroup?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!beneficiaryGroup?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Link
                to={`/online/ressources-humaines/beneficiaires/groupes/modifier/${beneficiaryGroup?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Edit fontSize="small" />
                  Modifier
                </MenuItem>
              </Link>
            </Tooltip>
            <Tooltip title="Détails">
              <Link
                to={`/online/ressources-humaines/beneficiaires/groupes/details/${beneficiaryGroup?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <AccountBox fontSize="small" />
                  Détails
                </MenuItem>
              </Link>
            </Tooltip>
          </Popover>
      </Stack>
    </Card>
  );
}
