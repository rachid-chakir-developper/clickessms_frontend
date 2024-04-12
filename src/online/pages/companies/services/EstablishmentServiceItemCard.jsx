import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Stack, Tooltip } from '@mui/material';
import { Delete, PauseRounded, PlayArrowRounded, Edit, Folder, AccountBox } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';

export default function EstablishmentServiceItemCard({establishmentService, onDeleteEstablishmentService, onUpdateEstablishmentServiceState }) {
//   const theme = useTheme();
  const  { setDialogListLibrary } = useFeedBacks();
  const onOpenDialogListLibrary = (folderParent) => {
      setDialogListLibrary({
        isOpen: true,
        folderParent,
        onClose: () => { 
            setDialogListLibrary({isOpen: false})
          }
      })
  }
  return (
    <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, }} >
      <Tooltip title={establishmentService?.name}>
        <CardMedia component="img" width="100" height="100" alt={establishmentService?.name}
          src={ establishmentService?.image ? establishmentService?.image : "/default-placeholder.jpg"}
          sx={{ borderRadius: 0.6, height: 100, width: 100}}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {establishmentService?.name}
          </Typography>
          <Typography color="text.primary" fontWeight="medium" fontSize={14}>
            {establishmentService?.siret}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          { establishmentService?.establishmentServiceParent && <Tooltip title={`L'éstablishment parent: ${establishmentService?.establishmentServiceParent?.name}`}>
            <Link to={`/online/associations/services/details/${establishmentService?.establishmentServiceParent?.id}`} className="no_style">
              <Avatar alt={`${establishmentService?.establishmentServiceParent?.name}`} 
                src={establishmentService?.establishmentServiceParent?.image} />
            </Link>
          </Tooltip>}
          {onDeleteEstablishmentService && <Tooltip title="Supprimer">
            <IconButton aria-label="delete" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onDeleteEstablishmentService(establishmentService?.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>}
          {onUpdateEstablishmentServiceState && <Tooltip title={!establishmentService?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!establishmentService?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateEstablishmentServiceState(establishmentService?.id)}
            >
              {!establishmentService?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>}
          <Tooltip title="Modifier">
            <Link to={`/online/associations/services/modifier/${establishmentService?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {establishmentService?.folder && <Tooltip title="Pièces jointes">
            <IconButton aria-label="Attachment" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onOpenDialogListLibrary(establishmentService?.folder)}>
              <Folder fontSize="small" />
            </IconButton>
          </Tooltip>}
          <Tooltip title="Détails">
            <Link to={`/online/associations/services/details/${establishmentService?.id}`} className="no_style">
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
