import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Stack, Tooltip } from '@mui/material';
import { Delete, PauseRounded, PlayArrowRounded, Edit, Folder, AccountBox } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';

export default function EstablishmentItemCard({establishment, onDeleteEstablishment, onUpdateEstablishmentState }) {
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
      <Tooltip title={establishment?.name}>
        <CardMedia component="img" width="100" height="100" alt={establishment?.name}
          src={ establishment?.logo ? establishment?.logo : "https://mui.com/static/images/cards/real-estate.png"}
          sx={{ borderRadius: 0.6, height: 100, width: 100}}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {establishment?.name}
          </Typography>
          <Typography color="text.primary" fontWeight="medium" fontSize={14}>
            {establishment?.siret}
          </Typography>
          <Typography component="div" variant="caption" color="text.secondary" fontWeight="regular" >
            {`${establishment?.email}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          { establishment?.establishmentParent && <Tooltip title={`L'éstablishment parent: ${establishment?.establishmentParent?.name}`}>
            <Link to={`/online/etablissements/details/${establishment?.establishmentParent?.id}`} className="no_style">
              <Avatar alt={`${establishment?.establishmentParent?.name}`} 
                src={establishment?.establishmentParent?.photo} />
            </Link>
          </Tooltip>}
          {onDeleteEstablishment && <Tooltip title="Supprimer">
            <IconButton aria-label="delete" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onDeleteEstablishment(establishment?.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>}
          {onUpdateEstablishmentState && <Tooltip title={!establishment?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!establishment?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateEstablishmentState(establishment?.id)}
            >
              {!establishment?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>}
          <Tooltip title="Modifier">
            <Link to={`/online/etablissements/modifier/${establishment?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {establishment?.folder && <Tooltip title="Pièces jointes">
            <IconButton aria-label="Attachment" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onOpenDialogListLibrary(establishment?.folder)}>
              <Folder fontSize="small" />
            </IconButton>
          </Tooltip>}
          <Tooltip title="Détails">
            <Link to={`/online/etablissements/details/${establishment?.id}`} className="no_style">
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
