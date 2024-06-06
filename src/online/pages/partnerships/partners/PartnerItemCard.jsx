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
  Folder,
  AccountBox,
  MoreVert,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function PartnerItemCard({
  partner,
  onDeletePartner,
  onUpdatePartnerState,
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
  const onGoToDetails = ()=>{
    navigate(`/online/partenariats/partenaires/details/${partner?.id}`);
  }
  return (
    <Card
      variant="outlined"
      sx={{ position: 'relative'}}
    >
      <Tooltip title={partner?.name}>
        <Stack direction="row"
        sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2, cursor:'pointer' }}
        onClick={onGoToDetails}>
          <CardMedia
            component="img"
            width="100"
            height="100"
            alt={partner?.name}
            src={
              partner?.photo
                ? partner?.photo
                : '/default-placeholder.jpg'
            }
            sx={{ borderRadius: 0.6, height: 100, width: 100 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="column" spacing={0.2} alignItems="center">
              <Typography color="text.primary" fontWeight="medium" fontSize={18}>
                {partner?.name}
              </Typography>
              {partner?.email && <Typography color="text.primary" fontWeight="small" fontSize={12}>
                {partner?.email}
              </Typography>}
              {partner?.address && <><Typography color="text.primary" fontWeight="medium" fontSize={14}>
                {partner?.address}
              </Typography>
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
                fontWeight="regular"
              >
                {`${partner?.zipCode} ${partner?.city}`}
              </Typography></>}
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
              {partner?.partnerParent && (
              <Tooltip
                title={`L'éstablishment parent: ${partner?.partnerParent?.name}`}
              >
                <Link
                  to={`/online/partenariats/partenaires/details/${partner?.partnerParent?.id}`}
                  className="no_style"
                >
                  <MenuItem onClick={handleCloseMenu}>
                    <Avatar
                      alt={`${partner?.partnerParent?.name}`}
                      src={partner?.partnerParent?.photo}
                    />
                  </MenuItem>
                </Link>
              </Tooltip>
            )}
            {onDeletePartner && (
              <Tooltip title="Supprimer">
                <MenuItem
                  onClick={() => {onDeletePartner(partner?.id); handleCloseMenu()}}
                >
                  <Delete fontSize="small" />
                  Supprimer
                </MenuItem>
              </Tooltip>
            )}
            {onUpdatePartnerState && (
              <Tooltip
                title={!partner?.isActive ? 'Activer' : 'Désactiver'}
              >
                <MenuItem
                  aria-label={!partner?.isActive ? 'play' : 'pause'}
                  onClick={() => {onUpdatePartnerState(partner?.id); handleCloseMenu()}}
                >
                  {!partner?.isActive ? (
                    <PlayArrowRounded />
                  ) : (
                    <PauseRounded />
                  )}
                  {!partner?.isActive ? 'Activer' : 'Désactiver'}
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Modifier">
              <Link
                to={`/online/partenariats/partenaires/modifier/${partner?.id}`}
                className="no_style"
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Edit fontSize="small" />
                  Modifier
                </MenuItem>
              </Link>
            </Tooltip>
            {partner?.folder && (
              <Tooltip title="Pièces jointes">
                <MenuItem
                  onClick={() => {onOpenDialogListLibrary(partner?.folder); handleCloseMenu()}}
                >
                  <Folder fontSize="small" />
                  Pièces jointes
                </MenuItem>
              </Tooltip>
            )}
            <Tooltip title="Détails">
              <Link
                to={`/online/partenariats/partenaires/details/${partner?.id}`}
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
