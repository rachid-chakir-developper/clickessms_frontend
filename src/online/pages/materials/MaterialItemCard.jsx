import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack, Tooltip } from '@mui/material';
import { Delete, PauseRounded, PlayArrowRounded, Edit, Folder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';

export default function MaterialItemCard({material, onDeleteMaterial, onUpdateMaterialState}) {
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
    <Card variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, }}>
      <Tooltip title={material?.name}>
        <CardMedia component="img" width="100" height="100" alt={material?.name}
          src={ material?.image ? material?.image : "/default-placeholder.jpg"}
          sx={{ borderRadius: 0.6, height: 100, width: 100}}
        />
      </Tooltip>
      <Stack direction="column" spacing={2} alignItems="center">
        <Stack direction="column" spacing={0.2} alignItems="center">
          <Typography color="text.primary" fontWeight="medium" fontSize={18}>
            {material?.name}
          </Typography>
          <Typography component="div" variant="caption" color="text.secondary" fontWeight="regular" >
            {`${material?.designation}`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Tooltip title="Supprimer">
            <IconButton aria-label="delete" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onDeleteMaterial(material?.id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={!material?.isActive ? 'Activer' : 'Désactiver'}>
            <IconButton
              aria-label={!material?.isActive ? 'play' : 'pause'}
              sx={{ mx: 1 }}
              onClick={() => onUpdateMaterialState(material?.id)}
            >
              {!material?.isActive ? <PlayArrowRounded /> : <PauseRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link to={`/online/materiels/modifier/${material?.id}`} className="no_style">
              <IconButton aria-label="edit" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Link>
          </Tooltip>
          {material?.folder && <Tooltip title="Pièces jointes">
            <IconButton aria-label="Attachment" size="small" sx={{ flexGrow: 0 }}
              onClick={()=> onOpenDialogListLibrary(material?.folder)}>
              <Folder fontSize="small" />
            </IconButton>
          </Tooltip>}
        </Stack>
      </Stack>
    </Card>
  );
}
